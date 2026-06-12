"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-[16px] border border-ash bg-canvas px-[15px] py-[11px] text-body-md text-ink transition-colors file:border-0 file:bg-transparent file:text-body-md file:font-medium placeholder:text-ash focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-outer focus-visible:border-ink disabled:cursor-not-allowed disabled:bg-surface-card disabled:text-ash disabled:border-ash",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
