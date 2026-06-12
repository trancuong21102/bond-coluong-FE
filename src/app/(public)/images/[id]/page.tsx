"use client"
import { useGetPublicImageById, useGetPublicCategoryImages, type ImageModel, useGetSavedImageIds, useSaveImage, useUnsaveImage } from "@/store/api"
import { notFound, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ImageCard } from "@/components/pinterest/ImageCard"
import MasonryGrid from "@/components/ui/grid"
import { use } from "react"
import useAuthStore from "@/lib/store/authStore"
import { toast } from "sonner"

export default function ImageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: response, isLoading, isError } = useGetPublicImageById(id)
  const image = response?.data

  const { isAuthenticated } = useAuthStore()
  const { data: savedIdsResponse } = useGetSavedImageIds({ enabled: isAuthenticated })
  const savedIds = savedIdsResponse?.data ?? []
  const isSaved = savedIds.includes(Number(id))

  const { mutate: saveImage, isPending: saving } = useSaveImage()
  const { mutate: unsaveImage, isPending: unsaving } = useUnsaveImage()

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để lưu hình ảnh")
      router.push("/login")
      return
    }

    if (isSaved) {
      unsaveImage(id, {
        onSuccess: () => toast.success("Đã bỏ lưu ảnh"),
        onError: () => toast.error("Không thể bỏ lưu ảnh"),
      })
    } else {
      saveImage(id, {
        onSuccess: () => toast.success("Lưu ảnh thành công"),
        onError: () => toast.error("Không thể lưu ảnh"),
      })
    }
  }

  // Fetch related images from the same category
  const categorySlug = image?.category?.slug ?? ""
  const { data: relatedResponse, isLoading: loadingRelated } = useGetPublicCategoryImages(categorySlug)
  const relatedImages = (relatedResponse?.data ?? []).filter((img: ImageModel) => img.id !== id)
  if (isError) notFound()

  return (
    <main className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)]">
      {/* ── Left Panel: fixed, scrollable ── */}
      <div className="w-full md:w-[420px] lg:w-[480px] shrink-0 md:h-full md:overflow-y-auto border-b md:border-b-0 md:border-r border-hairline bg-canvas">
        {/* Back button */}
        <div className="sticky top-0 z-10 bg-canvas/80 backdrop-blur-sm px-4 pt-4 pb-2">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-surface-card hover:bg-secondary-pressed transition-colors flex items-center justify-center"
            aria-label="Go back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="px-4 pb-8 space-y-4 animate-pulse">
            <div className="w-full aspect-[4/5] bg-surface-card rounded-[24px]" />
            <div className="h-8 bg-surface-card rounded-[12px] w-3/4" />
            <div className="h-4 bg-surface-card rounded-[12px] w-full" />
            <div className="h-4 bg-surface-card rounded-[12px] w-2/3" />
          </div>
        ) : image && (
          <div className="px-4 pb-8">
            {/* Main Image */}
            <div className="relative rounded-[24px] overflow-hidden bg-surface-card mb-6">
              <Image
                src={image.imageUrl}
                alt={image.title}
                width={image.width ?? 800}
                height={image.height ?? 600}
                sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1024px) 420px, 480px"
                className="w-full h-auto object-cover"
                priority
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                {/* Download */}
                <button className="w-10 h-10 rounded-full bg-surface-card hover:bg-secondary-pressed transition-colors flex items-center justify-center" aria-label="Download">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" x2="12" y1="15" y2="3"/>
                  </svg>
                </button>
                {/* Share */}
                <button className="w-10 h-10 rounded-full bg-surface-card hover:bg-secondary-pressed transition-colors flex items-center justify-center" aria-label="Share">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>
                    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
                  </svg>
                </button>
                {/* More */}
                <button className="w-10 h-10 rounded-full bg-surface-card hover:bg-secondary-pressed transition-colors flex items-center justify-center" aria-label="More options">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>
                  </svg>
                </button>
              </div>
              <Button
                variant={isSaved ? "secondary" : "primary"}
                className="rounded-full px-6 font-bold"
                onClick={handleSave}
                disabled={saving || unsaving}
              >
                {isSaved ? "Đã lưu" : "Lưu"}
              </Button>
            </div>

            {/* Title */}
            <h1 className="text-heading-xl text-ink font-bold mb-3 leading-tight">{image.title}</h1>

            {/* Description */}
            {image.description && (
              <p className="text-body-md text-mute mb-5 whitespace-pre-line leading-relaxed">{image.description}</p>
            )}

            {/* Category badge */}
            {image.category?.name && (
              <Link href={`/categories/${image.category.slug || ""}`} className="inline-flex mb-6">
                <span className="text-body-sm font-bold text-ink bg-surface-card px-4 py-1.5 rounded-full hover:bg-secondary-pressed transition-colors border border-hairline">
                  {image.category.name}
                </span>
              </Link>
            )}

            {/* Author */}
            <div className="flex items-center justify-between pt-4 border-t border-hairline">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-surface-card border border-hairline flex items-center justify-center text-body-strong font-bold text-ash">
                  {image.uploadedBy?.name?.charAt(0) ?? "?"}
                </div>
                <div>
                  <p className="text-body-strong text-ink">{image.uploadedBy?.name}</p>
                  <p className="text-caption-sm text-mute">Tác giả</p>
                </div>
              </div>
              <Button variant="secondary" className="rounded-full text-body-sm font-bold">Theo dõi</Button>
            </div>

            {/* Comment placeholder */}
            <div className="mt-6 pt-5 border-t border-hairline">
              <p className="text-body-sm text-mute mb-3 font-medium">Thêm một nhận xét để bắt đầu cuộc trò chuyện</p>
              <div className="flex items-center gap-2 bg-surface-soft rounded-full px-4 py-2.5 border border-hairline">
                <div className="w-7 h-7 rounded-full bg-surface-card border border-hairline flex items-center justify-center text-caption-sm font-bold text-ash shrink-0">?</div>
                <input
                  type="text"
                  placeholder="Thêm nhận xét..."
                  className="flex-1 bg-transparent text-body-sm text-ink outline-none placeholder:text-mute"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Right Panel: related images masonry ── */}
      <div className="w-full md:flex-1 md:h-full md:overflow-y-auto px-4 sm:px-6 pt-6 pb-16 bg-canvas">
        {loadingRelated && (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="mb-4 break-inside-avoid rounded-[16px] bg-surface-card animate-pulse"
                style={{ height: `${180 + (i % 3) * 60}px` }}
              />
            ))}
          </div>
        )}

        {!loadingRelated && relatedImages.length > 0 && (
          <>
            <p className="text-body-sm text-mute font-medium mb-5 uppercase tracking-wide">
              Hình ảnh liên quan • {image?.category?.name}
            </p>
            <MasonryGrid
              items={relatedImages}
              renderItem={(img: ImageModel) => (
                <ImageCard
                  key={img.id}
                  id={img.id}
                  title={img.title}
                  imageUrl={img.imageUrl}
                  category={img.category?.name}
                  categorySlug={img.category?.slug}
                  authorName={img.uploadedBy?.name}
                  authorAvatar={img.uploadedBy?.avatar ?? undefined}
                  width={img.width ?? 800}
                  height={img.height ?? 600}
                  sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1024px) calc((100vw - 3rem) / 2), (max-width: 1280px) calc((100vw - 520px) / 3), calc((100vw - 560px) / 4)"
                />
              )}
            />
          </>
        )}

        {!loadingRelated && relatedImages.length === 0 && !isLoading && (
          <div className="flex min-h-80 flex-col items-center justify-center text-center py-24 md:h-full">
            <p className="text-heading-md text-mute mb-2">Chưa có hình ảnh liên quan</p>
            <p className="text-body-md text-mute">Hãy là người đầu tiên đăng tải!</p>
          </div>
        )}
      </div>
    </main>
  )
}
