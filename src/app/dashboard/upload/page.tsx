"use client"
import { useGetMyCategories, useUploadImage, type Category } from "@/store/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"

const uploadSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Please select a category"),
})

export default function UploadImagePage() {
  const router = useRouter()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const { data: response } = useGetMyCategories()
  const categories = response?.data ?? []
  const { mutate: upload, isPending } = useUploadImage()

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema)
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setPreviewUrl(URL.createObjectURL(f))
    }
  }

  const onSubmit = (data: z.infer<typeof uploadSchema>) => {
    if (!file) {
      toast.error("Please select an image to upload")
      return
    }

    upload({ image: file, title: data.title, description: data.description, categoryId: data.categoryId, isPublic: true }, {
      onSuccess: () => {
        toast.success("Image uploaded! Pending admin approval.")
        router.push("/dashboard/images")
      },
      onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Failed to upload image."),
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-heading-xl text-ink font-bold mb-8">Upload Image</h1>

      <div className="bg-canvas rounded-[32px] p-8 shadow-[0_16px_32px_rgba(0,0,0,0.05)]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-8">
          {/* Left: Dropzone / Preview */}
          <div className="w-full md:w-1/2">
            <div className="bg-surface-card rounded-[16px] aspect-[3/4] flex flex-col items-center justify-center relative overflow-hidden border-2 border-dashed border-hairline hover:border-ash transition-colors">
              {previewUrl ? (
                <>
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    sizes="(max-width: 768px) calc(100vw - 4rem), 384px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer">
                      <Button variant="primary" asChild><span>Change Image</span></Button>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                </>
              ) : (
                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="w-8 h-8 text-ash mb-4" />
                  <p className="text-body-strong text-ink mb-2">Click or drag image to upload</p>
                  <p className="text-body-sm text-mute">JPG, PNG, WebP — max 5MB</p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          {/* Right: Form fields */}
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <div>
              <label className="text-body-strong mb-1 block text-ink">Title</label>
              <Input type="text" placeholder="Add a title" {...register("title")} className="text-heading-lg h-14" />
              {errors.title && <p className="text-error text-caption-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="text-body-strong mb-1 block text-ink">Description</label>
              <textarea
                className="w-full rounded-[16px] border border-ash bg-canvas px-4 py-3 text-body-md text-ink placeholder:text-ash focus:outline-none focus:ring-4 focus:ring-focus-outer min-h-[120px] resize-none"
                placeholder="Tell everyone what your Pin is about"
                {...register("description")}
              />
            </div>

            <div>
              <label className="text-body-strong mb-1 block text-ink">Category</label>
              <select
                className="w-full h-11 rounded-[16px] border border-ash bg-canvas px-4 text-body-md text-ink focus:outline-none focus:ring-4 focus:ring-focus-outer"
                {...register("categoryId")}
              >
                <option value="">Select a category</option>
                {categories.map((cat: Category) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-error text-caption-sm mt-1">{errors.categoryId.message}</p>}
            </div>

            <div className="mt-auto pt-6 flex justify-end">
              <Button type="submit" variant="primary" className="px-8" disabled={isPending}>
                {isPending ? "Uploading..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
