"use client";

import Link from "next/link";
import { BellOff } from "lucide-react";
import { ScreenHeader } from "@/components/screen-header";
import { PageShell } from "@/components/page-shell";
import { useLoopState, type AppNotification } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { state, update, hydrated } = useLoopState();
  const notifs = state.notifications || [];
  const unreadCount = notifs.filter((n) => !n.read).length;

  function markAllRead() {
    update((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }

  function markRead(id: string) {
    update((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  }

  return (
    <PageShell>
      <ScreenHeader
        title="التنبيهات"
        rightSlot={
          unreadCount > 0 ? (
            <button
              onClick={markAllRead}
              className="text-[11px] font-semibold text-loop-blue-600 whitespace-nowrap"
            >
              تعليم الكل كمقروء
            </button>
          ) : null
        }
      />

      <div className="px-4 pt-3 pb-10">
        {!hydrated ? (
          <div className="text-center py-12 text-loop-muted">...</div>
        ) : notifs.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-2">
            {notifs.map((n) => (
              <NotifCard key={n.id} n={n} onRead={() => markRead(n.id)} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}

function NotifCard({
  n,
  onRead,
}: {
  n: AppNotification;
  onRead: () => void;
}) {
  const tone =
    n.type === "expired"
      ? "border-r-4 border-r-red-500 bg-red-50/40"
      : n.type === "nearExpiry"
      ? "border-r-4 border-r-orange-500 bg-orange-50/40"
      : n.type === "reward"
      ? "border-r-4 border-r-loop-green-500 bg-loop-green-50/40"
      : "border-r-4 border-r-loop-blue-300 bg-white";

  const href =
    n.type === "expired" || n.type === "nearExpiry"
      ? n.medicineId
        ? `/cabinet/${n.medicineId}`
        : "/cabinet"
      : n.type === "reward"
      ? "/rewards"
      : "/cabinet";

  return (
    <Link
      href={href}
      onClick={onRead}
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-loop-border shadow-card p-4 transition-all",
        tone,
        !n.read && "ring-1 ring-loop-blue-500/15"
      )}
    >
      <div className="h-11 w-11 shrink-0 rounded-xl bg-white inline-flex items-center justify-center text-2xl shadow-card">
        {n.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold text-loop-ink">{n.title}</p>
          {!n.read && (
            <span className="h-2 w-2 rounded-full bg-loop-blue-600 shrink-0 mt-1.5" />
          )}
        </div>
        <p className="mt-1 text-xs text-loop-body leading-relaxed">{n.message}</p>
        <p className="mt-1.5 text-[11px] text-loop-muted">{n.time}</p>
      </div>
    </Link>
  );
}

function Empty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-20 w-20 rounded-full bg-loop-surface-soft inline-flex items-center justify-center mb-4">
        <BellOff className="size-10 text-loop-muted" strokeWidth={1.5} />
      </div>
      <h2 className="text-base font-bold text-loop-ink">لا توجد تنبيهات حاليًا</h2>
      <p className="mt-1 text-sm text-loop-muted">سنخبرك عند وصول جديد</p>
    </div>
  );
}
