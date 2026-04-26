"use client";

import Link from "next/link";
import { ShieldCheck, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoopLogo } from "@/components/loop-logo";

export default function AdminLoginPage() {
  return (
    <main className="min-h-[100dvh] bg-loop-bg-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-loop-gradient opacity-95" />
      <div className="absolute inset-0 grid-bg opacity-[0.06]" />

      <div className="relative z-10 min-h-[100dvh] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white shadow-glow p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <LoopLogo size={40} />
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-loop-blue-50 text-loop-blue-700 px-3 py-1 text-xs font-bold">
              <ShieldCheck className="size-3.5" />
              لوحة Loop التنفيذية
            </div>
            <h1 className="mt-3 text-2xl font-extrabold text-loop-ink">
              للجهات التنظيمية وشركاء الرعاية
            </h1>
            <p className="mt-1 text-sm text-loop-muted">
              عرض موحد لمؤشرات الأداء والاستدامة
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>البريد الرسمي</Label>
              <Input type="email" placeholder="admin@sfda.gov.sa" dir="ltr" className="text-left" />
            </div>
            <div>
              <Label>كلمة المرور</Label>
              <Input type="password" placeholder="••••••••" dir="ltr" />
            </div>
            <Button variant="gradient" size="lg" width="full">
              دخول
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-loop-border" />
              <span className="text-xs text-loop-muted">للعرض التجريبي</span>
              <div className="h-px flex-1 bg-loop-border" />
            </div>

            <Button asChild variant="outline" size="lg" width="full">
              <Link href="/admin/dashboard?role=sfda">
                دخول كهيئة الغذاء والدواء
                <ArrowLeft className="size-5" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" width="full">
              <Link href="/admin/dashboard?role=sponsor">
                <Sparkles className="size-5" />
                دخول كشركة سبيمكو (راعي)
              </Link>
            </Button>
          </div>

          <Link
            href="/"
            className="mt-6 block text-center text-xs text-loop-muted hover:text-loop-ink"
          >
            ← العودة لتطبيق المستخدم
          </Link>
        </div>
      </div>
    </main>
  );
}
