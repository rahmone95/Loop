"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, AlertTriangle, Clock, Package, FileX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScreenHeader } from "@/components/screen-header";
import { PageShell } from "@/components/page-shell";
import { BottomNav } from "@/components/bottom-nav";
import { useLoopState, type MedicineStatus, type Medicine } from "@/lib/store";
import { toArabicDigits, formatArabicDate } from "@/lib/arabic";
import { cn } from "@/lib/utils";

type Filter = "all" | MedicineStatus;

const STATUS_META: Record<
  MedicineStatus,
  {
    label: string;
    badgeVariant: "solidRed" | "solidOrange" | "solidBlue";
    icon: React.ReactNode;
    accent: string;
  }
> = {
  expired:    { label: "منتهي الصلاحية",   badgeVariant: "solidRed",    icon: <AlertTriangle className="size-4" />, accent: "border-r-4 border-r-red-500" },
  nearExpiry: { label: "قارب على الانتهاء", badgeVariant: "solidOrange", icon: <Clock className="size-4" />,         accent: "border-r-4 border-r-orange-500" },
  unused:     { label: "غير مستخدم",       badgeVariant: "solidBlue",   icon: <Package className="size-4" />,       accent: "border-r-4 border-r-loop-blue-500" },
};

export default function MyMedicinesPage() {
  const { state, hydrated } = useLoopState();
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const list = state.medicines.filter((m) => !m.delivered);
    return {
      all:        list.length,
      expired:    list.filter((m) => m.status === "expired").length,
      nearExpiry: list.filter((m) => m.status === "nearExpiry").length,
      unused:     list.filter((m) => m.status === "unused").length,
    };
  }, [state.medicines]);

  const filtered = useMemo(() => {
    const list = state.medicines.filter((m) => !m.delivered);
    if (filter === "all") return list;
    return list.filter((m) => m.status === filter);
  }, [state.medicines, filter]);

  const isEmpty = hydrated && counts.all === 0;

  return (
    <PageShell withBottomNav>
      <ScreenHeader
        title="أدويتي"
        rightSlot={
          counts.all > 0 ? (
            <Badge variant="default" className="text-[11px]">
              {toArabicDigits(counts.all)}
            </Badge>
          ) : null
        }
      />

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="h-24 w-24 rounded-full bg-loop-surface-soft inline-flex items-center justify-center mb-6">
            <FileX className="size-10 text-loop-muted" strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-bold text-loop-ink">
            لا توجد أدوية محفوظة بعد
          </h2>
          <p className="mt-2 text-sm text-loop-body max-w-xs">
            ابدأ بإضافة أول دواء وكسب نقاطك الأولى مع Loop
          </p>
          <Button asChild variant="gradient" size="lg" className="mt-6">
            <Link href="/add-medicine">
              <Plus className="size-5" />
              أضف دواء
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="px-4 pt-3 sticky top-14 bg-loop-surface/90 backdrop-blur-md z-20 pb-3 -mt-px">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
                الكل ({toArabicDigits(counts.all)})
              </FilterChip>
              <FilterChip
                active={filter === "expired"}
                onClick={() => setFilter("expired")}
              >
                منتهية ({toArabicDigits(counts.expired)})
              </FilterChip>
              <FilterChip
                active={filter === "nearExpiry"}
                onClick={() => setFilter("nearExpiry")}
              >
                قاربت ({toArabicDigits(counts.nearExpiry)})
              </FilterChip>
              <FilterChip
                active={filter === "unused"}
                onClick={() => setFilter("unused")}
              >
                غير مستخدمة ({toArabicDigits(counts.unused)})
              </FilterChip>
            </div>
          </div>

          <div className="px-4 pt-2 pb-6 space-y-3">
            {filtered.map((m) => (
              <MedicineCard key={m.id} med={m} />
            ))}

            <Button asChild variant="outline" size="lg" width="full" className="mt-4">
              <Link href="/add-medicine">
                <Plus className="size-5" />
                إضافة دواء آخر
              </Link>
            </Button>
          </div>
        </>
      )}
      <BottomNav />
    </PageShell>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 inline-flex items-center rounded-full px-4 h-9 text-sm font-semibold transition-all",
        active
          ? "bg-loop-blue-600 text-white shadow-soft"
          : "bg-white border border-loop-border text-loop-body hover:bg-loop-surface-soft"
      )}
    >
      {children}
    </button>
  );
}

function MedicineCard({ med }: { med: Medicine }) {
  const meta = STATUS_META[med.status];
  return (
    <Link
      href={`/pharmacies?selectedMedicine=${med.id}`}
      className={cn(
        "block rounded-2xl bg-white border border-loop-border shadow-card p-4 transition-all hover:shadow-soft hover:border-loop-blue-200",
        meta.accent
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-bold text-loop-ink leading-snug">
            {med.name}
          </h3>
          <p className="mt-1.5 text-xs text-loop-muted">
            تاريخ الانتهاء: {formatArabicDate(med.expiryDate)}
          </p>
          {med.notes && (
            <p className="mt-1 text-xs text-loop-body/70 truncate">{med.notes}</p>
          )}
        </div>
        <Badge variant={meta.badgeVariant} className="shrink-0">
          {meta.icon}
          {meta.label}
        </Badge>
      </div>
      <div className="mt-3 pt-3 border-t border-loop-border flex items-center justify-between">
        <span className="text-xs text-loop-muted">جاهز للتسليم</span>
        <span className="text-sm font-semibold text-loop-blue-600">سلّم الآن ←</span>
      </div>
    </Link>
  );
}
