"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Inbox,
  Box,
  BarChart3,
  Settings,
  ScanLine,
  Package as PackageIcon,
  Users,
  CheckCircle2,
  AlertTriangle,
  X,
  Camera,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LoopLogo } from "@/components/loop-logo";
import { toArabicDigits } from "@/lib/arabic";
import { cn } from "@/lib/utils";

const NAV = [
  { icon: LayoutDashboard, label: "لوحة التحكم", active: true },
  { icon: Inbox,           label: "الاستلامات",  active: false },
  { icon: Box,             label: "الصندوق",      active: false },
  { icon: BarChart3,       label: "التقارير",     active: false },
  { icon: Settings,        label: "الإعدادات",    active: false },
];

const RECENT = [
  { time: "منذ ٥ دقائق",   customer: "عبدالرحمن ت.", count: 3, points: 30, status: "complete" as const },
  { time: "منذ ٢٠ دقيقة",  customer: "فاطمة س.",      count: 1, points: 10, status: "complete" as const },
  { time: "منذ ساعة",       customer: "محمد ع.",       count: 5, points: 50, status: "complete" as const },
  { time: "منذ ٣ ساعات",   customer: "سارة ك.",       count: 2, points: 20, status: "complete" as const },
];

export default function PharmacyDashboard() {
  const [scanModal, setScanModal] = useState<null | {
    customer: string;
    count: number;
    points: number;
  }>(null);

  return (
    <div className="min-h-[100dvh] bg-loop-surface-soft flex" dir="rtl">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-white border-l border-loop-border">
        <div className="p-5 border-b border-loop-border">
          <LoopLogo size={32} />
        </div>
        <div className="p-4">
          <div className="rounded-2xl bg-loop-blue-50 p-3">
            <p className="text-xs font-bold text-loop-blue-800">الصيدلية</p>
            <p className="text-sm font-bold text-loop-ink mt-1">
              النهدي - حي العليا
            </p>
            <p className="text-xs text-loop-muted mt-1">شارع العليا الرئيسي</p>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                  item.active
                    ? "bg-loop-blue-50 text-loop-blue-700"
                    : "text-loop-body hover:bg-loop-surface-soft"
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-loop-border">
          <Link
            href="/profile"
            className="flex items-center gap-2 text-xs text-loop-muted px-3 py-2 hover:text-loop-ink"
          >
            <ArrowRight className="size-4" />
            تبديل العرض
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 bg-white border-b border-loop-border h-14 px-4 flex items-center justify-between">
        <LoopLogo size={28} />
        <Link href="/profile" className="text-xs text-loop-muted">تبديل العرض ←</Link>
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <header className="px-4 md:px-8 py-6 border-b border-loop-border bg-white">
          <p className="text-sm text-loop-muted">صباح الخير 👋</p>
          <h1 className="text-xl md:text-2xl font-extrabold text-loop-ink mt-0.5">
            صيدلية النهدي - حي العليا
          </h1>
        </header>

        <div className="p-4 md:p-8 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <BigStat tone="blue" value={toArabicDigits(23)} label="عملية استلام اليوم" icon={<Inbox className="size-5" />} />
            <BoxFillStat />
            <BigStat tone="purple" value={toArabicDigits(127)} label="زبون شارك هذا الشهر" icon={<Users className="size-5" />} />
            <BigStat tone="orange" value={toArabicDigits(840)} label="إجمالي العلب المستلمة" icon={<PackageIcon className="size-5" />} />
          </div>

          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 flex items-start gap-3">
            <AlertTriangle className="size-5 text-yellow-700 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-900 leading-relaxed">
              الصندوق ممتلئ بنسبة <span className="font-bold">{toArabicDigits(45)}٪</span>. سيتم جدولة استلام تلقائي عند {toArabicDigits(80)}٪.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3 rounded-3xl bg-white border border-loop-border shadow-card p-6 md:p-8 text-center"
            >
              <div className="mx-auto h-16 w-16 rounded-2xl bg-loop-blue-gradient inline-flex items-center justify-center shadow-glow">
                <ScanLine className="size-8 text-white" />
              </div>
              <h2 className="mt-4 text-xl font-extrabold text-loop-ink">
                📱 امسح رمز الزبون
              </h2>
              <p className="mt-1 text-sm text-loop-muted max-w-sm mx-auto">
                وجّه الكاميرا نحو رمز QR الذي يعرضه الزبون لاستلام الأدوية
              </p>
              <button
                onClick={() =>
                  setScanModal({ customer: "عبدالرحمن التركستاني", count: 3, points: 30 })
                }
                className="group mt-6 mx-auto flex flex-col items-center justify-center w-full max-w-sm aspect-[4/3] rounded-3xl border-2 border-dashed border-loop-blue-200 bg-loop-blue-50/50 hover:bg-loop-blue-50 transition-colors"
              >
                <Camera className="size-10 text-loop-blue-600 group-hover:scale-110 transition-transform" />
                <span className="mt-3 text-sm font-bold text-loop-blue-700">
                  محاكاة المسح (للعرض)
                </span>
              </button>
            </motion.div>

            <div className="lg:col-span-2 rounded-3xl bg-white border border-loop-border shadow-card p-5">
              <h3 className="font-bold text-loop-ink mb-3">آخر العمليات</h3>
              <div className="divide-y divide-loop-border">
                {RECENT.map((r, i) => (
                  <div key={i} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-loop-green-50 text-loop-green-700 inline-flex items-center justify-center shrink-0">
                        <CheckCircle2 className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-loop-ink truncate">
                          {r.customer}
                        </p>
                        <p className="text-xs text-loop-muted">
                          {r.time} • {toArabicDigits(r.count)} علب
                        </p>
                      </div>
                    </div>
                    <Badge variant="green">+{toArabicDigits(r.points)}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {scanModal && (
        <div
          className="fixed inset-0 z-50 bg-loop-ink/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={() => setScanModal(null)}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-glow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-loop-green-gradient inline-flex items-center justify-center">
                <CheckCircle2 className="size-7 text-white" />
              </div>
              <button
                onClick={() => setScanModal(null)}
                aria-label="إغلاق"
                className="h-9 w-9 rounded-full hover:bg-loop-surface-soft inline-flex items-center justify-center"
              >
                <X className="size-5 text-loop-muted" />
              </button>
            </div>
            <h2 className="text-xl font-extrabold text-loop-ink">
              تأكيد استلام الأدوية
            </h2>
            <p className="mt-1 text-sm text-loop-body">
              تم التحقق من الرمز بنجاح
            </p>

            <div className="mt-4 rounded-2xl bg-loop-surface-soft p-4 space-y-2">
              <Row label="الزبون" value={scanModal.customer} />
              <Row label="عدد العلب" value={`${toArabicDigits(scanModal.count)} علب`} />
              <Row
                label="النقاط الممنوحة"
                value={`+${toArabicDigits(scanModal.points)}`}
                valueClass="text-loop-green-700"
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button variant="outline" size="lg" onClick={() => setScanModal(null)}>
                رفض
              </Button>
              <Button
                variant="green"
                size="lg"
                onClick={() => {
                  setScanModal(null);
                }}
              >
                تأكيد الاستلام
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-loop-muted">{label}</span>
      <span className={`font-bold text-loop-ink ${valueClass || ""}`}>{value}</span>
    </div>
  );
}

function BigStat({
  tone,
  value,
  label,
  icon,
}: {
  tone: "blue" | "green" | "purple" | "orange";
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  const map = {
    blue:   "from-loop-blue-50    text-loop-blue-700",
    green:  "from-loop-green-50   text-loop-green-700",
    purple: "from-purple-50       text-purple-700",
    orange: "from-orange-50       text-orange-700",
  };
  return (
    <div className="rounded-2xl bg-white border border-loop-border shadow-card p-4">
      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br to-white ${map[tone]} inline-flex items-center justify-center`}>
        {icon}
      </div>
      <div className="mt-3 text-2xl font-extrabold text-loop-ink">{value}</div>
      <div className="mt-1 text-xs text-loop-muted">{label}</div>
    </div>
  );
}

function BoxFillStat() {
  return (
    <div className="rounded-2xl bg-white border border-loop-border shadow-card p-4">
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-loop-green-50 to-white text-loop-green-700 inline-flex items-center justify-center">
        <Box className="size-5" />
      </div>
      <div className="mt-3 text-2xl font-extrabold text-loop-ink">{toArabicDigits(45)}٪</div>
      <div className="mt-1 text-xs text-loop-muted mb-2">امتلاء الصندوق</div>
      <Progress
        value={45}
        indicatorClassName="bg-loop-green-gradient"
      />
    </div>
  );
}
