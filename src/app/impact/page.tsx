"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  Droplet,
  Cloud,
  Trophy,
  Share2,
  Sparkles,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import { ScreenHeader } from "@/components/screen-header";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { useLoopState } from "@/lib/store";
import { toArabicDigits } from "@/lib/arabic";

const TIMELINE_DATA = [
  { week: "أ١", recovered: 1 },
  { week: "أ٢", recovered: 3 },
  { week: "أ٣", recovered: 5 },
  { week: "أ٤", recovered: 8 },
];

export default function ImpactPage() {
  const { state, hydrated } = useLoopState();
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    fetch("/api/impact-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        medicinesRecovered: state.user.totalRecovered,
        co2Saved: state.user.co2Saved,
        rank: state.user.rank,
      }),
    })
      .then((r) => r.json())
      .then((d) => setAiMessage(d.message))
      .catch(() => {});
  }, [hydrated, state.user.totalRecovered, state.user.co2Saved, state.user.rank]);

  const recoveredKg = ((state.user.totalRecovered * 0.15)).toFixed(1);

  return (
    <PageShell>
      <ScreenHeader title="أثرك البيئي" />

      <div className="px-4 pt-3 space-y-4 pb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-3xl bg-loop-green-gradient text-white p-6 shadow-glow-green"
        >
          <div className="absolute -top-12 -left-8 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-12 -right-8 h-44 w-44 rounded-full bg-white/10 blur-2xl" />

          <div className="relative text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-3">
              <Leaf className="size-8 text-white" />
            </div>
            <p className="text-white/85 text-sm font-medium">
              أدوية أنقذت من القمامة
            </p>
            <div className="mt-2 flex items-baseline justify-center gap-2">
              <CountUp
                from={0}
                to={parseFloat(recoveredKg)}
                duration={1500}
                suffix=" كجم"
                className="text-5xl font-extrabold tracking-tight"
              />
            </div>
            <p className="mt-3 text-white/85 text-xs">
              من خلال {toArabicDigits(state.user.totalRecovered)} علبة سلّمتها
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-3">
          <ImpactStat
            icon={<Droplet className="size-5" />}
            value={`${toArabicDigits(state.user.waterProtected)} لتر`}
            label="مياه جوفية محمية"
            tone="blue"
          />
          <ImpactStat
            icon={<Cloud className="size-5" />}
            value={`${toArabicDigits(state.user.co2Saved)} كجم`}
            label="انبعاثات CO₂ متجنبة"
            tone="green"
          />
          <ImpactStat
            icon={<Trophy className="size-5" />}
            value={`#${toArabicDigits(state.user.rank)}`}
            label="ترتيبك في المملكة"
            tone="orange"
          />
        </div>

        <div className="rounded-2xl bg-loop-blue-50 border border-loop-blue-100 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-loop-blue-gradient inline-flex items-center justify-center shrink-0">
            <Sparkles className="size-5 text-white" />
          </div>
          <p className="text-sm font-bold text-loop-blue-800 leading-snug">
            أنت ضمن أفضل ٥٪ من مستخدمي Loop في الرياض 🏆
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-loop-border shadow-card p-5">
          <h3 className="font-bold text-loop-ink">رحلتك مع Loop</h3>
          <p className="mt-1 text-xs text-loop-muted">آخر ٤ أسابيع</p>
          <div className="mt-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TIMELINE_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3FAE4F" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3FAE4F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                  reversed
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #E5EAF1",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  cursor={{ stroke: "#3FAE4F", strokeOpacity: 0.2 }}
                />
                <Area
                  type="monotone"
                  dataKey="recovered"
                  stroke="#3FAE4F"
                  strokeWidth={3}
                  fill="url(#areaG)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {aiMessage && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-loop-surface-tinted border border-loop-green-100 p-4 flex items-start gap-3"
          >
            <Sparkles className="size-5 text-loop-green-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-loop-green-800 mb-1">
                رسالة من Loop AI
              </p>
              <p className="text-sm text-loop-body leading-relaxed">{aiMessage}</p>
            </div>
          </motion.div>
        )}

        <div className="rounded-2xl bg-white border border-loop-border p-5">
          <h3 className="font-bold text-loop-ink mb-3">بدعم من شركائنا</h3>
          <div className="grid grid-cols-3 gap-3">
            {["sponsor1", "sponsor2", "sponsor3"].map((s, i) => (
              <div
                key={s}
                className="h-16 rounded-xl bg-loop-surface-soft border border-loop-border flex items-center justify-center text-loop-muted text-xs font-bold"
              >
                {["سبيمكو", "نوفارتيس", "تبوك"][i]}
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-loop-muted leading-relaxed">
            Loop يمكّن الشركات من تحقيق أهداف الاستدامة (ESG) من خلال بيانات حقيقية
            وأثر بيئي قابل للقياس.
          </p>
        </div>

        <Button
          variant="gradient"
          size="lg"
          width="full"
          onClick={() => {
            const text = `حميت ${toArabicDigits(state.user.waterProtected)} لتر مياه جوفية وتجنبت ${toArabicDigits(state.user.co2Saved)} كجم CO₂ مع Loop! 🌱 #Loop_KSA`;
            if (navigator.share) {
              navigator.share({ text }).catch(() => {});
            } else {
              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
            }
          }}
        >
          <Share2 className="size-5" />
          شارك أثرك مع أصدقائك
        </Button>
      </div>
    </PageShell>
  );
}

function ImpactStat({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  tone: "blue" | "green" | "orange";
}) {
  const styles =
    tone === "blue"
      ? "bg-loop-blue-50 text-loop-blue-700"
      : tone === "green"
      ? "bg-loop-green-50 text-loop-green-700"
      : "bg-orange-50 text-orange-700";
  return (
    <div className="rounded-2xl bg-white border border-loop-border shadow-card p-3">
      <div className={`h-9 w-9 rounded-xl inline-flex items-center justify-center ${styles}`}>
        {icon}
      </div>
      <div className="mt-2.5 text-lg font-extrabold text-loop-ink leading-tight">
        {value}
      </div>
      <div className="mt-0.5 text-[11px] text-loop-muted font-medium leading-tight">
        {label}
      </div>
    </div>
  );
}

function CountUp({
  from,
  to,
  duration,
  suffix = "",
  className,
}: {
  from: number;
  to: number;
  duration: number;
  suffix?: string;
  className?: string;
}) {
  const [v, setV] = useState(from);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(+(from + (to - from) * eased).toFixed(1));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [from, to, duration]);
  return (
    <span className={className}>
      {toArabicDigits(v.toFixed(1))}
      {suffix}
    </span>
  );
}
