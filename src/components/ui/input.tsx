import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "h-12 w-full rounded-xl border border-loop-border bg-white px-4 text-[15px] text-loop-ink placeholder:text-loop-muted",
        "transition-colors focus-visible:outline-none focus-visible:border-loop-blue-500 focus-visible:ring-2 focus-visible:ring-loop-blue-500/20",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
