import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[88px] w-full rounded-xl border border-loop-border bg-white p-4 text-[15px] text-loop-ink placeholder:text-loop-muted leading-relaxed",
        "transition-colors focus-visible:outline-none focus-visible:border-loop-blue-500 focus-visible:ring-2 focus-visible:ring-loop-blue-500/20",
        "disabled:cursor-not-allowed disabled:opacity-60 resize-none",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
