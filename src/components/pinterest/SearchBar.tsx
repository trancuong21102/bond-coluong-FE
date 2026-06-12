"use client"
import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SearchBarProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative flex w-full items-center">
        <Search className="absolute left-4 h-5 w-5 text-ash" />
        <input
          type="text"
          className={cn(
            "flex h-12 w-full rounded-full border border-transparent bg-surface-card pl-[44px] pr-[15px] py-[11px] text-body-md text-ink transition-colors placeholder:text-ash focus:bg-canvas focus:border-ash focus:outline-none focus:ring-4 focus:ring-focus-outer",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
SearchBar.displayName = "SearchBar"
