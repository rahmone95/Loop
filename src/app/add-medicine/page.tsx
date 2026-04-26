"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Camera,
  Loader2,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Bell,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScreenHeader } from "@/components/screen-header";
import { PageShell } from "@/components/page-shell";
import {
  useLoopState,
  computeStatus,
  type NotificationPrefs,
} from "@/lib/store";
import { cn } from "@/lib/utils";

const FOR_WHOM = ["لي شخصيًا", "الوالد", "الوالدة", "الأطفال", "عام للأسرة", "شخص آخر"];

export default function AddMedicinePage() {
  const router = useRouter();
  const { update } = useLoopState();
  const boxRef = useRef<HTMLInputElement>(null);
  const expRef = useRef<HTMLInputElement>(null);

  const [boxImage, setBoxImage] = useState<string | null>(null);
  const [expiryImage, setExpiryImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [aiBadge, setAiBadge] = useState(false);

  const [name, setName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [forWhom, setForWhom] = useState(FOR_WHOM[0]);
  const [notes, setNotes] = useState("");
  const [notifs, setNotifs] = useState<NotificationPrefs>({
    before30: true,
    before7: true,
    onDay: true,
    daily: false,
  });

  function pickFile(setter: (s: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => setter(ev.target?.result as string);
      reader.readAsDataURL(file);
    };
  }

  async function runAi() {
    if (!boxImage || !expiryImage) return;
    setScanning(true);
    try {
      const res = await fetch("/api/analyze-medicine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boxImage: boxImage.split(",")[1],
          expiryImage: expiryImage.split(",")[1],
          boxMediaType: "image/jpeg",
          expiryMediaType: "image/jpeg",
        }),
      });
      const data = await res.json();
      setName(data.name || "");
      setExpiryDate(data.expiryDate || "");
      setAiBadge(true);
    } catch {
      toast.error("تعذّر التحليل، أكمل يدويًا");
    } finally {
      setScanning(false);
    }
  }

  function onSave() {
    if (!name.trim() || !expiryDate) {
      toast.error("الرجاء إدخال اسم الدواء وتاريخ الانتهاء");
      return;
    }
    const id = `m_${Date.now()}`;
    const status = computeStatus(expiryDate);
    update((prev) => ({
      ...prev,
      medicines: [
        {
          id,
          name: name.trim(),
          expiryDate,
          purchaseDate,
          forWhom,
          status,
          notes: notes.trim(),
          photoUrl: boxImage,
          expiryPhotoUrl: expiryImage,
          notifications: notifs,
          createdAt: new Date().toISOString(),
        },
        ...prev.medicines,
      ],
    }));
    toast.success("تمت الإضافة! سنذكّرك عند اقتراب تاريخ الانتهاء");
    setTimeout(() => router.push("/cabinet"), 700);
  }

  const status = expiryDate ? computeStatus(expiryDate) : null;

  return (
    <PageShell>
      <ScreenHeader title="إضافة دواء للخزانة" />
      <div className="p-4 pb-10 space-y-5">
        <input
          ref={boxRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={pickFile((s) => {
            setBoxImage(s);
            if (expiryImage) setTimeout(runAi, 100);
          })}
        />
        <input
          ref={expRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={pickFile((s) => {
            setExpiryImage(s);
            if (boxImage) setTimeout(runAi, 100);
          })}
        />

        <div className="rounded-2xl bg-loop-surface-tinted border border-loop-green-100 p-3.5 flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-white inline-flex items-center justify-center shrink-0">
            <Lightbulb className="size-5 text-loop-green-700" />
          </div>
          <p className="text-sm text-loop-green-900 leading-relaxed">
            صوّر الدواء وتاريخ الانتهاء، وسنذكّرك قبل انتهاء صلاحيته.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <PhotoBox
            label="١. صورة العلبة"
            image={boxImage}
            onClick={() => boxRef.current?.click()}
            onClear={() => setBoxImage(null)}
          />
          <PhotoBox
            label="٢. صورة تاريخ الانتهاء"
            image={expiryImage}
            onClick={() => expRef.current?.click()}
            onClear={() => setExpiryImage(null)}
          />
        </div>
        <p className="text-xs text-loop-muted -mt-2">
          يفضّل تقريب الكاميرا من تاريخ الانتهاء لقراءة دقيقة
        </p>

        {scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl bg-loop-blue-50 border border-loop-blue-100 p-4 flex items-center gap-3"
          >
            <Loader2 className="size-5 animate-spin text-loop-blue-700" />
            <p className="text-sm font-semibold text-loop-blue-800">
              جاري قراءة المعلومات بالذكاء الاصطناعي...
            </p>
          </motion.div>
        )}

        {aiBadge && !scanning && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-loop-green-50 text-loop-green-700 px-3 py-1.5 text-xs font-semibold"
          >
            <Sparkles className="size-3.5" />
            تم التعرّف بواسطة Loop AI — راجع المعلومات قبل الحفظ
          </motion.div>
        )}

        <div className="space-y-4">
          <div>
            <Label>اسم الدواء</Label>
            <Input
              placeholder="مثال: بنادول إكسترا ٥٠٠ ملغ"
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
            {status === "expired" && (
              <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                <AlertTriangle className="size-3.5" />
                هذا الدواء منتهي الصلاحية
              </p>
            )}
            {status === "nearExpiry" && (
              <p className="mt-2 text-xs text-orange-600">⏰ يقترب من الانتهاء</p>
            )}
          </div>

          <div>
            <Label>تاريخ الشراء (اختياري)</Label>
            <Input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="text-left"
              dir="ltr"
            />
            <p className="mt-1.5 text-[11px] text-loop-muted">
              يساعدنا في فهم أنماط استهلاكك
            </p>
          </div>

          <div>
            <Label>لمن هذا الدواء؟</Label>
            <div className="grid grid-cols-2 gap-2">
              {FOR_WHOM.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setForWhom(opt)}
                  className={cn(
                    "h-11 rounded-xl border text-sm font-semibold transition-all",
                    forWhom === opt
                      ? "border-loop-blue-500 bg-loop-blue-50 text-loop-blue-700 ring-2 ring-loop-blue-500/20"
                      : "border-loop-border bg-white text-loop-body hover:bg-loop-surface-soft"
                  )}
                >
                  {opt}
                </button>
              ))}
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

          <div className="rounded-2xl border border-loop-border bg-white overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-loop-border">
              <div className="h-10 w-10 rounded-xl bg-loop-blue-50 text-loop-blue-700 inline-flex items-center justify-center">
                <Bell className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-loop-ink">تذكيرات الانتهاء</p>
                <p className="text-xs text-loop-muted">
                  لحماية أسرتك من الأدوية المنتهية
                </p>
              </div>
            </div>
            <div className="divide-y divide-loop-border">
              <NotifToggle
                label="قبل ٣٠ يومًا من الانتهاء"
                value={notifs.before30}
                onChange={(v) => setNotifs((p) => ({ ...p, before30: v }))}
              />
              <NotifToggle
                label="قبل ٧ أيام من الانتهاء"
                value={notifs.before7}
                onChange={(v) => setNotifs((p) => ({ ...p, before7: v }))}
              />
              <NotifToggle
                label="يوم الانتهاء"
                value={notifs.onDay}
                onChange={(v) => setNotifs((p) => ({ ...p, onDay: v }))}
              />
              <NotifToggle
                label="تذكير يومي بعد الانتهاء حتى التسليم"
                value={notifs.daily}
                onChange={(v) => setNotifs((p) => ({ ...p, daily: v }))}
              />
            </div>
          </div>

          <Button variant="gradient" size="lg" width="full" onClick={onSave}>
            إضافة للخزانة
          </Button>
        </div>
      </div>
    </PageShell>
  );
}

