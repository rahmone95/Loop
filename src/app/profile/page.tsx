"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  Globe,
  Lock,
  MessageCircle,
  Info,
  LogOut,
  ChevronLeft,
  Users,
  Building2,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { ScreenHeader } from "@/components/screen-header";
import { PageShell } from "@/components/page-shell";
import { BottomNav } from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { useLoopState, resetStore } from "@/lib/store";
import { toArabicDigits } from "@/lib/arabic";

export default function ProfilePage() {
  const router = useRouter();
  const { state, hydrated } = useLoopState();
  const [showRoleSwitch, setShowRoleSwitch] = useState(false);

  const initials = state.user.name.slice(0, 1);

  return (
    <PageShell withBottomNav>
      <ScreenHeader title="حسابي" showBack={false} />

      <section className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white border border-loop-border shadow-card p-6 text-center"
        >
          <div className="mx-auto h-20 w-20 rounded-full bg-loop-blue-gradient text-white text-3xl font-extrabold inline-flex items-center justify-center shadow-soft">
            {initials}
          </div>
          <h1 className="mt-4 text-lg font-bold text-loop-ink">
            {state.user.name}
          </h1>
          <p className="text-sm text-loop-muted mt-0.5" dir="ltr">
            {state.user.phone}
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-loop-green-50 text-loop-green-700 px-3 py-1 text-xs font-bold">
            عضو منذ أبريل ٢٠٢٦
          </div>
        </motion.div>
      </section>

      <section className="px-4 mt-4 grid grid-cols-2 gap-3">
        <ProfileStat
          value={hydrated ? toArabicDigits(540) : "—"}
          label="إجمالي النقاط المكتسبة"
        />
        <ProfileStat
          value={hydrated ? toArabicDigits(state.user.totalRecovered) : "—"}
          label="أدوية مستردة"
        />
        <ProfileStat
          value={hydrated ? toArabicDigits(3) : "—"}
          label="كوبونات استبدلت"
        />
        <ProfileStat
          value={hydrated ? `#${toArabicDigits(state.user.rank)}` : "—"}
          label="الترتيب الوطني"
        />
      </section>

      <section className="px-4 mt-4">
        <div className="rounded-2xl bg-white border border-loop-border shadow-card divide-y divide-loop-border">
          <SettingRow icon={<Bell className="size-5" />} label="الإشعارات" />
          <SettingRow icon={<Globe className="size-5" />} label="اللغة" trailing="العربية" />
          <SettingRow icon={<Lock className="size-5" />} label="الخصوصية والأمان" />
          <SettingRow icon={<MessageCircle className="size-5" />} label="الدعم الفني" />
          <SettingRow icon={<Info className="size-5" />} label="عن Loop" />
          <SettingRow
            icon={<LogOut className="size-5 text-red-600" />}
            label="تسجيل الخروج"
            labelClass="text-red-600"
            onClick={() => {
              resetStore();
              router.push("/login");
            }}
          />
        </div>
      </section>

      <section className="px-4 mt-5 space-y-3">
        <Button
          variant="outline"
          size="lg"
          width="full"
          onClick={() => setShowRoleSwitch(true)}
          className="border-dashed"
        >
          <Users className="size-5" />
          تبديل العرض (للجنة)
        </Button>
        <Button
          variant="secondary"
          size="lg"
          width="full"
          onClick={() => {
            toast("🚨 بنادول إكسترا منتهي اليوم — لا تستخدمه. سلّمه عبر Loop", {
              duration: 6000,
              action: {
                label: "افتح الخزانة",
                onClick: () => router.push("/cabinet"),
              },
            });
          }}
        >
          <Zap className="size-5" />
          محاكاة تنبيه (للعرض)
        </Button>
      </section>

      <div className="h-6" />
      <BottomNav />

      {showRoleSwitch && (
        <div
          className="fixed inset-0 z-50 bg-loop-ink/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowRoleSwitch(false)}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-5 shadow-glow"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-extrabold text-loop-ink">تبديل العرض</h2>
              <button
                onClick={() => setShowRoleSwitch(false)}
                className="h-9 w-9 rounded-full hover:bg-loop-surface-soft inline-flex items-center justify-center"
                aria-label="إغلاق"
              >
                <X className="size-5 text-loop-muted" />
              </button>
            </div>
            <p className="text-sm text-loop-muted mb-4">
              عرض تجريبي لمختلف أطراف منظومة Loop
            </p>
            <div className="space-y-2">
              <RoleOption
                href="/home"
                icon={<Users className="size-5" />}
                title="عرض المستخدم"
                subtitle="تطبيق الأسرة (الحالي)"
                active
              />
              <RoleOption
                href="/pharmacy"
                icon={<Building2 className="size-5" />}
                title="عرض الصيدلية"
                subtitle="بوابة الصيدلية الشريكة"
              />
              <RoleOption
                href="/admin"
                icon={<ShieldCheck className="size-5" />}
                title="عرض Loop / الجهات التنظيمية"
                subtitle="لوحة هيئة الغذاء والدواء والشركاء"
              />
            </div>
          </motion.div>
        </div>
      )}
    </PageShell>
  );
}

function ProfileStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white border border-loop-border shadow-card p-4 text-center">
      <div className="text-2xl font-extrabold text-loop-ink">{value}</div>
      <div className="mt-1 text-xs text-loop-muted leading-tight">{label}</div>
    </div>
  );
}

function SettingRow({
  icon,
  label,
  trailing,
  onClick,
  labelClass,
}: {
  icon: React.ReactNode;
  label: string;
  trailing?: string;
  onClick?: () => void;
  labelClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-loop-surface-soft transition-colors text-right"
    >
      <span className="text-loop-body">{icon}</span>
      <span className={`flex-1 text-sm font-semibold text-loop-ink ${labelClass || ""}`}>
        {label}
      </span>
      {trailing && <span className="text-sm text-loop-muted">{trailing}</span>}
      <ChevronLeft className="size-4 text-loop-muted" />
    </button>
  );
}

function RoleOption({
  href,
  icon,
  title,
  subtitle,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-2xl border p-4 transition-all ${
        active
          ? "border-loop-blue-500 bg-loop-blue-50"
          : "border-loop-border bg-white hover:bg-loop-surface-soft"
      }`}
    >
      <div className="h-11 w-11 rounded-xl bg-loop-blue-gradient text-white inline-flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-loop-ink">{title}</p>
        <p className="text-xs text-loop-muted truncate">{subtitle}</p>
      </div>
      {active ? (
        <span className="text-xs font-bold text-loop-blue-700">حالياً</span>
      ) : (
        <ChevronLeft className="size-4 text-loop-muted" />
      )}
    </Link>
  );
}
