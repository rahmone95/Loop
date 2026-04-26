"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { LoopLogo } from "@/components/loop-logo";

export default function SplashPage() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-loop-blue-700">
      <div className="absolute inset-0 bg-loop-gradient" />
      <div className="absolute inset-0 opacity-[0.06] grid-bg" />

      <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6 pt-16 md:pt-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="origin-center scale-95 sm:scale-110 md:scale-150"
        >
          <LoopLogo variant="wordmark-white" size={100} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 md:mt-14 text-3xl md:text-4xl font-extrabold text-white text-balance leading-tight"
        >
          دائرةُ الدواء، دوامُ الأثر
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-3 text-sm md:text-base italic text-loop-green-100"
          dir="ltr"
        >
          The loop of medicine. The endurance of impact.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 md:mt-12 flex flex-col items-center gap-4"
        >
          <Link
            href="/onboarding"
            className="group inline-flex items-center gap-2 rounded-full bg-white text-loop-blue-700 px-10 py-4 text-base md:text-lg font-extrabold shadow-glow hover:bg-white/95 active:scale-[0.98] transition-all"
          >
            ابدأ الآن
            <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="text-white/80 text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors"
          >
            لدي حساب — تسجيل الدخول
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
