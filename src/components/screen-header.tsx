"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScreenHeaderProps {
  title?: string;
  rightSlot?: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
  className?: string;
}

export function ScreenHeader({
  title,
  rightSlot,
  onBack,
  showBack = true,
  className,
}: ScreenHeaderProps) {
  const router = useRouter();
  return (
    <header
      className={cn(
        "sticky top-0 z-30 bg-loop-surface/85 backdrop-blur-md border-b border-loop-border/60",
        className
      )}
    >
      <div className="h-14 px-2 flex items-center justify-between gap-2">
        {showBack ? (
          <button
            aria-label="رجوع"
            onClick={() => (onBack ? onBack() : router.back())}
            className="h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-loop-surface-soft text-loop-ink"
          >
            <ChevronRight className="size-5" />
          </button>
        ) : (
          <span className="w-10" />
        )}
        <h1 className="text-base font-bold text-loop-ink truncate">{title}</h1>
        <div className="w-10 flex justify-end">{rightSlot}</div>
      </div>
    </header>
  );
}
