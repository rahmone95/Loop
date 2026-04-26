"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Slide {
  illustration: React.ReactNode;
  title: string;
  subtitle: string;
}

const SLIDES: Slide[] = [
  {
    illustration: <CabinetIllustration />,
    title: "خزانة دوائك الذكية",
    subtitle:
      "احفظ كل أدوية أسرتك في مكان واحد، صور وانسَ — Loop يتذكر لك.",
  },
  {
    illustration: <AlertIllustration />,
    title: "تنبيهات تحمي عائلتك",
    subtitle:
      "نذكّرك قبل انتهاء صلاحية أي دواء، حتى لا يأخذ والداك دواءً منتهيًا بالخطأ.",
  },
  {
    illustration: <PharmacyIllustration />,
    title: "تخلّص آمن من الأدوية المنتهية",
    subtitle:
      "عند انتهاء صلاحية الدواء، Loop يوجّهك لأقرب صيدلية شريكة لتسليمه بأمان.",
  },
  {
    illustration: <RewardsIllustration />,
    title: "اربح نقاط ومكافآت",
    subtitle:
      "كل دواء تسلّمه يكسبك نقاط Loop، تستبدلها بكوبونات في الصيدليات الشريكة.",
  },
];

export default function OnboardingPage() {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  return (
    <main className="min-h-[100dvh] bg-white">
      <div className="mx-auto max-w-md min-h-[100dvh] flex flex-col">
        <header className="flex items-center justify-end p-4">
          <Link
            href="/login"
            className="text-loop-muted text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-loop-surface-soft"
          >
            تخطي
          </Link>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <div className="mx-auto mb-10 flex h-56 w-56 items-center justify-center rounded-[36px] bg-loop-gradient-soft">
                {slide.illustration}
              </div>
              <h1 className="text-2xl font-bold text-loop-ink leading-tight text-balance">
                {slide.title}
              </h1>
              <p className="mt-4 text-[15px] text-loop-body leading-relaxed text-balance max-w-sm mx-auto">
                {slide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="px-6 pb-8 pt-4">
          <div className="flex justify-center gap-2 mb-6">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`الشريحة ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-8 bg-loop-blue-600" : "w-2 bg-loop-border"
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {index > 0 && (
              <Button
                variant="outline"
                size="default"
                onClick={() => setIndex(index - 1)}
                className="px-4"
                aria-label="رجوع"
              >
                <ChevronLeft className="size-5 rotate-180" />
              </Button>
            )}
            <Button
              variant="gradient"
              size="default"
              width="full"
              onClick={() => {
                if (isLast) router.push("/login");
                else setIndex(index + 1);
              }}
              className="flex-1"
            >
              {isLast ? "ابدأ الآن" : "التالي"}
            </Button>
          </div>
        </footer>
      </div>
    </main>
  );
}

function CabinetIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-40 h-40" fill="none">
      <rect x="40" y="44" width="120" height="120" rx="14" fill="white" stroke="#1E5BB8" strokeWidth="3" />
      <line x1="40" y1="86" x2="160" y2="86" stroke="#1E5BB8" strokeWidth="2" />
      <line x1="40" y1="124" x2="160" y2="124" stroke="#1E5BB8" strokeWidth="2" />
      <line x1="100" y1="44" x2="100" y2="164" stroke="#1E5BB8" strokeWidth="2" opacity="0.4" />
      <rect x="52" y="56" width="34" height="20" rx="10" fill="#3FAE4F" />
      <rect x="114" y="58" width="32" height="16" rx="8" fill="#1E5BB8" opacity="0.7" />
      <rect x="52" y="96" width="32" height="18" rx="9" fill="#FCD34D" />
      <rect x="114" y="96" width="32" height="18" rx="9" fill="#5BC75A" opacity="0.85" />
      <rect x="52" y="134" width="32" height="20" rx="6" fill="#DCE7F7" />
      <rect x="114" y="134" width="32" height="20" rx="6" fill="#D9EDDC" />
    </svg>
  );
}

function AlertIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-40 h-40" fill="none">
      <rect x="48" y="60" width="104" height="100" rx="14" fill="white" stroke="#1E5BB8" strokeWidth="3" />
      <rect x="48" y="60" width="104" height="32" rx="14" fill="#EFF4FB" />
      <circle cx="68" cy="76" r="3" fill="#94A3B8" />
      <circle cx="84" cy="76" r="3" fill="#94A3B8" />
      <rect x="60" y="106" width="80" height="10" rx="5" fill="#DCE7F7" />
      <rect x="60" y="124" width="60" height="10" rx="5" fill="#DCE7F7" />
      <circle cx="148" cy="50" r="22" fill="#FCD34D" stroke="#92400E" strokeWidth="3" />
      <text x="148" y="58" textAnchor="middle" fontSize="22" fontWeight="800" fill="#92400E">!</text>
    </svg>
  );
}

function PharmacyIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-40 h-40" fill="none">
      <rect x="36" y="58" width="128" height="110" rx="12" fill="white" stroke="#1E5BB8" strokeWidth="3" />
      <rect x="36" y="58" width="128" height="32" rx="12" fill="#1E5BB8" />
      <path d="M92 70h6v-6h6v6h6v6h-6v6h-6v-6h-6z" fill="white" />
      <rect x="56" y="106" width="40" height="50" rx="10" fill="#EEF7EF" stroke="#3FAE4F" strokeWidth="2.5" />
      <text x="76" y="138" textAnchor="middle" fontSize="18" fontWeight="700" fill="#3FAE4F">Loop</text>
      <rect x="108" y="106" width="46" height="50" rx="8" fill="#F1F5F9" />
      <rect x="116" y="116" width="30" height="6" rx="3" fill="#94A3B8" />
      <rect x="116" y="128" width="22" height="6" rx="3" fill="#CBD5E1" />
    </svg>
  );
}

function RewardsIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-40 h-40" fill="none">
      <rect x="46" y="78" width="108" height="84" rx="12" fill="#EFF4FB" stroke="#1E5BB8" strokeWidth="3" />
      <rect x="46" y="106" width="108" height="6" fill="#1E5BB8" />
      <rect x="96" y="78" width="8" height="84" fill="#1E5BB8" />
      <path d="M100 78c-12 0-20-8-20-16s10-12 20-2c10-10 20-6 20 2s-8 16-20 16z" fill="#3FAE4F" />
      <circle cx="100" cy="40" r="14" fill="#FCD34D" />
      <path d="M100 30v20M90 40h20" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
