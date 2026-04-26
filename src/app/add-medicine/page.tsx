"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Loader2,
  Sparkles,
  AlertTriangle,
  Clock,
  Package as PackageIcon,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScreenHeader } from "@/components/screen-header";
import { PageShell } from "@/components/page-shell";
import { useLoopState, type MedicineStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: {
  value: MedicineStatus;
  label: string;
  icon: React.ReactNode;
  tone: string;
}[] = [
  { value: "expired",    label: "منتهي الصلاحية",   icon: <AlertTriangle className="size-4" />, tone: "border-red-200    bg-red-50    text-red-700" },
  { value: "nearExpiry", label: "قارب على الانتهاء", icon: <Clock className="size-4" />,         tone: "border-orange-200 bg-orange-50 text-orange-700" },
  { value: "unused",     label: "لم أعد أحتاجه",    icon: <PackageIcon className="size-4" />,   tone: "border-loop-blue-200 bg-loop-blue-50 text-loop-blue-700" },
];

export default function AddMedicinePage() {
  const router = useRouter();
  const { update } = useLoopState();
  const fileRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [status, setStatus] = useState<MedicineStatus | "">("");
  const [notes, setNotes] = useState("");
  const [aiBadge, setAiBadge] = useState(false);

  const isExpired = status === "expired";

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      setImagePreview(dataUrl);
      setScanning(true);
      try {
        const base64 = dataUrl.split(",")[1];
        const res = await fetch("/api/analyze-medicine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64, mediaType: file.type }),
        });
        const data = await res.json();
        setName(data.name || "");
        setExpiryDate(data.expiryDate || "");
        setStatus(data.status || "expired");
        setAiBadge(true);
      } catch {
        toast.error("تعذر تحليل الصورة، أكمل يدويًا");
      } finally {
        setScanning(false);
      }
    };
    reader.readAsDataURL(file);
  }

  function onSave() {
    if (!name.trim() || !status) {
      toast.error("الرجاء إدخال اسم الدواء وحالته");
      return;
    }
    const id = `m_${Date.now()}`;
    update((prev) => ({
      ...prev,
      medicines: [
        {
          id,
          name: name.trim(),
          expiryDate,
          status: status as MedicineStatus,
          notes: notes.trim(),
          createdAt: new Date().toISOString(),
        },
        ...prev.medicines,
      ],
    }));
    toast.success("تم الحفظ! الدواء جاهز للتسليم");
    setTimeout(() => router.push("/my-medicines"), 700);
  }

  return (
    <PageShell>
      <ScreenHeader title="إضافة دواء" />
      <div className="p-4 pb-10">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={onPickImage}
        />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={scanning}
          className={cn(
            "relative w-full overflow-hidden rounded-3xl border-2 border-dashed transition-all",
            imagePreview
              ? "border-loop-blue-400 bg-white"
              : "border-loop-blue-200 bg-loop-blue-50/50 hover:bg-loop-blue-50"
          )}
        >
          <div className="aspect-[4/3] flex flex-col items-center justify-center gap-3 p-6 text-center">
            {imagePreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="معاينة"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <AnimatePresence>
                  {scanning && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-loop-blue-700/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-white"
                    >
                      <Loader2 className="size-10 animate-spin" />
                      <p className="font-semibold">جاري التحليل بالذكاء الاصطناعي...</p>
                      <p className="text-xs text-white/80">قد يستغرق ثانيتين</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                <div className="h-14 w-14 rounded-2xl bg-loop-blue-gradient inline-flex items-center justify-center shadow-glow">
                  <Camera className="size-7 text-white" />
                </div>
                <p className="text-base font-bold text-loop-ink">
                  📷 صوّر علبة الدواء
                </p>
                <p className="text-sm text-loop-muted max-w-xs">
                  سيتعرّف عليه الذكاء الاصطناعي تلقائيًا ويعبّئ البيانات
                </p>
              </>
            )}
          </div>
        </button>

        {aiBadge && !scanning && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-loop-green-50 text-loop-green-700 px-3 py-1.5 text-xs font-semibold"
          >
            <Sparkles className="size-3.5" />
            تم التعرّف بواسطة Loop AI
          </motion.div>
        )}

        <div className="mt-6 space-y-5">
          <div>
            <Label>اسم الدواء</Label>
            <Input
              placeholder="مثال: بنادول إكسترا"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label>تاريخ الانتهاء</Label>
            <Input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="text-left"
              dir="ltr"
            />
            {isExpired && (
              <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                <AlertTriangle className="size-3.5" />
                هذا الدواء منتهي الصلاحية
              </p>
            )}
          </div>

          <div>
            <Label>الحالة</Label>
            <div className="grid grid-cols-1 gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const active = status === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border p-4 transition-all",
                      active
                        ? "border-loop-blue-500 bg-loop-blue-50 ring-2 ring-loop-blue-500/20"
                        : "border-loop-border bg-white hover:bg-loop-surface-soft"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "h-9 w-9 rounded-xl inline-flex items-center justify-center border",
                          opt.tone
                        )}
                      >
                        {opt.icon}
                      </span>
                      <span className="text-sm font-semibold text-loop-ink">
                        {opt.label}
                      </span>
                    </div>
                    {active && <CheckCircle2 className="size-5 text-loop-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label>ملاحظات (اختياري)</Label>
            <Textarea
              placeholder="مثلاً: متبقي ٨ حبات، الكورس لم يكتمل..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <Button variant="gradient" size="lg" width="full" onClick={onSave}>
            حفظ في قائمتي
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
