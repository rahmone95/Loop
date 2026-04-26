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
    illustration: <DrawerIllustration />,
    title: "أدويتك المنسية لها قيمة",
    subtitle:
      "٨ من كل ١٠ أدوية في البيوت السعودية تنتهي في القمامة. خلّها تصير أثرًا إيجابيًا.",
  },
  {
    illustration: <PharmacyIllustration />,
    title: "سلّم في أقرب صيدلية",
    subtitle:
      "شبكة من الصيدليات الشريكة في الرياض، فيها صناديق Loop الذكية لاستلام أدويتك بسهولة.",
  },
  {
    illustration: <RewardsIllustration />,
    title: "احصل على نقاط ومكافآت",
    subtitle:
      "كل علبة تسلّمها تكسبك نقاط Loop، تستبدلها بكوبونات خصم في الصيدليات الشريكة.",
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

function DrawerIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="w-40 h-40" fill="none">
      <rect x="36" y="60" width="128" height="100" rx="14" fill="white" stroke="#1E5BB8" strokeWidth="3" />
      <rect x="36" y="60" width="128" height="40" rx="14" fill="#EFF4FB" stroke="#1E5BB8" strokeWidth="3" />
      <circle cx="100" cy="80" r="3" fill="#1E5BB8" />
      <rect x="56" y="112" width="36" height="20" rx="10" fill="#3FAE4F" />
      <rect x="98" y="116" width="28" height="14" rx="7" fill="#1E5BB8" opacity="0.7" />
      <rect x="132" y="110" width="22" height="22" rx="6" fill="#5BC75A" opacity="0.8" />
      <rect x="56" y="138" width="48" height="16" rx="8" fill="#DCE7F7" />
      <rect x="110" y="138" width="44" height="16" rx="8" fill="#D9EDDC" />
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
