"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Check, ChevronDown, Sun, Moon, LayoutDashboard, User, LogOut } from "lucide-react"
import { SearchBar } from "@/components/pinterest/SearchBar"
import { Button } from "@/components/ui/button"
import useAuthStore from "@/lib/store/authStore"
import { cn } from "@/lib/utils"
import { useTheme } from "@/lib/hooks/useTheme"

function UserAvatar({
  name,
  avatar,
  className,
}: {
  name?: string | null
  avatar?: string | null
  className?: string
}) {
  const initial = name?.trim().charAt(0).toUpperCase() || "U"

  return (
    <div className={cn("relative overflow-hidden rounded-full bg-[#0b8f7e] text-white", className)}>
      {avatar ? (
        <Image src={avatar} alt={name || "User"} fill sizes="56px" className="object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-semibold leading-none">
          {initial}
        </span>
      )}
    </div>
  )
}

export function PublicHeader() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { isDark, toggleTheme } = useTheme()
  const [isAccountOpen, setIsAccountOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!isAccountOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsAccountOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAccountOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isAccountOpen])

  const handleLogout = () => {
    logout()
    setIsAccountOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-canvas px-4 h-20 flex items-center gap-4">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl leading-none">
          P
        </div>
      </Link>
      
      <div className="hidden sm:flex ml-2">
        <Link href="/">
          <Button variant="tertiary" className="text-body-strong">Explore</Button>
        </Link>
      </div>

      <div className="flex-1 mx-2">
        <SearchBar placeholder="Search for ideas..." />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="rounded-full p-2 text-ink transition-colors hover:bg-surface-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-outer cursor-pointer"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {mounted && isAuthenticated ? (
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsAccountOpen((open) => !open)}
              className="flex items-center gap-1 rounded-full p-1 text-ink transition-colors hover:bg-surface-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-outer focus-visible:ring-offset-2 focus-visible:ring-offset-focus-inner"
              aria-expanded={isAccountOpen}
              aria-haspopup="menu"
              aria-label="Account menu"
            >
              <UserAvatar name={user?.name} avatar={user?.avatar} className="h-9 w-9 border-2 border-ink text-lg ring-2 ring-canvas" />
              <ChevronDown className={cn("h-4 w-4 transition-transform", isAccountOpen && "rotate-180")} aria-hidden="true" />
            </button>

            {isAccountOpen && (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+8px)] w-[min(calc(100vw-2rem),360px)] rounded-[18px] bg-canvas p-3.5 shadow-[0_12px_30px_rgba(0,0,0,0.15)] ring-1 ring-black/5"
              >
                <p className="mb-3 text-caption-md text-mute">Đang đăng nhập</p>

                <div className="flex items-center gap-2.5">
                  <UserAvatar name={user?.name} avatar={user?.avatar} className="h-12 w-12 shrink-0 text-[26px]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-strong font-bold text-ink">{user?.name || "Người dùng"}</p>
                    <p className="text-body-sm text-mute">Cá nhân</p>
                    <p className="truncate text-body-sm text-mute">{user?.email}</p>
                  </div>
                  <Check className="h-5 w-5 shrink-0 text-ink" aria-hidden="true" />
                </div>

                <p className="mt-5 text-caption-md text-mute">Tài khoản của bạn</p>

                <div className="flex flex-col gap-4 mt-3">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex w-full items-center gap-2 text-left text-body-strong font-bold text-ink transition-colors hover:text-primary"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Trang quản trị</span>
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex w-full items-center gap-2 text-left text-body-strong font-bold text-ink transition-colors hover:text-primary"
                  >
                    <User className="h-4 w-4" />
                    <span>Chỉnh sửa hồ sơ</span>
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 flex w-full items-center gap-2 text-left text-body-strong font-bold text-ink transition-colors hover:text-primary cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login">
              <Button variant="primary" className="hidden sm:flex bg-[#e60023]">Log in</Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary">Sign up</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
