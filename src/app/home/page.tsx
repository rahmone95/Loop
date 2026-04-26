"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Plus,
  MapPin,
  Package,
  Leaf,
  Trophy,
  CheckCircle2,
  Gift,
  ChevronLeft,
  Sparkles,
  AlertTriangle,
  Pill,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/bottom-nav";
import { PageShell } from "@/components/page-shell";
import { useLoopState, computeStatus, daysFromNow } from "@/lib/store";
import { toArabicDigits } from "@/lib/arabic";

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  if (days === 0) return "اليوم";
  if (days === 1) return "أمس";
  if (days < 7) return `قبل ${toArabicDigits(days)} أيام`;
  if (days < 14) return "قبل أسبوع";
  if (days < 30) return `قبل ${toArabicDigits(Math.floor(days / 7))} أسابيع`;
  return `قبل ${toArabicDigits(Math.floor(days / 30))} شهر`;
}

export default function HomePage() {
  const { state, hydrated } = useLoopState();
  const firstName = state.user.name.split(" ")[0];

  const meds = state.medicines.filter((m) => !m.delivered);
  const expired = meds.filter((m) => computeStatus(m.expiryDate) === "expired");
  const nearExpiry = meds.filter((m) => computeStatus(m.expiryDate) === "nearExpiry");
  const showAlert = expired.length > 0 || nearExpiry.length > 0;
  const alertHasExpired = expired.length > 0;

  const unreadCount = useMemo(
    () => (state.notifications || []).filter((n) => !n.read).length,
    [state.notifications]
  );

  return (
    <PageShell withBottomNav>
      <header className="px-4 pt-6 pb-2 flex items-center justify-between">
        <div>
          <p className="text-loop-muted text-sm">أهلًا بك</p>
          <h1 className="text-xl font-bold text-loop-ink mt-0.5">
            {firstName} <span className="inline-block">👋</span>
          </h1>
        </div>
        <Link
          href="/notifications"
          aria-label="الإشعارات"
          className="relative h-11 w-11 inline-flex items-center justify-center rounded-2xl bg-white border border-loop-border shadow-card hover:bg-loop-surface-soft"
        >
          <Bell className="size-5 text-loop-ink" />
          {hydrated && unreadCount > 0 && (
            <span className="absolute top-1.5 left-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold inline-flex items-center justify-center ring-2 ring-white">
              {toArabicDigits(unreadCount)}
            </span>
          )}
        </Link>
      </header>

      <section className="px-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-loop-blue-gradient text-white shadow-glow"
        >
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-loop-green-500/30 blur-2xl" />

          <div className="relative p-5 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/85 text-sm font-medium">رصيدك من النقاط</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold tracking-tight">
                    {hydrated ? toArabicDigits(state.user.points) : "—"}
                  </span>
                  <span className="text-white/85 text-sm font-semibold">نقطة</span>
                </div>
                <p className="mt-2 text-white/85 text-xs">
                  = {hydrated ? toArabicDigits(Math.floor(state.user.points / 10)) : "—"}{" "}
                  ريال خصم في الصيدليات الشريكة
                </p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur-sm inline-flex items-center justify-center">
                <Trophy className="size-6 text-white" />
              </div>
            </div>

            <Link
              href="/rewards"
              className="mt-5 flex items-center justify-between rounded-2xl bg-white/12 hover:bg-white/18 backdrop-blur-sm px-4 py-3 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Gift className="size-4" />
                <span className="text-sm font-semibold">استبدل نقاطك بكوبونات</span>
              </div>
              <ChevronLeft className="size-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {hydrated && showAlert && (
        <section className="px-4 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl border p-4 ${
              alertHasExpired
                ? "bg-red-50 border-red-200"
                : "bg-orange-50 border-orange-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`h-10 w-10 rounded-xl text-white inline-flex items-center justify-center shrink-0 ${
                  alertHasExpired ? "bg-red-500" : "bg-orange-500"
                }`}
              >
                <AlertTriangle className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-bold ${
                    alertHasExpired ? "text-red-900" : "text-orange-900"
                  }`}
                >
                  {alertHasExpired ? "🚨 تنبيهات صحية" : "⚠️ انتباه"}
                </p>
                <p
                  className={`mt-1 text-xs ${
                    alertHasExpired ? "text-red-800" : "text-orange-800"
                  }`}
                >
                  {expired.length > 0 &&
                    `${toArabicDigits(expired.length)} ${
                      expired.length === 1 ? "دواء" : "أدوية"
                    } منتهي الصلاحية`}
                  {expired.length > 0 && nearExpiry.length > 0 && "، و"}
                  {nearExpiry.length > 0 &&
                    `${toArabicDigits(nearExpiry.length)} ${
                      nearExpiry.length === 1 ? "دواء" : "أدوية"
                    } قاربت على الانتهاء`}
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-1.5">
              {[...expired, ...nearExpiry].slice(0, 3).map((m) => {
                const s = computeStatus(m.expiryDate);
                const days = daysFromNow(m.expiryDate);
                return (
                  <Link
                    key={m.id}
                    href={`/cabinet/${m.id}`}
                    className="flex items-center gap-2 rounded-xl bg-white border border-loop-border p-2.5 hover:shadow-card transition-shadow"
                  >
                    <div className="h-8 w-8 rounded-lg bg-loop-surface-soft inline-flex items-center justify-center shrink-0">
                      <Pill className="size-4 text-loop-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-loop-ink truncate">
                        {s === "expired" ? "❌" : "⏰"} {m.name}
                      </p>
                      <p className="text-[11px] text-loop-muted">
                        {s === "expired"
                          ? "منتهي"
                          : `تبقى ${toArabicDigits(days)} يومًا`}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <Button
              asChild
              size="sm"
              variant={alertHasExpired ? "destructive" : "default"}
              width="full"
              className="mt-3"
            >
              <Link href="/cabinet">
                عرض الخزانة
                <ChevronLeft className="size-4" />
              </Link>
            </Button>
          </motion.div>
        </section>
      )}

      <section className="px-4 mt-4 grid grid-cols-3 gap-3">
        <StatCard
          icon={<Package className="size-5" />}
          tone="blue"
          value={hydrated ? toArabicDigits(state.user.totalRecovered) : "—"}
          label="علبة مستردة"
        />
        <StatCard
          icon={<Leaf className="size-5" />}
          tone="green"
          value={hydrated ? `${toArabicDigits(state.user.co2Saved)} كجم` : "—"}
          label="أثر بيئي"
        />
        <StatCard
          icon={<MapPin className="size-5" />}
          tone="blue-soft"
          value={toArabicDigits(5)}
          label="صيدليات قريبة"
        />
      </section>

      <section className="px-4 mt-5 space-y-3">
        <Button asChild variant="gradient" size="lg" width="full">
          <Link href="/add-medicine">
            <Plus className="size-5" />
            أضف دواء للخزانة
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" width="full">
          <Link href="/pharmacies">
            <MapPin className="size-5" />
            اعثر على صيدلية قريبة
          </Link>
        </Button>
      </section>

      <section className="px-4 mt-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-loop-ink">النشاط الأخير</h2>
          <Link
            href="/profile"
            className="text-sm font-semibold text-loop-blue-600 inline-flex items-center gap-1"
          >
            عرض الكل
            <ChevronLeft className="size-4" />
          </Link>
        </div>
        <div className="space-y-2">
          {hydrated &&
            state.history.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-2xl bg-white border border-loop-border p-3.5 shadow-card"
              >
                <div
                  className={`h-10 w-10 rounded-xl inline-flex items-center justify-center shrink-0 ${
                    item.type === "delivery"
                      ? "bg-loop-green-50 text-loop-green-700"
                      : "bg-loop-blue-50 text-loop-blue-700"
                  }`}
                >
                  {item.type === "delivery" ? (
                    <CheckCircle2 className="size-5" />
                  ) : (
                    <Gift className="size-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-loop-ink truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-loop-muted truncate mt-0.5">
                    {item.pharmacy} • {timeAgo(item.at)}
                  </p>
                </div>
                <div
                  className={`text-sm font-bold tabular-nums ${
                    item.points > 0 ? "text-loop-green-700" : "text-loop-muted"
                  }`}
                >
                  {item.points > 0 ? "+" : ""}
                  {toArabicDigits(item.points)}
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className="px-4 mt-5">
        <Link href="/impact">
          <div className="relative overflow-hidden rounded-3xl border border-loop-green-100 bg-loop-surface-tinted p-5">
            <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-loop-green-200/40 blur-2xl" />
            <div className="relative flex items-start gap-3">
              <div className="h-11 w-11 shrink-0 rounded-2xl bg-white inline-flex items-center justify-center shadow-card">
                <Sparkles className="size-5 text-loop-green-700" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-loop-ink">أثرك هذا الشهر 🌱</p>
                <p className="mt-1 text-sm text-loop-body leading-relaxed">
                  حميت{" "}
                  <span className="font-bold text-loop-green-800">
                    {hydrated ? toArabicDigits(state.user.waterProtected) : "—"} لتر
                  </span>{" "}
                  من المياه الجوفية من التلوث
                </p>
                <p className="mt-2 text-sm font-semibold text-loop-green-700 inline-flex items-center gap-1">
                  شاهد أثرك الكامل
                  <ChevronLeft className="size-4" />
                </p>
              </div>
            </div>
          </div>
        </Link>
      </section>

      <div className="h-6" />
      <BottomNav />
    </PageShell>
  );
}

function StatCard({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  tone: "blue" | "green" | "blue-soft";
}) {
  const toneCls =
    tone === "green"
      ? "bg-loop-green-50 text-loop-green-700"
      : tone === "blue-soft"
      ? "bg-loop-blue-50 text-loop-blue-500"
      : "bg-loop-blue-50 text-loop-blue-700";
  return (
    <div className="rounded-2xl bg-white border border-loop-border p-3 shadow-card">
      <div
        className={`h-9 w-9 rounded-xl inline-flex items-center justify-center ${toneCls}`}
      >
        {icon}
      </div>
      <div className="mt-2.5 text-xl font-extrabold text-loop-ink leading-tight">
        {value}
      </div>
      <div className="mt-0.5 text-[11px] text-loop-muted font-medium leading-tight">
        {label}
      </div>
    </div>
  );
}
