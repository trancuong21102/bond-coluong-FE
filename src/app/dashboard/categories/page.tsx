"use client"
import { useAdminGetAllCategories, useAdminCreateCategory, useAdminDeleteCategory, useAdminToggleCategoryPublic, URL_IMAGE } from "@/store/api"
import { useGetMyCategories, useCreateCategory, useDeleteCategory } from "@/store/api"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"
import useAuthStore from "@/lib/store/authStore"

function AdminCategories() {
  const { data: categories = [], isLoading, isError } = useAdminGetAllCategories()
  const { mutate: createCategory, isPending: creating } = useAdminCreateCategory()
  const { mutate: deleteCategory } = useAdminDeleteCategory()
  const { mutate: togglePublic } = useAdminToggleCategoryPublic()
  
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [isPublic, setIsPublic] = useState(true)

  const handleCreate = () => {
    if (!name.trim()) return
    createCategory({ name, description, isPublic, coverImage }, {
      onSuccess: () => {
        toast.success("Category created!")
        setShowForm(false)
        setName("")
        setDescription("")
        setCoverImage(null)
        setIsPublic(true)
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
        <h1 className="text-heading-xl text-ink font-bold">Manage All Categories</h1>
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
              className="w-full h-11 rounded-[16px] border border-ash bg-canvas px-4 text-body-md text-ink focus:outline-none focus:border-[#e60023]"
            />
          </div>
          <div>
            <label className="text-body-strong block mb-1">Description</label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional description"
              className="w-full h-11 rounded-[16px] border border-ash bg-canvas px-4 text-body-md text-ink focus:outline-none focus:border-[#e60023]"
            />
          </div>
          <div>
            <label className="text-body-strong block mb-2">Cover Image</label>
            <div className="relative border-2 border-dashed border-ash rounded-[16px] hover:border-[#e60023] transition-colors overflow-hidden bg-canvas h-48 flex items-center justify-center cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={e => setCoverImage(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {coverImage ? (
                <img 
                  src={URL.createObjectURL(coverImage)} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-surface-card group-hover:bg-[#e60023]/10 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mute group-hover:text-[#e60023] transition-colors"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  </div>
                  <p className="text-body-strong text-ink">Click or drag and drop</p>
                  <p className="text-caption-sm text-mute mt-1">SVG, PNG, JPG or GIF</p>
                </div>
              )}
            </div>
            {coverImage && (
              <button 
                type="button" 
                onClick={() => setCoverImage(null)} 
                className="mt-2 text-caption-md font-bold text-[#e60023] hover:underline"
              >
                Remove image
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPublic ? "bg-[#e60023]" : "bg-ash"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublic ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <div>
              <span className="text-body-strong block">{isPublic ? "Public" : "Private"}</span>
              <span className="text-caption-sm text-mute">
                {isPublic ? "Everyone can view images in this category" : "Requires approval to view"}
              </span>
            </div>
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
                <th className="p-4 text-body-sm-strong text-mute">Status</th>
                <th className="p-4 text-body-sm-strong text-mute">Pins</th>
                <th className="p-4 text-body-sm-strong text-mute">Visible</th>
                <th className="p-4 text-body-sm-strong text-mute">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-body-md text-mute">No categories yet.</td>
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
                  <td className="p-4">
                    <span className={`text-caption-sm font-bold px-2 py-1 rounded-full ${
                      cat.status === 'APPROVED' ? "bg-success-pale text-success-deep" :
                      cat.status === 'PENDING' ? "bg-amber-100 text-amber-800" : "bg-error text-white"
                    }`}>
                      {cat.status}
                    </span>
                  </td>
                  <td className="p-4 text-body-md text-mute">{cat.imageCount}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => togglePublic(cat.id)}
                      className={`text-caption-sm font-bold px-2 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${cat.isPublic ? "bg-success-pale text-success-deep" : "bg-surface-card text-ash"}`}
                    >
                      {cat.isPublic ? "Public" : "Private"}
                    </button>
                  </td>
                  <td className="p-4 flex gap-3">
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

function UserCategories() {
  const { data: response, isLoading, isError } = useGetMyCategories()
  const { mutate: createCategory, isPending: creating } = useCreateCategory()
  const { mutate: deleteCategory } = useDeleteCategory()
  
  const categories = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : [])
  
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [isPublic, setIsPublic] = useState(true)

  const handleCreate = () => {
    if (!name.trim()) return
    createCategory({ name, description, isPublic, coverImage }, {
      onSuccess: () => {
        toast.success("Category created and is pending approval!")
        setShowForm(false)
        setName("")
        setDescription("")
        setCoverImage(null)
        setIsPublic(true)
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
              className="w-full h-11 rounded-[16px] border border-ash bg-canvas px-4 text-body-md text-ink focus:outline-none focus:border-[#e60023]"
            />
          </div>
          <div>
            <label className="text-body-strong block mb-1">Description</label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional description"
              className="w-full h-11 rounded-[16px] border border-ash bg-canvas px-4 text-body-md text-ink focus:outline-none focus:border-[#e60023]"
            />
          </div>
          <div>
            <label className="text-body-strong block mb-2">Cover Image</label>
            <div className="relative border-2 border-dashed border-ash rounded-[16px] hover:border-[#e60023] transition-colors overflow-hidden bg-canvas h-48 flex items-center justify-center cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={e => setCoverImage(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {coverImage ? (
                <img 
                  src={URL.createObjectURL(coverImage)} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-surface-card group-hover:bg-[#e60023]/10 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mute group-hover:text-[#e60023] transition-colors"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  </div>
                  <p className="text-body-strong text-ink">Click or drag and drop</p>
                  <p className="text-caption-sm text-mute mt-1">SVG, PNG, JPG or GIF</p>
                </div>
              )}
            </div>
            {coverImage && (
              <button 
                type="button" 
                onClick={() => setCoverImage(null)} 
                className="mt-2 text-caption-md font-bold text-[#e60023] hover:underline"
              >
                Remove image
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPublic ? "bg-[#e60023]" : "bg-ash"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublic ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <div>
              <span className="text-body-strong block">{isPublic ? "Public" : "Private"}</span>
              <span className="text-caption-sm text-mute">
                {isPublic ? "Everyone can view images in this category" : "Requires approval to view"}
              </span>
            </div>
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
                <th className="p-4 text-body-sm-strong text-mute">Status</th>
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
                  <td className="p-4">
                    <span className={`text-caption-sm font-bold px-2 py-1 rounded-full ${
                      cat.status === 'APPROVED' ? "bg-success-pale text-success-deep" :
                      cat.status === 'PENDING' ? "bg-amber-100 text-amber-800" : "bg-error text-white"
                    }`}>
                      {cat.status}
                    </span>
                    {cat.rejectReason && (
                      <p className="text-caption-sm text-error mt-1">{cat.rejectReason}</p>
                    )}
                  </td>
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

export default function ManageCategoriesPage() {
  const user = useAuthStore(state => state.user)

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-body-md text-mute">Checking authorization...</p>
      </div>
    )
  }

  return user.role === "ADMIN" ? <AdminCategories /> : <UserCategories />
}
