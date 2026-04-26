import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  withBottomNav?: boolean;
}

export function PageShell({ children, className, withBottomNav }: PageShellProps) {
  return (
    <div className="min-h-[100dvh] bg-loop-surface">
      <div
        className={cn(
          "mx-auto w-full max-w-md min-h-[100dvh] bg-loop-surface",
          withBottomNav && "pb-24",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
