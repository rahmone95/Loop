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

  return (
    <div
      className={cn("inline-flex items-center", className)}
      style={{ gap: size * 0.22 }}
      dir="ltr"
    >
      <LoopMark size={size} white={isWhite} />
      <LoopWordmark height={size * 0.78} white={isWhite} />
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
  const blueDeep = white ? "#FFFFFF" : "#163F82";
  const greenDeep = white ? "#A7F3B5" : "#2E8A3D";
  const capsuleSplit = white ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.85)";

  const uid = `lm-${white ? "w" : "c"}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Loop"
    >
      <defs>
        <linearGradient id={`${uid}-blue`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={blueDeep} />
        </linearGradient>
        <linearGradient id={`${uid}-green`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={greenDeep} />
          <stop offset="100%" stopColor={green} />
        </linearGradient>
      </defs>

      {/* Top blue circular arrow */}
      <path
        d="M 14 44 A 28 28 0 0 1 60 20"
        stroke={`url(#${uid}-blue)`}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Blue arrowhead at top-right */}
      <path d="M 56 11 L 67 19 L 53 23 Z" fill={blue} />

      {/* Bottom green circular arrow */}
      <path
        d="M 66 36 A 28 28 0 0 1 20 60"
        stroke={`url(#${uid}-green)`}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Green arrowhead at bottom-left */}
      <path d="M 24 69 L 13 61 L 27 57 Z" fill={green} />

      {/* ECG / heartbeat line */}
      <path
        d="M 21 40 L 26 40 L 28 33 L 31 47 L 34 28 L 37 47 L 39 40 L 44 40"
        stroke={green}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Medicine capsule, tilted */}
      <g transform="rotate(28 51 38)">
        <rect
          x="46.5"
          y="26"
          width="9"
          height="24"
          rx="4.5"
          fill={blue}
        />
        <line
          x1="46.5"
          y1="38"
          x2="55.5"
          y2="38"
          stroke={capsuleSplit}
          strokeWidth="1.6"
        />
      </g>

      {/* Leaf at bottom */}
      <path
        d="M 23 56 Q 28 50 35 53 Q 33 60 26 60 Q 23 59 23 56 Z"
        fill={green}
      />
      <path
        d="M 25 57 Q 29 55 33 55"
        stroke={white ? "rgba(255,255,255,0.7)" : "#2E8A3D"}
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LoopWordmark({
  height,
  white = false,
}: {
  height: number;
  white?: boolean;
}) {
  const blue = white ? "#FFFFFF" : "#1E5BB8";
  const green = white ? "#A7F3B5" : "#3FAE4F";
  const uid = `lw-${white ? "w" : "c"}`;

  return (
    <svg
      height={height}
      viewBox="0 0 200 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loop"
    >
      <defs>
        <linearGradient id={`${uid}-grad`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={blue} />
          <stop offset="55%" stopColor={blue} />
          <stop offset="100%" stopColor={green} />
        </linearGradient>
      </defs>

      {/* L */}
      <path
        d="M 8 8 L 8 58 L 36 58"
        stroke={blue}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* o - first */}
      <circle
        cx="68"
        cy="42"
        r="16"
        stroke={`url(#${uid}-grad)`}
        strokeWidth="9"
        fill="none"
      />

      {/* o - second (overlapping like infinity) */}
      <circle
        cx="104"
        cy="42"
        r="16"
        stroke={`url(#${uid}-grad)`}
        strokeWidth="9"
        fill="none"
      />

      {/* p - stem + bowl */}
      <path
        d="M 132 26 L 132 68"
        stroke={green}
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />
      <circle
        cx="148"
        cy="42"
        r="16"
        stroke={green}
        strokeWidth="9"
        fill="none"
      />
    </svg>
  );
}
