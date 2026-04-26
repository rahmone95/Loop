"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, Star, Navigation, Filter as FilterIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScreenHeader } from "@/components/screen-header";
import { PageShell } from "@/components/page-shell";
import { BottomNav } from "@/components/bottom-nav";
import { PHARMACIES, type Pharmacy } from "@/lib/mock-data";
import { toArabicDigits } from "@/lib/arabic";
import { cn } from "@/lib/utils";

const PIN_POSITIONS = [
  { top: "30%", left: "28%" },
  { top: "55%", left: "70%" },
  { top: "20%", left: "65%" },
  { top: "70%", left: "32%" },
  { top: "42%", left: "50%" },
];

function PharmaciesContent() {
  const params = useSearchParams();
  const selectedMedicineId = params.get("selectedMedicine");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return PHARMACIES;
    return PHARMACIES.filter(
      (p) =>
        p.name.includes(q) ||
        p.branch.includes(q) ||
        p.address.includes(q)
    );
  }, [query]);

  return (
    <PageShell withBottomNav>
      <ScreenHeader title="الصيدليات الشريكة" />

      <div className="px-4 pt-3 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-loop-muted pointer-events-none" />
            <Input
              placeholder="ابحث عن صيدلية أو حي..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Button variant="outline" size="icon" aria-label="تصفية">
            <FilterIcon className="size-5" />
          </Button>
        </div>

        {selectedMedicineId && (
          <div className="rounded-2xl border border-loop-blue-200 bg-loop-blue-50 px-4 py-3 text-sm text-loop-blue-800">
            <span className="font-semibold">دواء محدد للتسليم</span> — اختر صيدلية للمتابعة
          </div>
        )}

        <div className="relative h-64 rounded-3xl overflow-hidden border border-loop-border bg-white">
          <div className="absolute inset-0 grid-bg bg-loop-surface-soft" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-loop-blue-50/40" />

          {/* mock road lines */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 256">
            <path d="M0 80 Q120 60 220 90 T400 80" stroke="#CBD5E1" strokeWidth="2.5" fill="none" />
            <path d="M50 0 Q60 100 90 160 T120 256" stroke="#CBD5E1" strokeWidth="2.5" fill="none" />
            <path d="M280 0 Q260 120 240 180 T220 256" stroke="#CBD5E1" strokeWidth="2.5" fill="none" />
            <path d="M0 200 Q100 180 200 200 T400 190" stroke="#CBD5E1" strokeWidth="2.5" fill="none" />
          </svg>

          {/* user location (center) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-loop-blue-500/20 animate-ping" />
              <div className="relative h-4 w-4 rounded-full bg-loop-blue-600 ring-4 ring-white shadow-soft" />
            </div>
            <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-loop-blue-700 bg-white rounded-full px-2 py-0.5 shadow-card">
              موقعك
            </div>
          </div>

          {/* pharmacy pins */}
          {PHARMACIES.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              style={PIN_POSITIONS[i]}
            >
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-loop-green-600 ring-3 ring-white shadow-card flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-white" />
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-[6px] border-t-loop-green-600" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <h2 className="text-sm font-bold text-loop-ink">
            {toArabicDigits(filtered.length)} صيدليات قريبة
          </h2>
          <span className="text-xs text-loop-muted">مرتبة حسب المسافة</span>
        </div>
      </div>

      <div className="px-4 pt-3 pb-6 space-y-3">
        {filtered.map((p) => (
          <PharmacyCard
            key={p.id}
            pharmacy={p}
            href={`/dropoff/${p.id}${
              selectedMedicineId ? `?selectedMedicine=${selectedMedicineId}` : ""
            }`}
          />
        ))}
      </div>
      <BottomNav />
    </PageShell>
  );
}

export default function PharmaciesPage() {
  return (
    <Suspense fallback={<PageShell><div className="p-8 text-center text-loop-muted">...</div></PageShell>}>
      <PharmaciesContent />
    </Suspense>
  );
}

function PharmacyCard({ pharmacy: p, href }: { pharmacy: Pharmacy; href: string }) {
  return (
    <div className="rounded-2xl bg-white border border-loop-border shadow-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[15px] font-bold text-loop-ink truncate">
              {p.name} - {p.branch}
            </h3>
          </div>
          <p className="text-xs text-loop-muted flex items-center gap-1">
            <MapPin className="size-3" />
            {p.address}
          </p>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <Badge variant="default" className="text-[11px]">
              {toArabicDigits(p.distance.toFixed(1))} كم
            </Badge>
            <Badge variant="gray" className="text-[11px]">
              <Star className="size-3 fill-amber-400 stroke-amber-400" />
              {toArabicDigits(p.rating.toFixed(1))}
            </Badge>
            <Badge
              variant={p.isOpen ? "green" : "red"}
              className={cn("text-[11px]", !p.isOpen && "opacity-90")}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  p.isOpen ? "bg-loop-green-500 animate-pulse" : "bg-red-500"
                )}
              />
              {p.isOpen ? "مفتوحة الآن" : "مغلقة"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm">
          <Navigation className="size-4" />
          الاتجاهات
        </Button>
        <Button asChild variant="default" size="sm" disabled={!p.isOpen}>
          <Link href={p.isOpen ? href : "#"}>سلّم هنا</Link>
        </Button>
      </div>
    </div>
  );
}
