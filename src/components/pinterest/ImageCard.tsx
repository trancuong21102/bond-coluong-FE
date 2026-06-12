import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface ImageCardProps {
  id: string
  imageUrl: string
  title: string
  category?: string
  categorySlug?: string
  authorName?: string
  authorAvatar?: string
  width?: number
  height?: number
  sizes?: string
  className?: string
}

const masonryImageSizes = "(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc((100vw - 4rem) / 2), (max-width: 1280px) calc((100vw - 6rem) / 3), 25vw"

export function ImageCard({
  id,
  imageUrl,
  title,
  category,
  categorySlug,
  authorName,
  authorAvatar,
  width = 600,
  height = 800,
  sizes = masonryImageSizes,
  className,
}: ImageCardProps) {
  return (
    <div className={cn("group relative mb-sm break-inside-avoid", className)}>
      <div className="relative overflow-hidden rounded-[16px] bg-surface-card">
        {/* We use next/image with a placeholder color or real image */}
        <Image
          src={imageUrl}
          alt={title}
          width={width}
          height={height}
          sizes={sizes}
          className="w-full h-auto object-cover"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex flex-col justify-between p-4">
          <div className="flex justify-end">
            <Button variant="primary" className="rounded-full">Save</Button>
          </div>
          <div className="flex justify-between items-end">
            {category && (
              <Link href={`/categories/${categorySlug || category.toLowerCase()}`}>
                <Button variant="pill-on-image">{category}</Button>
              </Link>
            )}
          </div>
          
          {/* Entire card click area covering the overlay except for the buttons */}
          <Link href={`/images/${id}`} className="absolute inset-0 z-0" aria-label={`View ${title}`} />
        </div>
      </div>
      
      {/* Below card text */}
      <div className="mt-2 px-1">
        <h3 className="text-body-strong truncate">{title}</h3>
        {authorName && (
          <div className="flex items-center gap-2 mt-1">
            {authorAvatar ? (
              <Image src={authorAvatar} alt={authorName} width={32} height={32} sizes="32px" className="rounded-full w-8 h-8 object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-surface-card flex items-center justify-center text-caption-md font-bold text-ash">
                {authorName.charAt(0)}
              </div>
            )}
            <p className="text-body-sm text-ink">{authorName}</p>
          </div>
        )}
      </div>
    </div>
  )
}
