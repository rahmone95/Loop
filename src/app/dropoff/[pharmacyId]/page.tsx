"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ShieldCheck,
  Share2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScreenHeader } from "@/components/screen-header";
import { PageShell } from "@/components/page-shell";
import { PHARMACIES } from "@/lib/mock-data";
import { useLoopState, type Medicine } from "@/lib/store";
import { toArabicDigits } from "@/lib/arabic";
import { cn } from "@/lib/utils";

type Step = "select" | "qr" | "success";

function DropoffContent() {
  const params = useParams<{ pharmacyId: string }>();
  const search = useSearchParams();
  const { state, update, hydrated } = useLoopState();

  const pharmacy = PHARMACIES.find((p) => p.id === params.pharmacyId);
  const preSelected = search.get("selectedMedicine");

  const available = useMemo(
    () => state.medicines.filter((m) => !m.delivered),
    [state.medicines]
  );

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [step, setStep] = useState<Step>("select");
  const [seconds, setSeconds] = useState(299);

  useEffect(() => {
    if (!hydrated) return;
    const initial = new Set<string>();
    if (preSelected) initial.add(preSelected);
    available
      .filter((m) => m.status === "expired")
      .forEach((m) => initial.add(m.id));
    setSelected(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    if (step !== "qr") return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [step]);

  if (!pharmacy) {
    return (
      <PageShell>
        <ScreenHeader title="تسليم الأدوية" />
        <div className="p-8 text-center text-loop-muted">صيدلية غير موجودة</div>
      </PageShell>
    );
  }

  const selectedMeds = available.filter((m) => selected.has(m.id));
  const expectedPoints = selectedMeds.length * 10;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function confirmDropoff() {
    if (!pharmacy) return;
    const ids = [...selected];
    const ph = pharmacy;
    update((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        points: prev.user.points + expectedPoints,
        totalRecovered: prev.user.totalRecovered + ids.length,
        co2Saved: +(prev.user.co2Saved + ids.length * 0.1).toFixed(2),
        waterProtected: +(prev.user.waterProtected + ids.length * 0.45).toFixed(2),
      },
      medicines: prev.medicines.map((m) =>
        ids.includes(m.id) ? { ...m, delivered: true } : m
      ),
      history: [
        {
          id: `h_${Date.now()}`,
          type: "delivery",
          title: `تسليم ${toArabicDigits(ids.length)} علب`,
          pharmacy: `${ph.name} ${ph.branch}`,
          points: expectedPoints,
          at: new Date().toISOString(),
        },
        ...prev.history,
      ],
    }));
    setStep("success");
  }

  return (
    <PageShell>
      <ScreenHeader title="تسليم الأدوية" showBack={step === "select"} />

      {step !== "success" && (
        <div className="px-4 pt-3">
          <div className="rounded-2xl bg-white border border-loop-border shadow-card p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-loop-blue-50 inline-flex items-center justify-center">
                <ShieldCheck className="size-6 text-loop-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-loop-ink truncate">
                  {pharmacy.name} - {pharmacy.branch}
                </h3>
                <p className="text-xs text-loop-muted truncate">{pharmacy.address}</p>
              </div>
              <Badge variant="green">صيدلية شريكة</Badge>
            </div>
          </div>

          <Stepper step={step} />
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="px-4 pt-4 pb-8"
          >
            <h2 className="font-bold text-loop-ink mb-3">الأدوية المراد تسليمها</h2>
            {available.length === 0 ? (
              <p className="text-sm text-loop-muted text-center py-12">
                لا توجد أدوية متاحة للتسليم. أضف دواء أولًا.
              </p>
            ) : (
              <div className="space-y-2">
                {available.map((m) => (
                  <SelectableMedicine
                    key={m.id}
                    med={m}
                    checked={selected.has(m.id)}
                    onToggle={() => toggle(m.id)}
                  />
                ))}
              </div>
            )}

            <div className="mt-5 rounded-2xl bg-loop-green-50 border border-loop-green-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-loop-green-700" />
                <span className="text-sm font-semibold text-loop-green-800">
                  النقاط المتوقعة
                </span>
              </div>
              <span className="text-2xl font-extrabold text-loop-green-800">
                +{toArabicDigits(expectedPoints)}
              </span>
            </div>

            <Button
              variant="gradient"
              size="lg"
              width="full"
              className="mt-4"
              disabled={selected.size === 0}
              onClick={() => setStep("qr")}
            >
              متابعة ({toArabicDigits(selected.size)} {selected.size === 1 ? "علبة" : "علب"})
            </Button>
          </motion.div>
        )}

        {step === "qr" && (
          <motion.div
            key="qr"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="px-4 pt-4 pb-8"
          >
            <div className="text-center">
              <h2 className="text-xl font-bold text-loop-ink">
                اعرض هذا الرمز للصيدلي
              </h2>
              <p className="mt-1 text-sm text-loop-body">
                الصيدلي سيمسح الرمز ويستلم الأدوية
              </p>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="rounded-3xl bg-white p-6 shadow-glow border border-loop-border">
                <QRCodeCanvas
                  value={JSON.stringify({
                    userId: state.user.id,
                    pharmacyId: pharmacy.id,
                    medicineIds: [...selected],
                    points: expectedPoints,
                    iat: Date.now(),
                  })}
                  size={220}
                  bgColor="#FFFFFF"
                  fgColor="#1E5BB8"
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-1">
              <span className="text-xs text-loop-muted">صلاحية الرمز</span>
              <span className="text-2xl font-bold text-loop-ink tabular-nums">
                {toArabicDigits(Math.floor(seconds / 60))}:
                {toArabicDigits(String(seconds % 60).padStart(2, "0"))}
              </span>
            </div>

            <Button
              variant="green"
              size="lg"
              width="full"
              className="mt-8"
              onClick={confirmDropoff}
            >
              <CheckCircle2 className="size-5" />
              محاكاة التأكيد من الصيدلية
            </Button>
            <p className="mt-2 text-center text-xs text-loop-muted">
              للعرض التجريبي فقط
            </p>
          </motion.div>
        )}

        {step === "success" && (
          <SuccessScreen
            count={selectedMeds.length}
            points={expectedPoints}
            balance={state.user.points}
            totalRecovered={state.user.totalRecovered}
          />
        )}
      </AnimatePresence>
    </PageShell>
  );
}

