import * as React from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SearchBarProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, onClear, ...props }, ref) => {
    const showClear = onClear && props.value

    return (
      <div className="relative flex w-full items-center">
        <Search className="absolute left-4 h-5 w-5 text-ash" />
        <input
          type="text"
          className={cn(
            "flex h-12 w-full rounded-full border border-transparent bg-surface-card pl-[44px] pr-[44px] py-[11px] text-body-md text-ink transition-colors placeholder:text-ash focus:bg-canvas focus:border-2 focus:border-[#e60023] focus:outline-none",
            className
          )}
          ref={ref}
          {...props}
        />
        {showClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-4 p-1 rounded-full text-ash hover:bg-surface-soft hover:text-ink transition-colors cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}
      </div>
    )
  }
)
SearchBar.displayName = "SearchBar"
