"use client"
import { useGetPublicCategories, useUploadImage, type Category } from "@/store/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload, ChevronDown, AlertCircle, Loader2 } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import useAuthStore from "@/lib/store/authStore"

const uploadSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  categoryId: z.union([z.string(), z.number()]).refine((val) => val !== "" && val !== 0, "Please select a category"),
})

export default function UploadImagePage() {
  const router = useRouter()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const { data: response } = useGetPublicCategories()
  const user = useAuthStore((state) => state.user)
  const categories = response?.data ?? []
  
  const selectableCategories = categories.filter((cat: Category) => {
    if (cat.isPublic) return true;
    if (!user) return false;
    const isOwner = cat.createdById === user.id;
    const hasAccess = cat.accessList?.some(access => access.userId === user.id);
    return isOwner || hasAccess;
  })

  const { mutate: upload, isPending } = useUploadImage()

  const { register, handleSubmit, control, formState: { errors } } = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema)
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setPreviewUrl(URL.createObjectURL(f))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f && f.type.startsWith("image/")) {
      setFile(f)
      setPreviewUrl(URL.createObjectURL(f))
    } else {
      toast.error("Please drop a valid image file")
    }
  }

  const onSubmit = (data: z.infer<typeof uploadSchema>) => {
    if (!file) {
      toast.error("Please select an image to upload")
      return
    }

    upload({ image: file, title: data.title, description: data.description, categoryId: String(data.categoryId), isPublic: true }, {
      onSuccess: () => {
        toast.success("Image uploaded! Pending admin approval.")
        router.push("/dashboard/images")
      },
      onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Failed to upload image."),
    })
  }

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8">
      <h1 className="text-heading-xl font-bold bg-gradient-to-r from-ink to-ash bg-clip-text text-transparent mb-8">
        Create Pin
      </h1>

      <div className="bg-canvas rounded-[32px] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-hairline relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#e60023]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-10 relative z-10">
          {/* Left: Dropzone / Preview */}
          <div className="w-full lg:w-1/2">
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`bg-surface-soft rounded-[24px] aspect-[3/4] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${
                isDragging 
                  ? "border-2 border-dashed border-[#e60023] bg-[#e60023]/5 scale-[0.98]" 
                  : previewUrl 
                    ? "border-2 border-transparent shadow-md"
                    : "border-2 border-dashed border-ash hover:border-[#e60023]/50 hover:bg-surface-card"
              }`}
            >
              {previewUrl ? (
                <>
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer">
                      <div className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold py-3 px-6 rounded-full transition-colors flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        <span>Change Image</span>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                </>
              ) : (
                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-6 text-center group">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 ${isDragging ? "bg-[#e60023] text-white" : "bg-surface-card text-ash group-hover:bg-[#e60023]/10 group-hover:text-[#e60023]"}`}>
                    <Upload className="w-8 h-8" />
                  </div>
                  <p className="text-body-strong text-ink mb-2">Click or drag image to upload</p>
                  <p className="text-caption-md text-mute">We recommend using high quality .jpg files less than 20MB</p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          {/* Right: Form fields */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8">
            <div>
              <Input 
                type="text" 
                placeholder="Add a title" 
                {...register("title")} 
                className="text-[32px] font-bold h-auto py-4 border-none border-b-2 border-ash rounded-none bg-transparent px-0 focus:border-[#e60023] focus:ring-0 placeholder:text-ash hover:border-ink/50 transition-colors shadow-none" 
              />
              {errors.title && <p className="text-error text-caption-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4"/>{errors.title.message}</p>}
            </div>

            <div>
              <label className="text-body-strong mb-2 block text-ink">Description</label>
              <textarea
                className="w-full border-none border-b-2 border-ash bg-transparent px-0 py-3 text-body-md text-ink placeholder:text-mute focus:outline-none focus:border-[#e60023] hover:border-ink/50 transition-colors min-h-[100px] resize-none"
                placeholder="Tell everyone what your Pin is about"
                {...register("description")}
              />
            </div>

            <div>
              <label className="text-body-strong mb-2 block text-ink">Category</label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value ? String(field.value) : ""}>
                    <SelectTrigger className="w-full h-12 rounded-lg border border-ash bg-surface-card px-4 text-body-md focus:ring-0 focus:outline-none focus:border-[#e60023] hover:border-ink/50 transition-colors cursor-pointer shadow-none">
                      <span className="flex-1 text-left line-clamp-1">
                        {field.value ? (
                          <span className="text-ink">{selectableCategories.find((c: Category) => String(c.id) === String(field.value))?.name || "Select a category..."}</span>
                        ) : (
                          <span className="text-ash">Select a category...</span>
                        )}
                      </span>
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border border-ash shadow-xl bg-canvas z-[110]">
                      {selectableCategories.map((cat: Category) => (
                        <SelectItem key={cat.id} value={String(cat.id)} className="cursor-pointer focus:bg-surface-soft hover:bg-surface-soft py-2 px-3 rounded-md mb-1 last:mb-0 transition-colors">
                          {cat.name}
                          {!cat.isPublic && <span className="ml-2 text-mute text-xs">(Private)</span>}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && <p className="text-error text-caption-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4"/>{errors.categoryId.message}</p>}
            </div>

            <div className="mt-auto pt-8 border-t border-hairline flex justify-end gap-3">
              <Button type="button" variant="secondary" className="px-6 rounded-xl" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="px-8 rounded-xl shadow-lg shadow-[#e60023]/20" disabled={isPending}>
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                  </span>
                ) : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
