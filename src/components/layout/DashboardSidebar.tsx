"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Folder, Image as ImageIcon, Upload, LogOut } from "lucide-react"
import useAuthStore from "@/lib/store/authStore"
import { useRouter } from "next/navigation"

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Categories", href: "/dashboard/categories", icon: Folder },
  { name: "My Images", href: "/dashboard/images", icon: ImageIcon },
  { name: "Upload Image", href: "/dashboard/upload", icon: Upload },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const logout = useAuthStore(state => state.logout)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <aside className="w-64 bg-surface-card border-r border-hairline min-h-screen flex flex-col hidden md:flex">
      <div className="h-20 flex items-center px-6 border-b border-hairline">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xl leading-none">
            P
          </div>
          <span className="text-heading-md font-bold text-ink">Dashboard</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-[16px] text-body-strong transition-colors",
                isActive 
                  ? "bg-ink text-on-dark hover:bg-ink-soft" 
                  : "text-ink hover:bg-secondary-bg"
              )}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-hairline">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-[16px] text-body-strong text-ink hover:bg-secondary-bg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Log out
        </button>
      </div>
    </aside>
  )
}
