"use client"
import * as React from "react"
import { useGetPublicCategories, URL_IMAGE, type Category } from "@/store/api"
import Link from "next/link"
import Image from "next/image"
import { Lock, ArrowLeft } from "lucide-react"
import useAuthStore from "@/lib/store/authStore"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function CategoriesPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  // Fetch categories
  const { data: response, isLoading, isError } = useGetPublicCategories()
  const categories = response?.data ?? []

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
    if (slug.includes("diy") || slug.includes("thu-cong")) {
      return "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop"
    }
    return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop"
  }

  const handleCategoryClick = (e: React.MouseEvent, isPublic: boolean) => {
    if (!isPublic && !isAuthenticated) {
      e.preventDefault()
      toast.error("Vui lòng đăng nhập để xem danh mục riêng tư")
      router.push("/login")
    }
  }

  return (
    <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 mt-8 pb-16">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="secondary" 
          className="w-10 h-10 p-0 rounded-full bg-surface-card hover:bg-secondary-pressed border-hairline border"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5 text-ink" />
        </Button>
        <h1 className="text-heading-xl text-ink font-bold">Tất cả danh mục</h1>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="bg-surface-card rounded-[24px] aspect-[1.8/1] animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-body-md text-mute text-center py-12">Không thể tải danh mục. Vui lòng thử lại sau.</p>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat: Category) => {
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
      )}
    </main>
  )
}