export default function DropoffPage() {
  return (
    <Suspense fallback={<PageShell><div className="p-8 text-center text-loop-muted">...</div></PageShell>}>
      <DropoffContent />
    </Suspense>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps = [
    { key: "select", label: "اختيار" },
    { key: "qr",     label: "رمز QR" },
    { key: "success",label: "تأكيد" },
  ];
  const currentIndex = steps.findIndex((s) => s.key === step);
  return (
    <div className="mt-4 flex items-center gap-2">
      {steps.map((s, i) => {
        const active = i <= currentIndex;
        return (
          <div key={s.key} className="flex-1 flex items-center gap-2">
            <div
              className={cn(
                "flex-1 h-1 rounded-full transition-colors",
                active ? "bg-loop-blue-600" : "bg-loop-border"
              )}
            />
            {i === steps.length - 1 && (
              <span className="text-[11px] font-semibold text-loop-muted whitespace-nowrap">
                {s.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SelectableMedicine({
  med,
  checked,
  onToggle,
}: {
  med: Medicine;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "w-full flex items-center gap-3 rounded-2xl border p-3.5 transition-all text-right",
        checked
          ? "border-loop-blue-500 bg-loop-blue-50 ring-2 ring-loop-blue-500/20"
          : "border-loop-border bg-white hover:bg-loop-surface-soft"
      )}
    >
      <div
        className={cn(
          "h-6 w-6 shrink-0 rounded-md border-2 inline-flex items-center justify-center transition-colors",
          checked
            ? "border-loop-blue-600 bg-loop-blue-600 text-white"
            : "border-loop-border bg-white"
        )}
      >
        {checked && <CheckCircle2 className="size-4" strokeWidth={2.5} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-loop-ink truncate">{med.name}</p>
        <p className="text-xs text-loop-muted truncate">
          {med.status === "expired" && "منتهي الصلاحية"}
          {med.status === "nearExpiry" && "قارب على الانتهاء"}
          {med.status === "unused" && "غير مستخدم"}
        </p>
      </div>
      <span className="text-xs font-bold text-loop-green-700">+{toArabicDigits(10)}</span>
    </button>
  );
}

function SuccessScreen({
  count,
  points,
  balance,
  totalRecovered,
}: {
  count: number;
  points: number;
  balance: number;
  totalRecovered: number;
}) {
  const [displayPoints, setDisplayPoints] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 1200;
    const tick = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayPoints(Math.round(points * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [points]);

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-white z-50 mx-auto max-w-md flex flex-col"
    >
      <Confetti />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 14 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-loop-green-200/40 blur-2xl scale-150" />
          <div className="relative h-24 w-24 rounded-full bg-loop-green-gradient inline-flex items-center justify-center shadow-glow-green">
            <CheckCircle2 className="size-14 text-white" strokeWidth={2.5} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-7 text-2xl font-extrabold text-loop-ink"
        >
          تم التسليم بنجاح! 🎉
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-loop-green-50 border border-loop-green-200 px-5 py-2.5"
        >
          <Sparkles className="size-5 text-loop-green-700" />
          <span className="text-2xl font-extrabold text-loop-green-800">
            +{toArabicDigits(displayPoints)}
          </span>
          <span className="text-sm font-semibold text-loop-green-700">نقطة Loop</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-5 text-sm text-loop-body max-w-xs"
        >
          شكرًا لمساهمتك في حماية البيئة وصحة المجتمع. علبتك في طريقها للمعالجة الآمنة.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-7 grid grid-cols-2 gap-3 w-full max-w-sm"
        >
          <MiniStat
            label="رصيدك الآن"
            value={`${toArabicDigits(balance)} نقطة`}
          />
          <MiniStat
            label="مستردة هذا الشهر"
            value={`${toArabicDigits(totalRecovered)} علبة`}
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="px-4 pb-8 space-y-3"
      >
        <Button asChild variant="gradient" size="lg" width="full">
          <Link href="/home">
            العودة للرئيسية
            <ArrowRight className="size-5" />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          width="full"
          onClick={() => {
            const text = `سلّمت ${toArabicDigits(count)} ${
              count === 1 ? "علبة" : "علب"
            } دواء عبر Loop واكتسبت ${toArabicDigits(points)} نقطة! 🌱`;
            if (navigator.share) {
              navigator.share({ text }).catch(() => {});
            } else {
              window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
                "_blank"
              );
            }
          }}
        >
          <Share2 className="size-5" />
          شارك إنجازك
        </Button>
      </motion.div>
    </motion.div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-loop-surface-soft p-3 text-center">
      <p className="text-[11px] text-loop-muted">{label}</p>
      <p className="mt-0.5 text-base font-extrabold text-loop-ink">{value}</p>
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => i);
  const colors = ["#1E5BB8", "#3FAE4F", "#5BC75A", "#FCD34D", "#2E6BCF"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((i) => {
        const left = (i * 17) % 100;
        const delay = (i % 8) * 0.15;
        const color = colors[i % colors.length];
        const size = 6 + (i % 4) * 2;
        return (
          <motion.span
            key={i}
            initial={{ y: -30, opacity: 1, rotate: 0 }}
            animate={{ y: 700, opacity: 0, rotate: 360 }}
            transition={{ duration: 2.2 + (i % 5) * 0.3, delay, ease: "easeIn" }}
            className="absolute rounded-sm"
            style={{
              left: `${left}%`,
              width: size,
              height: size * 0.6,
              backgroundColor: color,
            }}
          />
        );
      })}
    </div>
  );
}
