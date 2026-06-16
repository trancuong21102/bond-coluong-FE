"use client"
import { useAdminGetAllCategories, useAdminCreateCategory, useAdminDeleteCategory, useAdminToggleCategoryPublic, URL_IMAGE } from "@/store/api"
import { useGetMyCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from "@/store/api"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import useAuthStore from "@/lib/store/authStore"
import { Pencil, Trash2, Loader2 } from "lucide-react"

function CategoryVisibilityToggle({ isPublic: initialIsPublic, onToggle }: { isPublic: boolean, onToggle: (newVal: boolean, onSuccess: () => void, onError: () => void) => void }) {
  const [isPublic, setIsPublic] = useState(initialIsPublic)

  useEffect(() => {
    setIsPublic(initialIsPublic)
  }, [initialIsPublic])

  const handleToggle = () => {
    const newValue = !isPublic
    setIsPublic(newValue)

    onToggle(
      newValue, 
      () => {}, 
      () => {
        setIsPublic(!newValue)
      }
    )
  }

  return (
    <button 
      onClick={handleToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${isPublic ? "bg-[#e60023]" : "bg-ash"}`}
      title={isPublic ? "Switch to Private" : "Switch to Public"}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublic ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  )
}

function AdminCategories() {
  const { data: categories = [], isLoading, isError } = useAdminGetAllCategories()
  const { mutate: createCategory, isPending: creating } = useAdminCreateCategory()
  const { mutate: deleteCategory, isPending: isDeleting } = useAdminDeleteCategory()
  const { mutate: togglePublic } = useAdminToggleCategoryPublic()
  
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
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

  const handleDelete = (id: string) => setDeletingId(id)

  const executeDelete = () => {
    if (!deletingId) return
    deleteCategory(deletingId, {
      onSuccess: () => {
        toast.success("Category deleted")
        setDeletingId(null)
      },
      onError: () => toast.error("Failed to delete"),
    })
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-heading-xl text-ink font-bold">Manage All Categories</h1>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Create Category
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-canvas max-w-2xl w-full rounded-[24px] p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-heading-sm text-ink font-bold">Create Category</h2>
              <button onClick={() => setShowForm(false)} className="text-ash hover:bg-surface-soft p-2 rounded-full transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="space-y-4">
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
                <div className="relative border-2 border-dashed border-ash rounded-[16px] hover:border-[#e60023] transition-colors overflow-hidden bg-surface-soft h-48 flex items-center justify-center cursor-pointer group">
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
              <div className="flex justify-end gap-3 pt-4 border-t border-hairline mt-6">
                <Button variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleCreate} disabled={creating}>
                  {creating ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
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
        <div className="bg-canvas sm:border sm:border-hairline sm:rounded-[16px] sm:overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden sm:block">
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
                      <div className="flex items-center gap-2">
                        <CategoryVisibilityToggle 
                          isPublic={cat.isPublic} 
                          onToggle={(newVal, onSuccess, onError) => {
                            togglePublic(cat.id, {
                              onSuccess: () => {
                                toast.success("Visibility updated")
                                onSuccess()
                              },
                              onError: () => {
                                toast.error("Failed to update visibility")
                                onError()
                              }
                            })
                          }} 
                        />
                      </div>
                    </td>
                    <td className="p-4 flex gap-2">
                      <Button variant="tertiary" size="icon" onClick={() => handleDelete(cat.id)} className="text-error hover:bg-error/10 hover:text-error h-8 w-8" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="block sm:hidden space-y-4 mt-4">
            {categories.length === 0 && (
              <div className="p-8 text-center text-body-md text-mute border border-hairline rounded-[16px]">No categories yet.</div>
            )}
            {categories.map((cat: any) => (
              <div key={cat.id} className="bg-surface-card border border-hairline rounded-[16px] p-4 flex flex-col gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                  {cat.coverImage ? (
                    <img src={cat.coverImage.startsWith('http') ? cat.coverImage : `${URL_IMAGE}/${cat.coverImage}`} alt={cat.name} className="w-16 h-16 rounded-lg object-cover bg-surface-soft border border-hairline" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-surface-card border border-hairline flex items-center justify-center text-mute text-[10px]">No Cover</div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-body-strong text-ink">{cat.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-caption-sm font-bold px-2 py-1 rounded-full ${cat.status === 'APPROVED' ? "bg-success-pale text-success-deep" : cat.status === 'PENDING' ? "bg-amber-100 text-amber-800" : "bg-error text-white"}`}>
                        {cat.status}
                      </span>
                      <span className="text-caption-sm text-mute">{cat.imageCount} pins</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-hairline pt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-caption-sm text-mute font-medium">Visible</span>
                    <CategoryVisibilityToggle 
                      isPublic={cat.isPublic} 
                      onToggle={(newVal, onSuccess, onError) => {
                        togglePublic(cat.id, {
                          onSuccess: () => {
                            toast.success("Visibility updated")
                            onSuccess()
                          },
                          onError: () => {
                            toast.error("Failed to update visibility")
                            onError()
                          }
                        })
                      }} 
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="tertiary" size="icon" onClick={() => handleDelete(cat.id)} className="text-error hover:bg-error/10 hover:text-error h-8 w-8" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-canvas max-w-2xl w-full rounded-[24px] p-6 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-heading-sm font-bold text-ink mb-2">Delete Category</h3>
            <p className="text-body-md text-mute mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => setDeletingId(null)}>Cancel</Button>
              <Button variant="primary" onClick={executeDelete} disabled={isDeleting} className="bg-error hover:bg-error/90 border-error">
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function UserCategories() {
  const { data: response, isLoading, isError } = useGetMyCategories()
  const { mutate: createCategory, isPending: creating } = useCreateCategory()
  const { mutate: updateCategory, isPending: updating } = useUpdateCategory()
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory()
  
  const categories = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : [])
  
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [existingCoverImage, setExistingCoverImage] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState(true)

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setName("")
    setDescription("")
    setCoverImage(null)
    setExistingCoverImage(null)
    setIsPublic(true)
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    
    if (editingId) {
      updateCategory({ id: editingId, data: { name, description, isPublic, coverImage } }, {
        onSuccess: () => {
          toast.success("Category updated!")
          resetForm()
        },
        onError: (err: any) => toast.error(err?.message || "Failed to update category"),
      })
    } else {
      createCategory({ name, description, isPublic, coverImage }, {
        onSuccess: () => {
          toast.success("Category created and is pending approval!")
          resetForm()
        },
        onError: (err: any) => toast.error(err?.message || "Failed to create category"),
      })
    }
  }

  const handleEdit = (cat: any) => {
    setEditingId(cat.id)
    setName(cat.name)
    setDescription(cat.description || "")
    setCoverImage(null)
    setExistingCoverImage(cat.coverImage || null)
    setIsPublic(cat.isPublic)
    setShowForm(true)
  }

  const handleDelete = (id: string) => setDeletingId(id)

  const executeDelete = () => {
    if (!deletingId) return
    deleteCategory(deletingId, {
      onSuccess: () => {
        toast.success("Category deleted")
        setDeletingId(null)
      },
      onError: () => toast.error("Failed to delete"),
    })
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-heading-xl text-ink font-bold">My Categories</h1>
        <Button variant="primary" onClick={() => {
          resetForm()
          setShowForm(true)
        }}>
          Create Category
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-canvas max-w-2xl w-full rounded-[24px] p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-heading-sm text-ink font-bold">{editingId ? "Edit Category" : "Create Category"}</h2>
              <button onClick={resetForm} className="text-ash hover:bg-surface-soft p-2 rounded-full transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="space-y-4">
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
                <div className="relative border-2 border-dashed border-ash rounded-[16px] hover:border-[#e60023] transition-colors overflow-hidden bg-surface-soft h-48 flex items-center justify-center cursor-pointer group">
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
                  ) : existingCoverImage ? (
                    <img 
                      src={existingCoverImage.startsWith('http') ? existingCoverImage : `${URL_IMAGE}/${existingCoverImage}`} 
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
                {(coverImage || existingCoverImage) && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setCoverImage(null)
                      setExistingCoverImage(null)
                    }} 
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
              <div className="flex justify-end gap-3 pt-4 border-t border-hairline mt-6">
                <Button variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={creating || updating}>
                  {creating || updating ? "Saving..." : (editingId ? "Update" : "Save")}
                </Button>
              </div>
            </div>
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
        <div className="bg-canvas sm:border sm:border-hairline sm:rounded-[16px] sm:overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden sm:block">
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
                      <div className="flex items-center gap-2">
                        <CategoryVisibilityToggle 
                          isPublic={cat.isPublic} 
                          onToggle={(newVal, onSuccess, onError) => {
                            updateCategory({ id: cat.id, data: { isPublic: newVal } }, {
                              onSuccess: () => {
                                toast.success("Visibility updated")
                                onSuccess()
                              },
                              onError: () => {
                                toast.error("Failed to update visibility")
                                onError()
                              }
                            })
                          }} 
                        />
                      </div>
                    </td>
                    <td className="p-4 flex gap-2">
                      <Button variant="tertiary" size="icon" onClick={() => handleEdit(cat)} className="text-ink h-8 w-8" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="tertiary" size="icon" onClick={() => handleDelete(cat.id)} className="text-error hover:bg-error/10 hover:text-error h-8 w-8" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="block sm:hidden space-y-4 mt-4">
            {categories.length === 0 && (
              <div className="p-8 text-center text-body-md text-mute border border-hairline rounded-[16px]">No categories yet.</div>
            )}
            {categories.map((cat: any) => (
              <div key={cat.id} className="bg-surface-card border border-hairline rounded-[16px] p-4 flex flex-col gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                  {cat.coverImage ? (
                    <img src={cat.coverImage.startsWith('http') ? cat.coverImage : `${URL_IMAGE}/${cat.coverImage}`} alt={cat.name} className="w-16 h-16 rounded-lg object-cover bg-surface-soft border border-hairline" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-surface-card border border-hairline flex items-center justify-center text-mute text-[10px]">No Cover</div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-body-strong text-ink">{cat.name}</h3>
                    <div className="flex flex-col gap-1 mt-2">
                      <span className={`w-max text-caption-sm font-bold px-2 py-1 rounded-full ${cat.status === 'APPROVED' ? "bg-success-pale text-success-deep" : cat.status === 'PENDING' ? "bg-amber-100 text-amber-800" : "bg-error text-white"}`}>
                        {cat.status}
                      </span>
                      {cat.rejectReason && (
                        <p className="text-caption-sm text-error">{cat.rejectReason}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-hairline pt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-caption-sm text-mute font-medium">Visible</span>
                    <CategoryVisibilityToggle 
                      isPublic={cat.isPublic} 
                      onToggle={(newVal, onSuccess, onError) => {
                        updateCategory({ id: cat.id, data: { isPublic: newVal } }, {
                          onSuccess: () => {
                            toast.success("Visibility updated")
                            onSuccess()
                          },
                          onError: () => {
                            toast.error("Failed to update visibility")
                            onError()
                          }
                        })
                      }} 
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="tertiary" size="icon" onClick={() => handleEdit(cat)} className="text-ink h-8 w-8" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="tertiary" size="icon" onClick={() => handleDelete(cat.id)} className="text-error hover:bg-error/10 hover:text-error h-8 w-8" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-canvas max-w-2xl w-full rounded-[24px] p-6 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-heading-sm font-bold text-ink mb-2">Delete Category</h3>
            <p className="text-body-md text-mute mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => setDeletingId(null)}>Cancel</Button>
              <Button variant="primary" onClick={executeDelete} disabled={isDeleting} className="bg-error hover:bg-error/90 border-error">
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
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
