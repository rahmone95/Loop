"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LoopLogo } from "@/components/loop-logo";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace("/onboarding"), 2500);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-loop-blue-700">
      <div className="absolute inset-0 bg-loop-gradient" />
      <div className="absolute inset-0 opacity-[0.06] grid-bg" />

      <div className="absolute top-0 inset-x-0 flex justify-end p-4 z-20">
        <Link
          href="/onboarding"
          className="text-white/85 text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          تخطي
        </Link>
      </div>

      <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <LoopLogo variant="wordmark-white" size={84} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 text-2xl font-bold text-white text-balance leading-tight"
        >
          استرداد الأدوية، استدامة الأثر
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-3 text-sm italic text-loop-green-100"
          dir="ltr"
        >
          Recover medicine. Sustain impact.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute bottom-10 inset-x-0 flex justify-center"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/40 animate-pulse" />
            <span
              className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
