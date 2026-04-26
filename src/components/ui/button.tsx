import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-loop-blue-600 text-white hover:bg-loop-blue-700 shadow-soft",
        gradient:
          "bg-loop-blue-gradient text-white hover:opacity-95 shadow-glow",
        green:
          "bg-loop-green-600 text-white hover:bg-loop-green-700 shadow-soft",
        outline:
          "border border-loop-border bg-white text-loop-ink hover:bg-loop-surface-soft",
        secondary:
          "bg-loop-blue-50 text-loop-blue-700 hover:bg-loop-blue-100",
        ghost:
          "text-loop-ink hover:bg-loop-surface-soft",
        link:
          "text-loop-blue-600 underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-90 shadow-soft",
      },
      size: {
        default: "h-12 px-6 text-[15px] rounded-2xl [&_svg]:size-5",
        sm:      "h-10 px-4 text-sm rounded-xl [&_svg]:size-4",
        xs:      "h-8 px-3 text-xs rounded-lg [&_svg]:size-3.5",
        lg:      "h-14 px-8 text-base rounded-2xl [&_svg]:size-5",
        icon:    "h-11 w-11 rounded-xl [&_svg]:size-5",
        "icon-sm": "h-9 w-9 rounded-lg [&_svg]:size-4",
      },
      width: {
        auto: "",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      width: "auto",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, width, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, width, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
