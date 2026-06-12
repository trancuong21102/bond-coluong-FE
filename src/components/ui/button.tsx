"use client"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-button-md transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-outer focus-visible:ring-offset-2 focus-visible:ring-offset-focus-inner disabled:pointer-events-none disabled:bg-surface-card disabled:text-ash",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary-pressed)]",
        secondary:
          "bg-[var(--color-secondary-bg)] text-[var(--color-on-secondary)] hover:bg-[var(--color-secondary-pressed)]",
        tertiary:
          "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-surface-card)]",
        "icon-circular":
          "bg-[var(--color-surface-card)] text-[var(--color-ink)] hover:bg-[var(--color-secondary-pressed)] rounded-full",
        "pill-on-image":
          "bg-[var(--color-canvas)] text-[var(--color-ink)] hover:bg-[var(--color-surface-card)] rounded-full text-button-sm",
      },
      size: {
        default: "h-10 px-[14px] py-[6px] rounded-[16px]",
        icon: "h-10 w-10 rounded-full",
        pill: "px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
