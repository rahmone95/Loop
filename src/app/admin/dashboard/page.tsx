"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  FileText,
  Settings as SettingsIcon,
  TrendingUp,
  Package as PackageIcon,
  Droplet,
  Store,
  Download,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Users,
  Sparkles,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoopLogo } from "@/components/loop-logo";
import { toArabicDigits } from "@/lib/arabic";
import { cn } from "@/lib/utils";

const NAV = [
  { icon: LayoutDashboard, label: "لوحة التحكم", active: true },
  { icon: Building2,       label: "الصيدليات الشريكة" },
  { icon: BarChart3,       label: "التقارير" },
  { icon: FileText,        label: "تقارير ESG" },
  { icon: SettingsIcon,    label: "الإعدادات" },
];

const MONTHLY = [
  { m: "نوفمبر", v: 120 },
  { m: "ديسمبر", v: 380 },
  { m: "يناير",  v: 720 },
  { m: "فبراير", v: 1450 },
  { m: "مارس",   v: 2890 },
  { m: "أبريل",  v: 8420 },
];

const PIE = [
  { name: "مسكنات",        value: 35, fill: "#1E5BB8" },
  { name: "مضادات حيوية",   value: 25, fill: "#3FAE4F" },
  { name: "أمراض مزمنة",   value: 22, fill: "#5BC75A" },
  { name: "مكملات",         value: 10, fill: "#2E6BCF" },
  { name: "أخرى",            value: 8,  fill: "#94A3B8" },
];

const DISTRICTS = [
  { name: "العليا",   v: 1240 },
  { name: "الملقا",   v: 980 },
  { name: "النخيل",   v: 820 },
  { name: "الورود",   v: 650 },
  { name: "الياسمين", v: 530 },
];

const PHARMACY_PERF = [
  { name: "النهدي - العليا",   v: 1240 },
  { name: "المتحدة - الياسمين", v: 980 },
  { name: "الدواء - الملقا",   v: 820 },
  { name: "النهدي - الورود",   v: 650 },
  { name: "الحياة - النخيل",   v: 530 },
];

