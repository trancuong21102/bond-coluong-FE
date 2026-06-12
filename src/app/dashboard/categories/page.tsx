"use client"
import { useGetMyCategories, useCreateCategory, useDeleteCategory, useUpdateCategory, URL_IMAGE } from "@/store/api"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

export default function MyCategoriesPage() {
  const { data: response, isLoading, isError } = useGetMyCategories()
  const categories = response?.data ?? []
  const { mutate: createCategory, isPending: creating } = useCreateCategory()
  const { mutate: deleteCategory } = useDeleteCategory()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)

  const handleCreate = () => {
    if (!name.trim()) return
    createCategory({ name, description, isPublic: true, coverImage }, {
      onSuccess: () => {
        toast.success("Category created!")
        setShowForm(false)
        setName("")
        setDescription("")
        setCoverImage(null)
      },
      onError: (err: any) => toast.error(err?.message || "Failed to create category"),
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm("Delete this category?")) return
    deleteCategory(id, {
      onSuccess: () => toast.success("Category deleted"),
      onError: () => toast.error("Failed to delete"),
    })
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-heading-xl text-ink font-bold">My Categories</h1>
        <Button variant="primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? "Cancel" : "Create Category"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-surface-card p-6 rounded-[16px] mb-6 space-y-4">
          <div>
            <label className="text-body-strong block mb-1">Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Category name"
              className="w-full h-11 rounded-[16px] border border-ash bg-canvas px-4 text-body-md text-ink focus:outline-none focus:ring-4 focus:ring-focus-outer"
            />
          </div>
          <div>
            <label className="text-body-strong block mb-1">Description</label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional description"
              className="w-full h-11 rounded-[16px] border border-ash bg-canvas px-4 text-body-md text-ink focus:outline-none focus:ring-4 focus:ring-focus-outer"
            />
          </div>
          <div>
            <label className="text-body-strong block mb-1">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setCoverImage(e.target.files?.[0] || null)}
              className="w-full text-body-md text-ink file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-body-sm-strong file:bg-surface-card file:text-ink hover:file:bg-secondary-pressed cursor-pointer"
            />
          </div>
          <div className="flex justify-end">
            <Button variant="primary" onClick={handleCreate} disabled={creating}>
              {creating ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 bg-surface-card rounded-[16px] animate-pulse" />
          ))}
        </div>
      )}

      {isError && <p className="text-body-md text-mute text-center py-12">Could not load categories.</p>}

      {!isLoading && !isError && (
        <div className="bg-canvas border border-hairline rounded-[16px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-card border-b border-hairline">
                <th className="p-4 text-body-sm-strong text-mute w-16">Cover</th>
                <th className="p-4 text-body-sm-strong text-mute">Name</th>
                <th className="p-4 text-body-sm-strong text-mute">Pins</th>
                <th className="p-4 text-body-sm-strong text-mute">Visible</th>
                <th className="p-4 text-body-sm-strong text-mute">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-body-md text-mute">No categories yet.</td>
                </tr>
              )}
              {categories.map((cat: any) => (
                <tr key={cat.id} className="border-b border-hairline last:border-0 hover:bg-surface-soft">
                  <td className="p-4">
                    {cat.coverImage ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-hairline bg-surface-soft">
                        <img
                          src={cat.coverImage.startsWith('http') ? cat.coverImage : `${URL_IMAGE}/${cat.coverImage}`}
                          alt={cat.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-surface-card border border-hairline flex items-center justify-center text-mute text-[10px]">
                        No Cover
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-body-strong">{cat.name}</td>
                  <td className="p-4 text-body-md text-mute">{cat.imageCount}</td>
                  <td className="p-4">
                    <span className={`text-caption-sm font-bold px-2 py-1 rounded-full ${cat.isPublic ? "bg-success-pale text-success-deep" : "bg-surface-card text-ash"}`}>
                      {cat.isPublic ? "Public" : "Private"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(cat.id)} className="text-body-sm font-bold text-error hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
