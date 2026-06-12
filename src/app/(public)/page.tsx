"use client"
import * as React from "react"
import { useGetPublicCategories, useGetPublicImages, URL_IMAGE, type Category, type ImageModel } from "@/store/api"
import Link from "next/link"
import Image from "next/image"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import MasonryGrid from "@/components/ui/grid"
import { ImageCard } from "@/components/pinterest/ImageCard"
import useAuthStore from "@/lib/store/authStore"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  const handleCategoryClick = (e: React.MouseEvent, isPublic: boolean) => {
    if (!isPublic && !isAuthenticated) {
      e.preventDefault()
      toast.error("Vui lòng đăng nhập để xem danh mục riêng tư")
      router.push("/login")
    }
  }

  // Fetch categories
  const { data: response, isLoading, isError } = useGetPublicCategories()
  const categories = response?.data ?? []

  // Fetch latest public images
  const { data: imagesResponse, isLoading: loadingImgs, isError: errorImgs } = useGetPublicImages({ page: 1, limit: 30 })
  const images = imagesResponse?.data?.images ?? []

  // State to handle "Xem thêm" expansion
  const [gridLimit, setGridLimit] = React.useState(10)

  // Curated high-quality cover images based on category slug if null in backend
  const getCategoryCover = (cat: Category) => {
    if (cat.coverImage) {
      return cat.coverImage.startsWith('http') ? cat.coverImage : `${URL_IMAGE}/${cat.coverImage}`
    }
    const slug = cat.slug?.toLowerCase() || ""
    if (slug.includes("nature") || slug.includes("thien-nhien")) {
      return "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&auto=format&fit=crop"
    }
    if (slug.includes("pet") || slug.includes("thu-cung") || slug.includes("animal")) {
      return "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop"
    }
    if (slug.includes("phone") || slug.includes("dien-thoai") || slug.includes("tech")) {
      return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop"
    }
    if (slug.includes("food") || slug.includes("an-uong")) {
      return "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop"
    }
    if (slug.includes("art") || slug.includes("nghe-thuat")) {
      return "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop"
    }
    if (slug.includes("decor") || slug.includes("noi-that")) {
      return "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop"
    }
    if (slug.includes("fashion") || slug.includes("thoi-trang")) {
      return "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop"
    }
    if (slug.includes("beauty") || slug.includes("lam-dep")) {
      return "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop"
    }
    if (slug.includes("quote") || slug.includes("cham-ngon")) {
      return "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&auto=format&fit=crop"
    }
    if (slug.includes("diy") || slug.includes("thu-cong")) {
      return "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop"
    }
    return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop"
  }
console.log(images,'images')
  return (
    <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 mt-8 pb-16">
      {/* 2. Grid Section ("Duyệt theo danh mục") */}
      <div className="mt-4 sm:mt-16">
        <h2 className="text-heading-xl text-ink font-bold mb-8 text-left">
          Duyệt theo danh mục
        </h2>

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-surface-card rounded-[24px] aspect-[1.8/1] animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.slice(0, gridLimit).map((cat: Category) => {
                const cover = getCategoryCover(cat)
                return (
                  <Link 
                    key={cat.id} 
                    href={`/categories/${cat.slug}`} 
                    onClick={(e) => handleCategoryClick(e, cat.isPublic)}
                    className="group relative block rounded-[24px] overflow-hidden aspect-[1.8/1] shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <Image
                      src={cover}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) calc((100vw - 3rem) / 2), (max-width: 768px) calc((100vw - 4rem) / 3), (max-width: 1024px) calc((100vw - 5rem) / 4), 20vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Centered Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        {!cat.isPublic && (
                          <Lock className="w-5 h-5 text-white/80" />
                        )}
                        <span className="text-on-dark text-body-strong font-bold text-center px-4 transition-transform group-hover:scale-105 duration-200">
                          {cat.name}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {categories.length > gridLimit && (
              <div className="flex justify-center mt-8">
                <Button 
                  variant="secondary" 
                  className="rounded-full px-6 py-2 bg-surface-card hover:bg-secondary-pressed text-ink font-bold transition-colors"
                  onClick={() => setGridLimit(prev => prev + 10)}
                >
                  Xem thêm
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 3. Photos Feed Section ("Xem có gì mới trên Pinterest") */}
      <div className="mt-16 border-t border-hairline pt-12">
        <h2 className="text-heading-xl text-ink font-bold mb-8 text-left">
          Xem có gì mới trên Pinterest
        </h2>

        {loadingImgs && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-surface-card rounded-[16px] animate-pulse" style={{ height: `${200 + (i % 3) * 80}px` }} />
            ))}
          </div>
        )}

        {errorImgs && (
          <p className="text-center text-body-md text-mute py-12">Không thể tải hình ảnh mới.</p>
        )}

        {!loadingImgs && !errorImgs && images.length === 0 && (
          <p className="text-center text-body-md text-mute py-12">Chưa có hình ảnh nào mới.</p>
        )}

        {!loadingImgs && !errorImgs && images.length > 0 && (
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
                authorAvatar={img.uploadedBy?.avatar ?? undefined}
                authorName={img.uploadedBy?.name}
                width={img.width ?? 800}
                height={img.height ?? 600}
              />
            )}
          />
        )}
      </div>

    </main>
  )
}