function AdminDashboardContent() {
  const params = useSearchParams();
  const role = params.get("role") === "sponsor" ? "sponsor" : "sfda";
  const isSponsor = role === "sponsor";

  return (
    <div className="min-h-[100dvh] bg-loop-surface-soft flex" dir="rtl">
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-white border-l border-loop-border">
        <div className="p-5 border-b border-loop-border">
          <LoopLogo size={32} />
        </div>
        <div className="p-4">
          <div className="rounded-2xl bg-loop-blue-50 p-3 flex items-start gap-2">
            <ShieldCheck className="size-5 text-loop-blue-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-loop-blue-800">
                {isSponsor ? "شركة سبيمكو" : "هيئة الغذاء والدواء"}
              </p>
              <p className="text-[11px] text-loop-blue-700 mt-0.5">
                {isSponsor ? "حساب راعي" : "صلاحيات تنظيمية"}
              </p>
            </div>
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

      <div className="md:hidden fixed top-0 inset-x-0 z-30 bg-white border-b border-loop-border h-14 px-4 flex items-center justify-between">
        <LoopLogo size={28} />
        <Link href="/profile" className="text-xs text-loop-muted">تبديل العرض ←</Link>
      </div>

      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <header className="px-4 md:px-8 py-6 border-b border-loop-border bg-white flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-loop-muted">
              {isSponsor ? "لوحة الراعي" : "اللوحة التنظيمية"}
            </p>
            <h1 className="text-xl md:text-2xl font-extrabold text-loop-ink mt-0.5">
              مؤشرات منظومة Loop
            </h1>
          </div>
          <Badge variant="green" className="shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-loop-green-500 animate-pulse" />
            بيانات حية
          </Badge>
        </header>

        <div className="p-4 md:p-8 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <KPICard tone="blue"   value={toArabicDigits("8,420")} label="إجمالي العلب المستردة" delta="+12% هذا الشهر" icon={<PackageIcon className="size-5" />} />
            <KPICard tone="green"  value={`${toArabicDigits(421)} كجم`} label="وزن الأدوية المتلفة بأمان" icon={<Leaf className="size-5" />} />
            <KPICard tone="cyan"   value={`${toArabicDigits("1,265")} لتر`} label="مياه جوفية محمية" icon={<Droplet className="size-5" />} />
            <KPICard tone="purple" value={`${toArabicDigits(50)} صيدلية`} label="في الشبكة الآن" icon={<Store className="size-5" />} />
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <ChartCard title="الاستردادات الشهرية" subtitle="آخر ٦ أشهر">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={MONTHLY} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E5BB8" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#1E5BB8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} reversed />
                  <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip contentStyle={{ background: "white", border: "1px solid #E5EAF1", borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="v" stroke="#1E5BB8" strokeWidth={3} fill="url(#adminArea)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="التوزيع حسب نوع الدواء">
              <div className="grid grid-cols-2 gap-3 items-center">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={PIE}
                      dataKey="value"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={2}
                      stroke="white"
                      strokeWidth={3}
                    >
                      {PIE.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "white", border: "1px solid #E5EAF1", borderRadius: 12, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5">
                  {PIE.map((p) => (
                    <div key={p.name} className="flex items-center gap-2 text-xs">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: p.fill }} />
                      <span className="text-loop-body flex-1 truncate">{p.name}</span>
                      <span className="font-bold text-loop-ink tabular-nums">
                        {toArabicDigits(p.value)}٪
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>

            <ChartCard title="خريطة الاسترداد - الرياض" subtitle="أعلى ٥ أحياء">
              <div className="space-y-2.5">
                {DISTRICTS.map((d, i) => {
                  const max = DISTRICTS[0].v;
                  const pct = (d.v / max) * 100;
                  return (
                    <div key={d.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-loop-ink">
                          {toArabicDigits(i + 1)}. {d.name}
                        </span>
                        <span className="font-bold tabular-nums text-loop-blue-700">
                          {toArabicDigits(d.v)}
                        </span>
                      </div>
                      <div className="h-7 rounded-lg bg-loop-surface-soft overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-loop-blue-600 to-loop-green-600 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ChartCard>

            <ChartCard title="أداء الصيدليات الشريكة" subtitle="آخر ٣٠ يوم">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  layout="vertical"
                  data={[...PHARMACY_PERF].reverse()}
                  margin={{ top: 0, right: 16, left: 80, bottom: 0 }}
                >
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#0F172A" }}
                    axisLine={false}
                    tickLine={false}
                    width={140}
                    orientation="right"
                  />
                  <Tooltip contentStyle={{ background: "white", border: "1px solid #E5EAF1", borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="v" radius={[6, 0, 0, 6]} fill="#3FAE4F" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* ESG */}
          <div className="rounded-3xl bg-gradient-to-br from-loop-blue-700 to-loop-green-700 text-white p-6 md:p-8 shadow-glow">
            <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
              <div>
                <p className="text-white/80 text-sm">تقرير الاستدامة</p>
                <h2 className="text-2xl font-extrabold mt-0.5">ESG Report</h2>
              </div>
              <Badge variant="default" className="bg-white/15 text-white">
                <Sparkles className="size-3" />
                Q1 2026
              </Badge>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <ESGCol
                tag="Environmental"
                value={`${toArabicDigits(421)} كجم`}
                label="نفايات صحية تم التعامل معها بأمان"
              />
              <ESGCol
                tag="Social"
                value={toArabicDigits("2,800")}
                label="أسرة استفادت من الخدمة"
              />
              <ESGCol
                tag="Governance"
                value={`${toArabicDigits(100)}٪`}
                label="امتثال للوائح هيئة الغذاء والدواء"
              />
            </div>
            <div className="mt-6">
              <Button variant="default" size="default" className="bg-white text-loop-blue-700 hover:bg-white/90">
                <Download className="size-5" />
                تحميل التقرير الكامل (PDF)
              </Button>
            </div>
          </div>

          {isSponsor && (
            <div className="rounded-3xl bg-white border border-loop-border shadow-card p-6">
              <h2 className="text-xl font-extrabold text-loop-ink">
                شعارك على {toArabicDigits(12)} صندوق Loop
              </h2>
              <p className="mt-1 text-sm text-loop-muted">
                توزيع شعاركم في الصيدليات الشريكة
              </p>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-2xl bg-loop-surface-soft border border-loop-border flex flex-col items-center justify-center text-xs text-loop-muted gap-1">
                    <Store className="size-5 text-loop-blue-600" />
                    <span className="font-bold">صندوق #{toArabicDigits(i + 1)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <SponsorStat icon={<Users className="size-5" />} value={toArabicDigits("15,000+")} label="انطباعات شهرية" />
                <SponsorStat icon={<TrendingUp className="size-5" />} value={`+${toArabicDigits(28)}٪`} label="نمو الوصول" />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-loop-muted">...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}

function KPICard({
  tone,
  value,
  label,
  delta,
  icon,
}: {
  tone: "blue" | "green" | "cyan" | "purple";
  value: string;
  label: string;
  delta?: string;
  icon: React.ReactNode;
}) {
  const map = {
    blue:   "from-loop-blue-50    text-loop-blue-700",
    green:  "from-loop-green-50   text-loop-green-700",
    cyan:   "from-cyan-50         text-cyan-700",
    purple: "from-purple-50       text-purple-700",
  };
  return (
    <div className="rounded-2xl bg-white border border-loop-border shadow-card p-4 md:p-5">
      <div className={`h-11 w-11 rounded-xl bg-gradient-to-br to-white ${map[tone]} inline-flex items-center justify-center`}>
        {icon}
      </div>
      <div className="mt-3 text-2xl md:text-3xl font-extrabold text-loop-ink">{value}</div>
      <div className="mt-1 text-xs text-loop-muted leading-tight">{label}</div>
      {delta && (
        <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-loop-green-700 bg-loop-green-50 rounded-full px-2 py-0.5">
          <TrendingUp className="size-3" />
          {delta}
        </div>
      )}
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white border border-loop-border shadow-card p-5">
      <div className="mb-4">
        <h3 className="font-bold text-loop-ink">{title}</h3>
        {subtitle && <p className="text-xs text-loop-muted mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function ESGCol({
  tag,
  value,
  label,
}: {
  tag: string;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-5 border border-white/20">
      <div className="text-[11px] font-bold uppercase tracking-wider text-white/85">
        {tag}
      </div>
      <div className="mt-2 text-3xl font-extrabold">{value}</div>
      <div className="mt-1 text-xs text-white/85 leading-relaxed">{label}</div>
    </div>
  );
}

function SponsorStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-loop-surface-soft p-4">
      <div className="h-9 w-9 rounded-xl bg-white text-loop-blue-700 inline-flex items-center justify-center shadow-card">
        {icon}
      </div>
      <div className="mt-2.5 text-xl font-extrabold text-loop-ink">{value}</div>
      <div className="text-xs text-loop-muted">{label}</div>
    </div>
  );
}
