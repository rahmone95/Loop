"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = (props: ToasterProps) => (
  <Sonner
    theme="light"
    className="toaster group"
    dir="rtl"
    toastOptions={{
      classNames: {
        toast:
          "rounded-xl border border-loop-border bg-white shadow-soft text-loop-ink font-sans",
        title: "text-sm font-semibold",
        description: "text-xs text-loop-muted",
      },
    }}
    {...props}
  />
);

export { Toaster };
