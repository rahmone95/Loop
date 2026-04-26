"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Percent,
  Gift,
  Sparkles,
  Star,
  TreePine,
  Trophy,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScreenHeader } from "@/components/screen-header";
import { PageShell } from "@/components/page-shell";
import { BottomNav } from "@/components/bottom-nav";
import { REWARDS, type Reward } from "@/lib/mock-data";
import { useLoopState } from "@/lib/store";
import { toArabicDigits } from "@/lib/arabic";
import { cn } from "@/lib/utils";

export default function RewardsPage() {
  const { state, update, hydrated } = useLoopState();
  const [tab, setTab] = useState<"available" | "history">("available");
  const [confirming, setConfirming] = useState<Reward | null>(null);

  const points = state.user.points;
  const nextTier = REWARDS.filter((r) => r.cost > points).sort(
    (a, b) => a.cost - b.cost
  )[0];
  const toNext = nextTier ? Math.max(0, nextTier.cost - points) : 0;
  const progressTo = nextTier ? (points / nextTier.cost) * 100 : 100;

  function redeem(reward: Reward) {
    if (state.user.points < reward.cost) {
      toast.error("الرصيد غير كافٍ");
      return;
    }
    update((prev) => ({
      ...prev,
      user: { ...prev.user, points: prev.user.points - reward.cost },
      rewards: [
        {
          id: `rd_${Date.now()}`,
          rewardId: reward.id,
          title: reward.title,
          cost: reward.cost,
          at: new Date().toISOString(),
        },
        ...prev.rewards,
      ],
      history: [
        {
          id: `h_${Date.now()}`,
          type: "redeem",
          title: `استبدال ${reward.title}`,
          pharmacy: reward.subtitle,
          points: -reward.cost,
          at: new Date().toISOString(),
        },
        ...prev.history,
      ],
    }));
    setConfirming(null);
    toast.success("تم الاستبدال — تحقق من بريدك");
  }

  return (
    <PageShell withBottomNav>
      <ScreenHeader title="المكافآت والكوبونات" showBack={false} />

      <section className="px-4 pt-3">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-loop-gradient text-white shadow-glow p-5"
        >
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
          <p className="text-white/85 text-sm font-medium">رصيدك</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold">
              {hydrated ? toArabicDigits(points) : "—"}
            </span>
            <span className="text-white/85 font-semibold">نقطة Loop</span>
          </div>
          {nextTier && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-white/85 mb-1.5">
                <span>للكوبون التالي ({nextTier.title})</span>
                <span className="font-bold">{toArabicDigits(toNext)} نقطة</span>
              </div>
              <Progress
                value={progressTo}
                className="bg-white/20"
                indicatorClassName="bg-white"
              />
            </div>
          )}
        </motion.div>
      </section>

      <div className="px-4 mt-4">
        <div className="grid grid-cols-2 rounded-xl bg-loop-surface-soft p-1">
          <button
            onClick={() => setTab("available")}
            className={cn(
              "h-9 rounded-lg text-sm font-semibold transition-all",
              tab === "available"
                ? "bg-white text-loop-blue-700 shadow-card"
                : "text-loop-muted"
            )}
          >
            الكوبونات المتاحة
          </button>
          <button
            onClick={() => setTab("history")}
            className={cn(
              "h-9 rounded-lg text-sm font-semibold transition-all",
              tab === "history"
                ? "bg-white text-loop-blue-700 shadow-card"
                : "text-loop-muted"
            )}
          >
            تاريخ الاستبدال
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-3">
        {tab === "available" &&
          REWARDS.map((r) => (
            <RewardCard
              key={r.id}
              reward={r}
              userPoints={points}
              onClick={() => setConfirming(r)}
            />
          ))}

        {tab === "history" &&
          (state.rewards.length === 0 ? (
            <p className="text-center py-12 text-sm text-loop-muted">
              لا توجد عمليات استبدال بعد
            </p>
          ) : (
            state.rewards.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl bg-white border border-loop-border p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-loop-ink">{r.title}</p>
                  <p className="text-xs text-loop-muted mt-0.5">
                    {new Date(r.at).toLocaleDateString("ar-SA")}
                  </p>
                </div>
                <span className="text-sm font-bold text-loop-muted">
                  -{toArabicDigits(r.cost)}
                </span>
              </div>
            ))
          ))}
      </div>

      {confirming && (
        <div
          className="fixed inset-0 z-50 bg-loop-ink/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={() => setConfirming(null)}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-glow"
          >
            <div className="flex items-start justify-between">
              <div className="h-14 w-14 rounded-2xl bg-loop-blue-gradient inline-flex items-center justify-center">
                <Sparkles className="size-7 text-white" />
              </div>
              <button
                onClick={() => setConfirming(null)}
                className="h-9 w-9 rounded-full hover:bg-loop-surface-soft inline-flex items-center justify-center"
                aria-label="إغلاق"
              >
                <X className="size-5 text-loop-muted" />
              </button>
            </div>
            <h2 className="mt-4 text-xl font-extrabold text-loop-ink">
              تأكيد الاستبدال
            </h2>
            <p className="mt-1 text-sm text-loop-body">
              ستحصل على{" "}
              <span className="font-bold text-loop-ink">{confirming.title}</span> من{" "}
              {confirming.subtitle}.
            </p>
            <div className="mt-4 rounded-2xl bg-loop-surface-soft p-4 flex items-center justify-between">
              <span className="text-sm text-loop-body">سيتم خصم</span>
              <span className="text-xl font-extrabold text-loop-blue-700">
                {toArabicDigits(confirming.cost)} نقطة
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setConfirming(null)}
              >
                إلغاء
              </Button>
              <Button
                variant="gradient"
                size="lg"
                onClick={() => redeem(confirming)}
              >
                تأكيد
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <BottomNav />
    </PageShell>
  );
}

function RewardIconForType(type: Reward["icon"]) {
  switch (type) {
    case "percent":
      return Percent;
    case "gift":
      return Gift;
    case "tree":
      return TreePine;
    case "star":
      return Star;
  }
}

function RewardCard({
  reward,
  userPoints,
  onClick,
}: {
  reward: Reward;
  userPoints: number;
  onClick: () => void;
}) {
  const affordable = userPoints >= reward.cost;
  const Icon = RewardIconForType(reward.icon);
  const missing = reward.cost - userPoints;

  return (
    <div className="rounded-2xl bg-white border border-loop-border shadow-card overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        <div
          className={cn(
            "h-14 w-14 rounded-2xl inline-flex items-center justify-center shrink-0",
            affordable
              ? "bg-loop-blue-gradient text-white"
              : "bg-loop-surface-soft text-loop-muted"
          )}
        >
          <Icon className="size-7" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-bold text-loop-ink leading-tight">
            {reward.title}
          </h3>
          <p className="text-xs text-loop-muted mt-0.5 truncate">{reward.subtitle}</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Trophy className="size-3.5 text-loop-blue-600" />
            <span className="text-xs font-bold text-loop-blue-700">
              {toArabicDigits(reward.cost)} نقطة
            </span>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        {affordable ? (
          <Button variant="default" size="sm" width="full" onClick={onClick}>
            استبدال
          </Button>
        ) : (
          <Button variant="outline" size="sm" width="full" disabled>
            -{toArabicDigits(missing)} نقطة فقط
          </Button>
        )}
      </div>
    </div>
  );
}
