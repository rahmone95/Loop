"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoopLogo } from "@/components/loop-logo";
import { toArabicDigits } from "@/lib/arabic";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const phoneValid = phone.replace(/\D/g, "").length >= 9;

  useEffect(() => {
    if (step === "otp") inputs.current[0]?.focus();
  }, [step]);

  useEffect(() => {
    if (otp.every((d) => d.length === 1)) {
      const t = setTimeout(() => router.push("/home"), 500);
      return () => clearTimeout(t);
    }
  }, [otp, router]);

  return (
    <main className="min-h-[100dvh] bg-white">
      <div className="mx-auto max-w-md min-h-[100dvh] flex flex-col">
        <header className="flex items-center justify-between p-4">
          <button
            aria-label="رجوع"
            onClick={() => (step === "otp" ? setStep("phone") : router.back())}
            className="h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-loop-surface-soft"
          >
            <ChevronRight className="size-5 text-loop-ink" />
          </button>
          <LoopLogo size={32} />
          <span className="w-10" />
        </header>

        <div className="flex-1 px-6 pt-6">
          {step === "phone" ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl font-bold text-loop-ink">مرحبًا بك في Loop</h1>
              <p className="mt-2 text-loop-body">أدخل رقم جوالك للبدء</p>

              <div className="mt-8">
                <label className="block text-sm font-semibold text-loop-ink mb-2">
                  رقم الجوال
                </label>
                <div className="relative" dir="ltr">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-loop-body font-semibold text-[15px] select-none">
                    +966
                  </span>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    placeholder="5X XXX XXXX"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/[^\d ]/g, "").slice(0, 11))
                    }
                    className="pl-16 text-left tracking-wider"
                  />
                </div>
              </div>

              <Button
                variant="gradient"
                width="full"
                disabled={!phoneValid}
                onClick={() => setStep("otp")}
                className="mt-6"
              >
                إرسال رمز التحقق
              </Button>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-loop-border" />
                <span className="text-xs text-loop-muted">أو</span>
                <div className="h-px flex-1 bg-loop-border" />
              </div>

              <Button asChild variant="outline" width="full" className="mt-6">
                <Link href="/home">دخول كضيف (للعرض التجريبي)</Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl font-bold text-loop-ink">أدخل رمز التحقق</h1>
              <p className="mt-2 text-loop-body">
                أرسلنا رمزًا إلى رقمك{" "}
                <span dir="ltr" className="font-semibold text-loop-ink">
                  +966 {phone || "5X XXX XXXX"}
                </span>
              </p>

              <div className="mt-10 flex justify-center gap-3" dir="ltr">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputs.current[i] = el;
                    }}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      const next = [...otp];
                      next[i] = v;
                      setOtp(next);
                      if (v && i < 3) inputs.current[i + 1]?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[i] && i > 0) {
                        inputs.current[i - 1]?.focus();
                      }
                    }}
                    className={cn(
                      "h-16 w-14 rounded-2xl border-2 bg-white text-center text-2xl font-bold text-loop-ink",
                      "transition-all focus:outline-none focus:border-loop-blue-500 focus:ring-2 focus:ring-loop-blue-500/20",
                      digit ? "border-loop-blue-500" : "border-loop-border"
                    )}
                  />
                ))}
              </div>

              <p className="mt-8 text-center text-sm text-loop-muted">
                لم يصلك الرمز؟{" "}
                <button className="text-loop-blue-600 font-semibold">
                  أعد الإرسال خلال {toArabicDigits(30)} ثانية
                </button>
              </p>

              <p className="mt-6 text-center text-xs text-loop-muted">
                للعرض التجريبي: أدخل أي ٤ أرقام
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
