"use client"
import { useGetMyImages } from "@/store/api"
import { useGetMyCategories } from "@/store/api"
import useAuthStore from "@/lib/store/authStore"
import Link from "next/link"
import { Upload } from "lucide-react"

export default function DashboardOverviewPage() {
  const user = useAuthStore(state => state.user)
  const { data: imagesResponse, isLoading: loadingImgs } = useGetMyImages()
  const { data: categoriesResponse, isLoading: loadingCats } = useGetMyCategories()

  const images = imagesResponse?.data ?? []
  const categories = categoriesResponse?.data ?? []

  const approved = images.filter((img: any) => img.status === "APPROVED").length
  const pending = images.filter((img: any) => img.status === "PENDING").length

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-heading-xl text-ink font-bold mb-2">
        Welcome back{user?.name ? `, ${user.name}` : ""}!
      </h1>
      <p className="text-body-md text-mute mb-8">Here's a summary of your activity.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-surface-card p-6 rounded-[16px]">
          <p className="text-body-strong text-mute mb-2">My Categories</p>
          <p className="text-display-lg text-ink">{loadingCats ? "—" : categories.length}</p>
        </div>
        <div className="bg-surface-card p-6 rounded-[16px]">
          <p className="text-body-strong text-mute mb-2">Total Images</p>
          <p className="text-display-lg text-ink">{loadingImgs ? "—" : images.length}</p>
        </div>
        <div className="bg-surface-card p-6 rounded-[16px]">
          <p className="text-body-strong text-mute mb-2">Pending Approval</p>
          <p className="text-display-lg text-primary font-bold">{loadingImgs ? "—" : pending}</p>
        </div>
        <div className="bg-surface-card p-6 rounded-[16px]">
          <p className="text-body-strong text-mute mb-2">Approved</p>
          <p className="text-display-lg text-ink">{loadingImgs ? "—" : approved}</p>
        </div>
      </div>

      <h2 className="text-heading-lg text-ink font-bold mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/dashboard/upload" className="flex items-center gap-4 p-6 bg-surface-card rounded-[16px] hover:bg-secondary-pressed transition-colors group">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary group-hover:scale-105 transition-transform">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <p className="text-body-strong text-ink">Upload Image</p>
            <p className="text-body-sm text-mute">Share a new photo</p>
          </div>
        </Link>
        <Link href="/dashboard/categories" className="flex items-center gap-4 p-6 bg-surface-card rounded-[16px] hover:bg-secondary-pressed transition-colors group">
          <div className="w-12 h-12 rounded-full bg-surface-soft flex items-center justify-center text-ink group-hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div>
            <p className="text-body-strong text-ink">Manage Categories</p>
            <p className="text-body-sm text-mute">Organise your collections</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
