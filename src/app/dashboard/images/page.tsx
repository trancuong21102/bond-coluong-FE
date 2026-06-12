"use client"
import { useGetMyImages, useDeleteImage, type ImageModel } from "@/store/api"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

type StatusFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED"

export default function MyImagesPage() {
  const [filter, setFilter] = useState<StatusFilter>("ALL")
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

  const statusColor: Record<ImageModel["status"], string> = {
    APPROVED: "bg-success-pale text-success-deep",
    PENDING: "bg-[#fff3cd] text-[#856404]",
    REJECTED: "bg-[#ffebee] text-error",
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-heading-xl text-ink font-bold">My Images</h1>
        <Link href="/dashboard/upload">
          <Button variant="primary">Upload New</Button>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((img: ImageModel) => (
            <div key={img.id} className="bg-surface-card rounded-[16px] overflow-hidden group relative">
              <div className="aspect-[3/4] relative">
                <Image
                  src={img.imageUrl}
                  alt={img.title}
                  fill
                  sizes="(max-width: 768px) calc((100vw - 3rem) / 2), (max-width: 1024px) calc((100vw - 18rem) / 2), 25vw"
                  className="object-cover"
                />
                <div className={`absolute top-2 left-2 text-caption-sm px-2 py-1 rounded-full font-bold ${statusColor[img.status]}`}>
                  {img.status}
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-body-strong truncate">{img.title}</h3>
                <button
                  onClick={() => handleDelete(img.id)}
                  disabled={deleting}
                  className="text-caption-sm text-error hover:underline mt-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
