"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Plus,
  Pill,
  ChevronLeft,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/screen-header";
import { PageShell } from "@/components/page-shell";
import { BottomNav } from "@/components/bottom-nav";
import {
  useLoopState,
  computeStatus,
  daysFromNow,
  type Medicine,
} from "@/lib/store";
import { toArabicDigits, formatArabicDate } from "@/lib/arabic";
import { cn } from "@/lib/utils";

type Filter = "all" | "expired" | "nearExpiry" | "valid";

export default function CabinetPage() {
  const { state, hydrated } = useLoopState();
  const [filter, setFilter] = useState<Filter>("all");

  const meds = useMemo(
    () => state.medicines.filter((m) => !m.delivered),
    [state.medicines]
  );

  const counts = useMemo(() => {
    const c = { all: meds.length, expired: 0, nearExpiry: 0, valid: 0 };
    meds.forEach((m) => {
      const s = computeStatus(m.expiryDate);
      c[s]++;
    });
    return c;
  }, [meds]);

  const filtered = useMemo(() => {
    if (filter === "all") return meds;
    return meds.filter((m) => computeStatus(m.expiryDate) === filter);
  }, [meds, filter]);

  return (
    <PageShell withBottomNav>
      <ScreenHeader title="خزانة دوائي" showBack={false} />

      <div className="px-4 pt-3">
        <p className="text-sm text-loop-body leading-relaxed">
          كل أدوية أسرتك في مكان واحد، مع تنبيهات الانتهاء
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <MiniStat
            value={hydrated ? toArabicDigits(counts.all) : "—"}
            label="إجمالي"
            tone="neutral"
          />
          <MiniStat
            value={hydrated ? toArabicDigits(counts.nearExpiry) : "—"}
            label="قاربت"
            tone="orange"
          />
          <MiniStat
            value={hydrated ? toArabicDigits(counts.expired) : "—"}
            label="منتهية"
            tone="red"
          />
        </div>

        {hydrated && counts.expired > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-3"
          >
            <div className="h-9 w-9 rounded-xl bg-red-500 text-white inline-flex items-center justify-center shrink-0">
              <AlertTriangle className="size-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-red-900 leading-snug">
                لديك {toArabicDigits(counts.expired)}{" "}
                {counts.expired === 1 ? "دواء" : "أدوية"} منتهي الصلاحية
              </p>
              <p className="mt-1 text-xs text-red-800">
                سلّمها عبر Loop الآن لتجنب الأخطار الصحية
              </p>
              <Button
                asChild
                size="sm"
                variant="destructive"
                className="mt-3"
              >
                <Link href="/pharmacies">سلّم الآن</Link>
              </Button>
            </div>
          </motion.div>
        )}

        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <Chip active={filter === "all"} onClick={() => setFilter("all")}>
            الكل ({toArabicDigits(counts.all)})
          </Chip>
          <Chip
            active={filter === "expired"}
            onClick={() => setFilter("expired")}
            tone="red"
          >
            🚨 منتهية ({toArabicDigits(counts.expired)})
          </Chip>
          <Chip
            active={filter === "nearExpiry"}
            onClick={() => setFilter("nearExpiry")}
            tone="orange"
          >
            ⚠️ قاربت ({toArabicDigits(counts.nearExpiry)})
          </Chip>
          <Chip
            active={filter === "valid"}
            onClick={() => setFilter("valid")}
            tone="green"
          >
            ✅ صالحة ({toArabicDigits(counts.valid)})
          </Chip>
        </div>
      </div>

      <div className="px-4 pt-4 pb-24 space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            filtered.map((m) => <MedicineCard key={m.id} med={m} />)
          )}
        </AnimatePresence>
      </div>

      {/* Floating add button */}
      <Link
        href="/add-medicine"
        aria-label="إضافة دواء"
        className="fixed bottom-20 left-4 z-40 h-14 w-14 rounded-full bg-loop-blue-gradient text-white inline-flex items-center justify-center shadow-glow active:scale-95 transition-transform"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <Plus className="size-7" strokeWidth={2.5} />
      </Link>

      <BottomNav />
    </PageShell>
  );
}

