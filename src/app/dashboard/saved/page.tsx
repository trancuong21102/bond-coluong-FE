"use client"
import { useGetSavedImages, type ImageModel } from "@/store/api"
import MasonryGrid from "@/components/ui/grid"
import { ImageCard } from "@/components/pinterest/ImageCard"

export default function SavedImagesPage() {
  const { data: response, isLoading, isError } = useGetSavedImages()
  const images = response?.data ?? []

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-heading-xl text-ink font-bold">Saved Images</h1>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-surface-card rounded-[16px] aspect-[3/4] animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-body-md text-mute text-center py-12">Could not load saved images.</p>
      )}

      {!isLoading && !isError && images.length === 0 && (
        <div className="bg-surface-card rounded-[16px] p-12 text-center border border-hairline border-dashed">
          <p className="text-body-md text-mute mb-2">You haven't saved any images yet.</p>
          <p className="text-body-sm text-mute">Explore the feed and click Save on your favorite photos!</p>
        </div>
      )}

      {!isLoading && !isError && images.length > 0 && (
        <MasonryGrid
          items={images}
          renderItem={(img: ImageModel) => (
            <ImageCard
              key={img.id}
              id={img.id}
              title={img.title}
              imageUrl={img.imageUrl}
              category={img.category?.name}
              categorySlug={img.category?.slug}
              authorName={img.uploadedBy?.name}
              width={img.width ?? 800}
              height={img.height ?? 600}
            />
          )}
        />
      )}
    </div>
  )
}
