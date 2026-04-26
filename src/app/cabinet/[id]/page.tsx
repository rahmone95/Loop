"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Trash2,
  ChevronDown,
  Pill,
  Heart,
  Calendar,
  StickyNote,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/screen-header";
import { PageShell } from "@/components/page-shell";
import {
  useLoopState,
  computeStatus,
  daysFromNow,
  type NotificationPrefs,
} from "@/lib/store";
import { toArabicDigits, formatArabicDate } from "@/lib/arabic";
import { cn } from "@/lib/utils";

export default function MedicineDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { state, update, hydrated } = useLoopState();
  const [notifsOpen, setNotifsOpen] = useState(false);

  const med = state.medicines.find((m) => m.id === params.id);

  if (!hydrated) {
    return (
      <PageShell>
        <ScreenHeader title="تفاصيل الدواء" />
        <div className="p-8 text-center text-loop-muted">...</div>
      </PageShell>
    );
  }

  if (!med) {
    return (
      <PageShell>
        <ScreenHeader title="غير موجود" />
        <div className="p-8 text-center text-loop-muted">
          هذا الدواء لم يعد موجودًا في خزانتك
        </div>
      </PageShell>
    );
  }

  const status = computeStatus(med.expiryDate);
  const days = daysFromNow(med.expiryDate);
  const notifs: NotificationPrefs = med.notifications || {
    before30: true,
    before7: true,
    onDay: true,
    daily: false,
  };

  function setNotif(key: keyof NotificationPrefs, value: boolean) {
    update((prev) => ({
      ...prev,
      medicines: prev.medicines.map((x) =>
        x.id === med!.id
          ? { ...x, notifications: { ...notifs, [key]: value } }
          : x
      ),
    }));
  }

  function deleteMedicine() {
    if (!med) return;
    update((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((x) => x.id !== med.id),
    }));
    toast.success("تم حذف الدواء من خزانتك");
    router.push("/cabinet");
  }

  return (
    <PageShell>
      <ScreenHeader title={med.name} />

      <div className="px-4 pt-3 pb-10 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <PhotoSlot label="صورة العلبة" url={med.photoUrl} />
          <PhotoSlot label="تاريخ الانتهاء" url={med.expiryPhotoUrl} />
        </div>

        <StatusCard status={status} days={days} expiryDate={med.expiryDate} medicineId={med.id} />

        <div className="rounded-2xl bg-white border border-loop-border shadow-card divide-y divide-loop-border">
          <InfoRow icon={<Pill className="size-5" />} label="اسم الدواء" value={med.name} />
          {med.forWhom && (
            <InfoRow icon={<Heart className="size-5" />} label="لمن" value={med.forWhom} />
          )}
          {med.purchaseDate && (
            <InfoRow
              icon={<Calendar className="size-5" />}
              label="تاريخ الشراء"
              value={formatArabicDate(med.purchaseDate)}
            />
          )}
          <InfoRow
            icon={<Calendar className="size-5" />}
            label="تاريخ الانتهاء"
            value={formatArabicDate(med.expiryDate)}
          />
          {med.notes && (
            <InfoRow icon={<StickyNote className="size-5" />} label="الملاحظات" value={med.notes} />
          )}
        </div>

        <div className="rounded-2xl bg-white border border-loop-border shadow-card overflow-hidden">
          <button
            onClick={() => setNotifsOpen((v) => !v)}
            className="w-full flex items-center justify-between p-4 hover:bg-loop-surface-soft transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-loop-blue-50 text-loop-blue-700 inline-flex items-center justify-center">
                <Bell className="size-5" />
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-loop-ink">إعدادات التذكيرات</p>
                <p className="text-xs text-loop-muted">
                  {Object.values(notifs).filter(Boolean).length} تذكيرات مفعّلة
                </p>
              </div>
            </div>
            <ChevronDown
              className={cn("size-5 text-loop-muted transition-transform", notifsOpen && "rotate-180")}
            />
          </button>
          {notifsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="border-t border-loop-border divide-y divide-loop-border"
            >
              <Toggle
                label="قبل ٣٠ يومًا من الانتهاء"
                value={notifs.before30}
                onChange={(v) => setNotif("before30", v)}
              />
              <Toggle
                label="قبل ٧ أيام من الانتهاء"
                value={notifs.before7}
                onChange={(v) => setNotif("before7", v)}
              />
              <Toggle
                label="يوم الانتهاء"
                value={notifs.onDay}
                onChange={(v) => setNotif("onDay", v)}
              />
              <Toggle
                label="تذكير يومي بعد الانتهاء حتى التسليم"
                value={notifs.daily}
                onChange={(v) => setNotif("daily", v)}
              />
            </motion.div>
          )}
        </div>

        <button
          onClick={deleteMedicine}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-600 py-3 rounded-2xl hover:bg-red-50 transition-colors"
        >
          <Trash2 className="size-4" />
          حذف من الخزانة
        </button>
      </div>
    </PageShell>
  );
}

