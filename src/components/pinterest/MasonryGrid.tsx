import * as React from "react"
import { cn } from "@/lib/utils"

interface MasonryGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function MasonryGrid({ children, className, ...props }: MasonryGridProps) {
  return (
    <div
      className={cn(
        "columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-sm space-y-sm w-full mx-auto max-w-[2000px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