function PhotoBox({
  label,
  image,
  onClick,
  onClear,
}: {
  label: string;
  image: string | null;
  onClick: () => void;
  onClear: () => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "relative w-full overflow-hidden rounded-2xl border-2 border-dashed transition-all aspect-square",
          image
            ? "border-loop-blue-400 bg-white"
            : "border-loop-blue-200 bg-loop-blue-50/50 hover:bg-loop-blue-50"
        )}
      >
        {image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={label} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <p className="text-[11px] font-bold text-white">{label}</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 h-full p-3">
            <div className="h-10 w-10 rounded-xl bg-loop-blue-gradient inline-flex items-center justify-center">
              <Camera className="size-5 text-white" />
            </div>
            <p className="text-xs font-bold text-loop-blue-800 text-center leading-tight">
              {label}
            </p>
          </div>
        )}
      </button>
      {image && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          aria-label="حذف"
          className="absolute top-2 left-2 h-7 w-7 rounded-full bg-white text-loop-ink shadow-card inline-flex items-center justify-center"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

function NotifToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between p-4 hover:bg-loop-surface-soft transition-colors text-right"
    >
      <span className="text-sm font-semibold text-loop-ink">{label}</span>
      <span
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors shrink-0",
          value ? "bg-loop-blue-600" : "bg-loop-border"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            value ? "right-0.5" : "right-[22px]"
          )}
        />
      </span>
    </button>
  );
}
