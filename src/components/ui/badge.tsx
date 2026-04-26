import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold leading-none whitespace-nowrap",
  {
    variants: {
      variant: {
        default:    "bg-loop-blue-50 text-loop-blue-700",
        green:      "bg-loop-green-50 text-loop-green-700",
        red:        "bg-red-50 text-red-700",
        orange:     "bg-orange-50 text-orange-700",
        gray:       "bg-loop-surface-soft text-loop-body",
        solidBlue:  "bg-loop-blue-600 text-white",
        solidGreen: "bg-loop-green-600 text-white",
        solidRed:   "bg-red-500 text-white",
        solidOrange:"bg-orange-500 text-white",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
