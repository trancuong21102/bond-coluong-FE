"use client"
import { useGetMyImages, useDeleteImage, type ImageModel } from "@/store/api"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { Upload, Pencil, MoreHorizontal } from "lucide-react"

type StatusFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED"

export default function MyImagesPage() {
  const [filter, setFilter] = useState<StatusFilter>("ALL")
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const { data: response, isLoading, isError } = useGetMyImages()
  const { mutate: deleteImage, isPending: deleting } = useDeleteImage()

  const images = response?.data ?? []
  const filtered = filter === "ALL" ? images : images.filter((img: ImageModel) => img.status === filter)

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return
    deleteImage(id, {
      onSuccess: () => toast.success("Image deleted"),
      onError: () => toast.error("Failed to delete image"),
    })
  }

  const handleShare = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success("Image link copied to clipboard!")
  }

  const statusColor: Record<ImageModel["status"], string> = {
    APPROVED: "bg-success-pale text-success-deep",
    PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300",
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-heading-xl text-ink font-bold">My Images</h1>
        <Link href="/dashboard/upload">
          <Button variant="primary" className="bg-[#e60023] hover:bg-[#e60023]/80 font-semibold">Upload New</Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["ALL", "APPROVED", "PENDING", "REJECTED"] as StatusFilter[]).map(s => (
          <Button key={s} variant={filter === s ? "primary" : "secondary"} className="rounded-full" onClick={() => setFilter(s)}>
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-surface-card rounded-[16px] aspect-[3/4] animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-body-md text-mute text-center py-12">Could not load your images.</p>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="bg-surface-card rounded-[16px] p-12 text-center border border-hairline border-dashed">
          <p className="text-body-md text-mute">No images found.</p>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filtered.map((img: ImageModel) => (
            <div
              key={img.id}
              className="bg-surface-card rounded-[32px] overflow-hidden group relative aspect-[3/4] border border-hairline shadow-sm hover:shadow-md transition-all duration-300"
              onMouseLeave={() => {
                if (activeMenu === img.id) {
                  setActiveMenu(null)
                }
              }}
            >
              <Image
                src={img.imageUrl}
                alt={img.title}
                fill
                sizes="(max-width: 768px) calc((100vw - 3rem) / 2), (max-width: 1024px) calc((100vw - 18rem) / 2), 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Approval status badge - always visible at top left */}
              <div className={`absolute top-4 left-4 text-caption-sm px-3 py-1 rounded-full font-bold shadow-sm z-20 ${statusColor[img.status]}`}>
                {img.status.charAt(0) + img.status.slice(1).toLowerCase()}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-5 z-10">
                {/* Title at the top */}
                <div className="text-on-dark text-body-strong font-bold truncate mt-8 pr-2">
                  {img.title}
                </div>

                {/* Circular Action Buttons at the bottom */}
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => handleShare(img.imageUrl)}
                    className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-black shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    title="Copy Image URL"
                  >
                    <Upload className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toast.info("Edit feature coming soon!")}
                    className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-black shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    title="Edit Image"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === img.id ? null : img.id)}
                      className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-black shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
                      title="More options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {activeMenu === img.id && (
                      <>
                        <div
                          className="fixed inset-0 z-20 cursor-default"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveMenu(null)
                          }}
                        />
                        <div className="absolute bottom-11 right-0 bg-canvas border border-hairline rounded-[16px] shadow-lg p-1.5 z-30 min-w-[100px] animate-in fade-in slide-in-from-bottom-2 duration-150">
                          <button
                            onClick={() => {
                              handleDelete(img.id)
                              setActiveMenu(null)
                            }}
                            disabled={deleting}
                            className="w-full text-left text-body-sm-strong text-error hover:bg-surface-soft px-3 py-2 rounded-lg transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
