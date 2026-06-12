"use client"
import * as React from 'react';
import { cn } from '@/lib/utils';
import { useInView } from 'framer-motion';

interface MasonryGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  gap?: string;
}

const AnimatedGridItem = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div
      ref={ref}
      className={cn(
        "opacity-0 translate-y-8 transition-all duration-1000 ease-in-out",
        {
          "opacity-100 translate-y-0": isInView,
        }
      )}
    >
      {children}
    </div>
  );
};

export const MasonryGrid = <T,>({
  items,
  renderItem,
  className,
  gap = '1.5rem',
}: MasonryGridProps<T>) => {
  return (
    <div
      className={cn(
        "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 w-full mx-auto max-w-[2000px]",
        className
      )}
      style={{ columnGap: gap }}
    >
      {items.map((item, index) => (
        <div key={index} className="mb-6 break-inside-avoid">
          <AnimatedGridItem>
            {renderItem(item, index)}
          </AnimatedGridItem>
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;