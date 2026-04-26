"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Pill, MapPin, Gift, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/home",        label: "الرئيسية",  icon: Home },
  { href: "/my-medicines",label: "أدويتي",    icon: Pill },
  { href: "/pharmacies",  label: "الصيدليات", icon: MapPin },
  { href: "/rewards",     label: "المكافآت",  icon: Gift },
  { href: "/profile",     label: "حسابي",     icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-loop-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto max-w-md grid grid-cols-5 h-16">
        {TABS.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                  active
                    ? "bg-loop-blue-50 text-loop-blue-600"
                    : "text-loop-muted"
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
              </span>
              <span
                className={cn(
                  "text-[11px] font-semibold leading-none",
                  active ? "text-loop-blue-700" : "text-loop-muted"
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