function PhotoSlot({ label, url }: { label: string; url?: string | null }) {
  return (
    <div className="rounded-2xl bg-white border border-loop-border overflow-hidden">
      <div className="aspect-square bg-loop-surface-soft flex items-center justify-center">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={label} className="h-full w-full object-cover" />
        ) : (
          <Pill className="size-10 text-loop-muted/60" strokeWidth={1.5} />
        )}
      </div>
      <p className="text-[11px] text-center text-loop-muted py-2 px-1 truncate font-semibold">
        {label}
      </p>
    </div>
  );
}

function StatusCard({
  status,
  days,
  expiryDate,
  medicineId,
}: {
  status: "expired" | "nearExpiry" | "valid";
  days: number;
  expiryDate: string;
  medicineId: string;
}) {
  if (status === "expired") {
    return (
      <div className="rounded-3xl bg-red-50 border border-red-200 p-5">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-2xl bg-red-500 text-white inline-flex items-center justify-center shrink-0">
            <AlertTriangle className="size-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-extrabold text-red-900">
              دواء منتهي الصلاحية
            </h2>
            <p className="mt-1 text-sm text-red-800 leading-relaxed">
              انتهى منذ {toArabicDigits(Math.abs(days))} يومًا — لا تستخدمه
            </p>
          </div>
        </div>
        <Button
          asChild
          variant="destructive"
          size="lg"
          width="full"
          className="mt-4"
        >
          <Link href={`/pharmacies?selectedMedicine=${medicineId}`}>
            سلّم عبر Loop الآن
          </Link>
        </Button>
      </div>
    );
  }

  if (status === "nearExpiry") {
    return (
      <div className="rounded-3xl bg-orange-50 border border-orange-200 p-5">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-2xl bg-orange-500 text-white inline-flex items-center justify-center shrink-0">
            <Clock className="size-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-extrabold text-orange-900">
              يقترب من الانتهاء
            </h2>
            <p className="mt-1 text-sm text-orange-800 leading-relaxed">
              تبقى {toArabicDigits(days)} يومًا — استخدمه قبل {formatArabicDate(expiryDate)}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="outline" size="default">
            تأجيل التذكير
          </Button>
          <Button asChild variant="green" size="default">
            <Link href={`/pharmacies?selectedMedicine=${medicineId}`}>سلّم الآن</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-loop-green-50 border border-loop-green-200 p-5">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-2xl bg-loop-green-gradient text-white inline-flex items-center justify-center shrink-0">
          <CheckCircle2 className="size-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-extrabold text-loop-green-900">
            صالحة الاستخدام
          </h2>
          <p className="mt-1 text-sm text-loop-green-800 leading-relaxed">
            تنتهي في {formatArabicDate(expiryDate)} (بعد {toArabicDigits(days)} يومًا)
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4">
      <span className="text-loop-muted shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-loop-muted">{label}</p>
        <p className="text-sm font-semibold text-loop-ink mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between p-4 hover:bg-loop-surface-soft transition-colors text-right"
    >
      <span className="text-sm font-semibold text-loop-ink">{label}</span>
      <span
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors shrink-0",
          value ? "bg-loop-blue-600" : "bg-loop-border"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            value ? "right-0.5" : "right-[22px]"
          )}
        />
      </span>
    </button>
  );
}
