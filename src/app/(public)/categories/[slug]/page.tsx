"use client"
import MasonryGrid from "@/components/ui/grid"
import { ImageCard } from "@/components/pinterest/ImageCard"
import { useGetPublicCategoryBySlug, useGetPublicCategoryImages } from "@/store/api"
import { notFound } from "next/navigation"
import { use } from "react"

export default function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  
  const { data: categoryResponse, isLoading: loadingCat, isError: errorCat } = useGetPublicCategoryBySlug(slug)
  const category = categoryResponse?.data
  const { data: response, isLoading: loadingImgs } = useGetPublicCategoryImages(slug)
  const images = response?.data ?? []

  if (errorCat) notFound()

  return (
    <main className="flex-1 w-full max-w-[2000px] mx-auto px-4 mt-4 pb-16">
      <div className="flex flex-col items-center mb-8 py-8 px-4 bg-surface-soft rounded-[32px] mx-auto max-w-5xl">
        {loadingCat ? (
          <div className="h-10 w-48 bg-surface-card rounded-[16px] animate-pulse mb-2" />
        ) : (
          <>
            <h1 className="text-display-lg text-ink font-bold mb-2">{category?.name}</h1>
            <p className="text-body-md text-mute">{category?.imageCount} Pins</p>
          </>
        )}
      </div>

      {loadingImgs && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-surface-card rounded-[16px] animate-pulse" style={{ height: `${200 + (i % 3) * 80}px` }} />
          ))}
        </div>
      )}

      {!loadingImgs && images.length > 0 && (
        <MasonryGrid
          items={images}
          renderItem={(img: any) => (
            <ImageCard
              key={img.id}
              id={img.id}
              title={img.title}
              imageUrl={img.imageUrl}
              category={category?.name}
              authorAvatar={img.uploadedBy?.avatar ?? undefined}
              categorySlug={slug}
              authorName={img.uploadedBy?.name}
              width={img.width ?? 800}
              height={img.height ?? 600}
            />
          )}
        />
      )}

      {!loadingImgs && images.length === 0 && (
        <p className="text-center text-body-md text-mute py-12">No images in this category yet.</p>
      )}
    </main>
  )
}