function MiniStat({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: "neutral" | "orange" | "red";
}) {
  const styles =
    tone === "red"
      ? "bg-red-50 border-red-100 text-red-800"
      : tone === "orange"
      ? "bg-orange-50 border-orange-100 text-orange-800"
      : "bg-white border-loop-border text-loop-ink";
  return (
    <div className={`rounded-2xl border p-3 text-center ${styles}`}>
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="mt-0.5 text-[11px] font-semibold opacity-80">{label}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tone?: "red" | "orange" | "green";
}) {
  const activeColor =
    tone === "red"
      ? "bg-red-600 text-white"
      : tone === "orange"
      ? "bg-orange-500 text-white"
      : tone === "green"
      ? "bg-loop-green-600 text-white"
      : "bg-loop-blue-600 text-white";
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 inline-flex items-center rounded-full px-4 h-9 text-sm font-semibold transition-all whitespace-nowrap",
        active
          ? `${activeColor} shadow-soft`
          : "bg-white border border-loop-border text-loop-body hover:bg-loop-surface-soft"
      )}
    >
      {children}
    </button>
  );
}

function MedicineCard({ med }: { med: Medicine }) {
  const status = computeStatus(med.expiryDate);
  const days = daysFromNow(med.expiryDate);

  const stripColor =
    status === "expired"
      ? "bg-red-500"
      : status === "nearExpiry"
      ? "bg-orange-500"
      : "bg-loop-green-500";

  const expiryText =
    status === "expired" ? (
      <span className="text-red-700 font-semibold">
        ❌ انتهت في {formatArabicDate(med.expiryDate)} (منذ {toArabicDigits(Math.abs(days))} يومًا)
      </span>
    ) : status === "nearExpiry" ? (
      <span className="text-orange-700 font-semibold">
        ⏰ تنتهي بعد {toArabicDigits(days)} يومًا ({formatArabicDate(med.expiryDate)})
      </span>
    ) : (
      <span className="text-loop-green-700 font-semibold">
        ✅ صالحة حتى {formatArabicDate(med.expiryDate)}
      </span>
    );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <Link
        href={`/cabinet/${med.id}`}
        className="relative flex items-stretch gap-3 rounded-2xl bg-white border border-loop-border shadow-card overflow-hidden hover:shadow-soft transition-all"
      >
        <div className={`w-1.5 ${stripColor}`} />
        <div className="flex-1 min-w-0 p-4 pr-1">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-loop-surface-soft inline-flex items-center justify-center">
              <Pill className="size-6 text-loop-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-bold text-loop-ink leading-snug truncate">
                {med.name}
              </h3>
              {med.forWhom && (
                <p className="mt-0.5 text-xs text-loop-muted flex items-center gap-1">
                  <Heart className="size-3" />
                  {med.forWhom}
                </p>
              )}
              <p className="mt-1.5 text-xs leading-relaxed">{expiryText}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            {status === "valid" ? (
              <span className="text-xs text-loop-muted font-semibold">
                التفاصيل ←
              </span>
            ) : (
              <Button
                asChild
                size="xs"
                variant="green"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <span>سلّم عبر Loop</span>
              </Button>
            )}
            <ChevronLeft className="size-4 text-loop-muted" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="h-20 w-20 rounded-full bg-loop-surface-soft inline-flex items-center justify-center mb-4">
        <Pill className="size-10 text-loop-muted" strokeWidth={1.5} />
      </div>
      <h2 className="text-base font-bold text-loop-ink">لا توجد أدوية في هذا التصنيف</h2>
      <p className="mt-1 text-sm text-loop-muted">جرّب تصنيفًا آخر أو أضف دواء جديد</p>
    </div>
  );
}
