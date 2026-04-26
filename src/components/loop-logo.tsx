import { cn } from "@/lib/utils";

interface LoopLogoProps {
  size?: number;
  variant?: "full" | "mark" | "wordmark-white";
  className?: string;
}

export function LoopLogo({ size = 36, variant = "full", className }: LoopLogoProps) {
  if (variant === "mark") {
    return <LoopMark size={size} className={className} />;
  }

  const isWhite = variant === "wordmark-white";
  const blue = isWhite ? "#FFFFFF" : "#1E5BB8";
  const green = isWhite ? "#A7F3B5" : "#3FAE4F";

  return (
    <div className={cn("inline-flex items-center gap-2", className)} dir="ltr">
      <LoopMark size={size} white={isWhite} />
      <svg
        height={size * 0.62}
        viewBox="0 0 140 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Loop"
      >
        <text
          x="0"
          y="42"
          fontFamily="Cairo, system-ui, sans-serif"
          fontSize="46"
          fontWeight="800"
          fill={blue}
          letterSpacing="-1"
        >
          L
        </text>
        <path
          d="M40 28c0-8 6-14 13-14s13 6 13 14-6 14-13 14-13-6-13-14zm26 0c0-8 6-14 13-14s13 6 13 14-6 14-13 14-13-6-13-14z"
          fill="none"
          stroke="url(#loop-grad)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <text
          x="98"
          y="42"
          fontFamily="Cairo, system-ui, sans-serif"
          fontSize="46"
          fontWeight="800"
          fill={blue}
          letterSpacing="-1"
        >
          p
        </text>
        <defs>
          <linearGradient id="loop-grad" x1="40" y1="28" x2="92" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={blue} />
            <stop offset="0.5" stopColor={green} />
            <stop offset="1" stopColor={blue} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function LoopMark({
  size = 36,
  white = false,
  className,
}: {
  size?: number;
  white?: boolean;
  className?: string;
}) {
  const blue = white ? "#FFFFFF" : "#1E5BB8";
  const green = white ? "#A7F3B5" : "#3FAE4F";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Loop"
    >
      <path
        d="M52 22a22 22 0 0 0-39-7"
        stroke={blue}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M48 8l4 14-13-2" fill={blue} />
      <path
        d="M12 42a22 22 0 0 0 39 7"
        stroke={green}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M16 56l-4-14 13 2" fill={green} />
      <path
        d="M30 18h4v6h6v4h-6v6h-4v-6h-6v-4h6z"
        fill={green}
      />
      <rect
        x="34"
        y="28"
        width="14"
        height="6"
        rx="3"
        fill={blue}
        transform="rotate(35 34 28)"
      />
    </svg>
  );
}
