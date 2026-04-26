"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Cloud, Sparkles, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
  type ConfirmationResult,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoopLogo } from "@/components/loop-logo";
import { toArabicDigits } from "@/lib/arabic";
import { cn } from "@/lib/utils";
import {
  startGuestMode,
  setMode,
  ensureLiveProfile,
  liveProfileExists,
} from "@/lib/store";
import { isFirebaseReady, getFirebase } from "@/lib/firebase";

type Step = "phone" | "otp" | "name";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const verifierRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const newUserRef = useRef<{ uid: string; e164: string } | null>(null);

  const cleanDigits = phone.replace(/\D/g, "");
  const phoneValid = cleanDigits.length >= 9;

  function buildE164() {
    let d = cleanDigits;
    if (d.startsWith("0")) d = d.slice(1);
    if (d.startsWith("966")) d = d.slice(3);
    return `+966${d}`;
  }

  // Setup invisible reCAPTCHA on phone step
  useEffect(() => {
    if (!isFirebaseReady || step !== "phone") return;
    const { auth } = getFirebase();
    if (!auth) return;
    if (verifierRef.current) return;
    try {
      verifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    } catch (e) {
      console.error("recaptcha init error", e);
    }
  }, [step]);

  // Resend countdown
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  // Auto-focus first OTP input
  useEffect(() => {
    if (step === "otp") inputs.current[0]?.focus();
  }, [step]);

  async function sendOtp() {
    if (!isFirebaseReady) {
      toast.error("الخدمة غير متاحة، استخدم وضع التجربة");
      return;
    }
    const { auth } = getFirebase();
    if (!auth || !verifierRef.current) {
      toast.error("تعذّر تهيئة التحقق، حدّث الصفحة");
      return;
    }
    setSending(true);
    try {
      const e164 = buildE164();
      const result = await signInWithPhoneNumber(auth, e164, verifierRef.current);
      confirmationRef.current = result;
      setOtp(Array(6).fill(""));
      setStep("otp");
      setResendIn(30);
      toast.success(`تم إرسال رمز التحقق إلى ${e164}`);
    } catch (err: unknown) {
      console.error("sendOtp error", err);
      const code = (err as { code?: string })?.code || "";
      const message = (err as { message?: string })?.message || "";
      let msg = "تعذّر إرسال الرمز، تأكد من الرقم";
      if (code === "auth/invalid-phone-number") msg = "رقم الجوال غير صحيح";
      else if (code === "auth/too-many-requests") msg = "محاولات كثيرة، انتظر قليلاً";
      else if (code === "auth/operation-not-allowed" || message.includes("billing")) {
        msg = "Phone Auth غير مفعّل في Firebase Console";
      }
      toast.error(msg);
      try {
        verifierRef.current?.clear();
      } catch {}
      verifierRef.current = null;
    } finally {
      setSending(false);
    }
  }

  const verifyOtp = useCallback(async () => {
    if (!confirmationRef.current) {
      toast.error("انتهت الجلسة، أعد إرسال الرمز");
      setStep("phone");
      return;
    }
    setVerifying(true);
    try {
      const code = otp.join("");
      const cred = await confirmationRef.current.confirm(code);
      setMode("live");
      const exists = await liveProfileExists(cred.user.uid);
      if (exists) {
        toast.success("أهلاً بك مجدداً");
        router.push("/home");
      } else {
        newUserRef.current = { uid: cred.user.uid, e164: buildE164() };
        setStep("name");
      }
    } catch (err: unknown) {
      console.error("verifyOtp error", err);
      const code = (err as { code?: string })?.code || "";
      let msg = "الرمز غير صحيح، حاول مجدداً";
      if (code === "auth/invalid-verification-code") msg = "الرمز غير صحيح";
      else if (code === "auth/code-expired") msg = "انتهت صلاحية الرمز، أعد الإرسال";
      toast.error(msg);
      setOtp(Array(6).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, router]);

  // Auto-submit when 6 digits filled
  useEffect(() => {
    if (step === "otp" && otp.every((d) => d.length === 1) && !verifying) {
      verifyOtp();
    }
  }, [otp, step, verifying, verifyOtp]);

  async function saveNameAndContinue() {
    const trimmed = name.trim();
    if (!trimmed || !newUserRef.current) {
      toast.error("الرجاء إدخال اسمك");
      return;
    }
    setSavingName(true);
    try {
      const { auth } = getFirebase();
      if (auth?.currentUser) {
        try {
          await updateProfile(auth.currentUser, { displayName: trimmed });
        } catch {}
      }
      await ensureLiveProfile(newUserRef.current.uid, trimmed, newUserRef.current.e164);
      toast.success("تم إنشاء حسابك بنجاح");
      router.push("/home");
    } catch (err) {
      console.error(err);
      toast.error("تعذّر حفظ البيانات، حاول مجدداً");
    } finally {
      setSavingName(false);
    }
  }

  async function enterDemo() {
    await startGuestMode();
    router.push("/home");
  }

  function onBack() {
    if (step === "name") {
      setStep("phone");
      return;
    }
    if (step === "otp") {
      setStep("phone");
      return;
    }
    router.back();
  }

  return (
    <main className="min-h-[100dvh] bg-white">
      <div className="mx-auto max-w-md min-h-[100dvh] flex flex-col">
        <header className="flex items-center justify-between p-4">
          <button
            aria-label="رجوع"
            onClick={onBack}
            className="h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-loop-surface-soft"
          >
            <ChevronRight className="size-5 text-loop-ink" />
          </button>
          <LoopLogo size={32} />
          <span className="w-10" />
        </header>

        <div className="flex-1 px-6 pt-6">
          {step === "phone" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl font-bold text-loop-ink">مرحبًا بك في Loop</h1>
              <p className="mt-2 text-loop-body">أدخل رقم جوالك للدخول أو إنشاء حساب جديد</p>

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
                disabled={!phoneValid || sending}
                onClick={sendOtp}
                className="mt-6"
              >
                {sending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  "إرسال رمز التحقق"
                )}
              </Button>

              {isFirebaseReady && (
                <p className="mt-3 text-[11px] text-center text-loop-muted flex items-center justify-center gap-1">
                  <Cloud className="size-3.5 text-loop-green-600" />
                  بياناتك ستُحفظ في السحابة وتزامن مع كل أجهزتك
                </p>
              )}

              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-loop-border" />
                <span className="text-xs text-loop-muted">أو</span>
                <div className="h-px flex-1 bg-loop-border" />
              </div>

              <Button
                variant="outline"
                width="full"
                className="mt-6"
                onClick={enterDemo}
              >
                <Sparkles className="size-4" />
                دخول كضيف (للعرض التجريبي)
              </Button>
              <p className="mt-2 text-[11px] text-center text-loop-muted">
                وضع التجربة: ٤ أدوية و٢٤٠ نقطة جاهزة، بدون حفظ خارجي
              </p>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl font-bold text-loop-ink">أدخل رمز التحقق</h1>
              <p className="mt-2 text-loop-body">
                أرسلنا رمزًا مكوّنًا من ٦ أرقام إلى{" "}
                <span dir="ltr" className="font-semibold text-loop-ink">
                  {buildE164()}
                </span>
              </p>

              <div className="mt-10 flex justify-center gap-2" dir="ltr">
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
                    disabled={verifying}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      const next = [...otp];
                      next[i] = v.slice(-1);
                      setOtp(next);
                      if (v && i < 5) inputs.current[i + 1]?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[i] && i > 0) {
                        inputs.current[i - 1]?.focus();
                      }
                    }}
                    onPaste={(e) => {
                      const pasted = e.clipboardData
                        .getData("text")
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      if (pasted.length === 6) {
                        e.preventDefault();
                        setOtp(pasted.split(""));
                        inputs.current[5]?.focus();
                      }
                    }}
                    className={cn(
                      "h-14 w-11 rounded-2xl border-2 bg-white text-center text-2xl font-bold text-loop-ink",
                      "transition-all focus:outline-none focus:border-loop-blue-500 focus:ring-2 focus:ring-loop-blue-500/20",
                      digit ? "border-loop-blue-500" : "border-loop-border"
                    )}
                  />
                ))}
              </div>

              {verifying && (
                <p className="mt-6 text-center text-sm text-loop-muted flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  جاري التحقق...
                </p>
              )}

              {!verifying && (
                <p className="mt-8 text-center text-sm text-loop-muted">
                  لم يصلك الرمز؟{" "}
                  {resendIn > 0 ? (
                    <span className="text-loop-muted">
                      أعد الإرسال خلال {toArabicDigits(resendIn)} ثانية
                    </span>
                  ) : (
                    <button
                      onClick={sendOtp}
                      disabled={sending}
                      className="text-loop-blue-600 font-semibold hover:underline"
                    >
                      أعد الإرسال
                    </button>
                  )}
                </p>
              )}
            </motion.div>
          )}

          {step === "name" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mx-auto h-14 w-14 rounded-2xl bg-loop-blue-50 text-loop-blue-700 inline-flex items-center justify-center">
                <User className="size-7" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-loop-ink">
                خطوة أخيرة لإنشاء حسابك
              </h1>
              <p className="mt-2 text-loop-body">
                ما اسمك؟ سيظهر في حسابك ولوحة المكافآت.
              </p>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-loop-ink mb-2">
                  الاسم الكامل
                </label>
                <Input
                  type="text"
                  placeholder="مثال: عبدالرحمن التركستاني"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 60))}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveNameAndContinue();
                  }}
                />
              </div>

              <Button
                variant="gradient"
                width="full"
                disabled={!name.trim() || savingName}
                onClick={saveNameAndContinue}
                className="mt-6"
              >
                {savingName ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  "إنشاء الحساب"
                )}
              </Button>

              <p className="mt-3 text-[11px] text-center text-loop-muted">
                بإنشاء الحساب فأنت توافق على شروط استخدام Loop وسياسة الخصوصية
              </p>
            </motion.div>
          )}
        </div>

        {/* invisible reCAPTCHA mount point */}
        <div id="recaptcha-container" />
      </div>
    </main>
  );
}
