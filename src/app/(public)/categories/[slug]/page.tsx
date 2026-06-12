"use client"
import MasonryGrid from "@/components/ui/grid"
import { ImageCard } from "@/components/pinterest/ImageCard"
import { useGetPublicCategoryBySlug, useGetPublicCategoryImages, useRequestCategoryAccess } from "@/store/api"
import { notFound, useRouter } from "next/navigation"
import { use, useState } from "react"
import { Lock } from "lucide-react"
import useAuthStore from "@/lib/store/authStore"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  
  const { data: categoryResponse, isLoading: loadingCat, isError: isErrorCat, error: errorCatObj } = useGetPublicCategoryBySlug(slug)
  const category = categoryResponse?.data
  const { data: response, isLoading: loadingImgs } = useGetPublicCategoryImages(slug)
  const images = response?.data ?? []

  const { mutate: requestAccess, isPending: requesting } = useRequestCategoryAccess()
  const [hasRequested, setHasRequested] = useState(false)

  const isLocked = (errorCatObj as any)?.isLocked || false

  if (isErrorCat && !isLocked) {
    notFound()
  }

  const handleRequestAccess = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để gửi yêu cầu")
      router.push("/login")
      return
    }

    // We don't have category ID easily if it fails, but wait, the API expects category ID!
    // But the slug is in the URL. We can modify the API `useRequestCategoryAccess` to accept slug instead of ID?
    // Let's use the slug to request access! The backend allows `:id` which is `categorySlugOrId` in my updated controller!
    requestAccess(slug, {
      onSuccess: () => {
        toast.success("Đã gửi yêu cầu thành công")
        setHasRequested(true)
      },
      onError: (err: any) => {
        toast.error(err.message || "Không thể gửi yêu cầu")
      }
    })
  }

  if (isLocked) {
    return (
      <main className="flex-1 w-full max-w-[2000px] mx-auto px-4 mt-4 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center max-w-2xl w-full text-center p-12 bg-surface-card border border-hairline rounded-[32px] shadow-sm">
          <div className="w-16 h-16 bg-surface-soft rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-mute" />
          </div>
          <h1 className="text-heading-sm font-bold text-ink mb-3">Danh mục đã bị khoá</h1>
          <p className="text-body-md text-mute mb-8">
            Đây là một danh mục riêng tư. Bạn cần được sự cho phép của tác giả để có thể xem các hình ảnh bên trong.
          </p>
          <Button 
            onClick={handleRequestAccess} 
            disabled={requesting || hasRequested}
            className="w-full rounded-full font-bold"
          >
            {hasRequested ? "Đang chờ phê duyệt..." : "Xin quyền truy cập"}
          </Button>
        </div>
      </main>
    )
  }

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
