"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Folder,
  Image as ImageIcon,
  Upload,
  LogOut,
  Sun,
  Moon,
  Bookmark,
  User as UserIcon,
  Menu,
} from "lucide-react"
import useAuthStore from "@/lib/store/authStore"
import { useRouter } from "next/navigation"
import { useTheme } from "@/lib/hooks/useTheme"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface SidebarContentProps {
  pathname: string
  sidebarLinks: Array<{ name: string; href: string; icon: React.ComponentType<any> }>
  isDark: boolean
  toggleTheme: () => void
  handleLogout: () => void
  onLinkClick?: () => void
}

function SidebarContent({
  pathname,
  sidebarLinks,
  isDark,
  toggleTheme,
  handleLogout,
  onLinkClick,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full justify-between">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-[16px] text-body-strong transition-colors",
                isActive
                  ? "bg-[#e60023] text-white hover:bg-[#cc001f]"
                  : "text-ink hover:bg-secondary-bg"
              )}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-hairline space-y-2">
        <button
          onClick={() => {
            toggleTheme()
            onLinkClick?.()
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-[16px] text-body-strong text-ink hover:bg-secondary-bg transition-colors cursor-pointer"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={() => {
            handleLogout()
            onLinkClick?.()
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-[16px] text-body-strong text-ink hover:bg-secondary-bg transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Log out
        </button>
      </div>
    </div>
  )
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const { isDark, toggleTheme } = useTheme()
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)

  const sidebarLinks = React.useMemo(() => {
    const links = [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    ]

    if (user?.role === "ADMIN") {
      links.push({
        name: "Manage Categories",
        href: "/dashboard/categories",
        icon: Folder,
      })
    }

    links.push(
      { name: "My Images", href: "/dashboard/images", icon: ImageIcon },
      { name: "Saved Images", href: "/dashboard/saved", icon: Bookmark },
      { name: "Upload Image", href: "/dashboard/upload", icon: Upload },
      { name: "Edit Profile", href: "/dashboard/profile", icon: UserIcon }
    )

    return links
  }, [user?.role])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <>
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-40 w-full h-16 bg-surface-card border-b border-hairline px-4 flex items-center justify-between md:hidden shrink-0">
        <div className="flex items-center gap-3">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  className="p-2 text-ink hover:bg-secondary-bg rounded-full transition-colors cursor-pointer"
                  aria-label="Open navigation menu"
                />
              }
            >
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-surface-card flex flex-col">
              <div className="h-16 flex items-center px-6 border-b border-hairline justify-between">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xl leading-none">
                    P
                  </div>
                  <span className="text-heading-md font-bold text-ink">Dashboard</span>
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarContent
                  pathname={pathname}
                  sidebarLinks={sidebarLinks}
                  isDark={isDark}
                  toggleTheme={toggleTheme}
                  handleLogout={handleLogout}
                  onLinkClick={() => setIsOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
          <span className="text-heading-md font-bold text-ink">Dashboard</span>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-surface-card border-r border-hairline min-h-screen flex flex-col hidden md:flex shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-hairline">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xl leading-none">
              P
            </div>
            <span className="text-heading-md font-bold text-ink">Dashboard</span>
          </Link>
        </div>

        <SidebarContent
          pathname={pathname}
          sidebarLinks={sidebarLinks}
          isDark={isDark}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
        />
      </aside>
    </>
  )
}
