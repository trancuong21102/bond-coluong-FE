"use client"
import * as React from "react"
import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Check, ChevronDown, Sun, Moon, LayoutDashboard, User, LogOut, Search } from "lucide-react"
import { SearchBar } from "@/components/pinterest/SearchBar"
import { Button } from "@/components/ui/button"
import useAuthStore from "@/lib/store/authStore"
import { cn } from "@/lib/utils"
import { useTheme } from "@/lib/hooks/useTheme"
import { useRouter, useSearchParams } from "next/navigation"
import { useGetSearchSuggestions } from "@/store/api"

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

function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchVal, setSearchVal] = React.useState("")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [debouncedSearchVal, setDebouncedSearchVal] = React.useState("")
  const [showDropdown, setShowDropdown] = React.useState(false)
  const desktopInputRef = React.useRef<HTMLInputElement>(null)
  const mobileInputRef = React.useRef<HTMLInputElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const mobileContainerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setSearchVal(searchParams.get("search") || "")
  }, [searchParams])

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchVal(searchVal)
    }, 200)
    return () => clearTimeout(handler)
  }, [searchVal])

  const { data: suggestionsResponse, isLoading: loadingSuggestions } = useGetSearchSuggestions(debouncedSearchVal)
  const suggestions = suggestionsResponse?.data

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedElement = event.target as Node
      const isInsideDesktop = dropdownRef.current?.contains(clickedElement)
      const isInsideMobile = mobileContainerRef.current?.contains(clickedElement)
      if (!isInsideDesktop && !isInsideMobile) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const triggerSearch = (val: string) => {
    const trimmed = val.trim()
    if (trimmed) {
      router.push(`/?search=${encodeURIComponent(trimmed)}`)
    } else {
      router.push("/")
    }
    setIsModalOpen(false)
    setShowDropdown(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    triggerSearch(searchVal)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      triggerSearch(searchVal)
    }
  }

  const handleClear = () => {
    setSearchVal("")
    if (searchParams.get("search")) {
      router.push("/")
    }
    setTimeout(() => {
      if (isModalOpen) {
        mobileInputRef.current?.focus()
      } else {
        desktopInputRef.current?.focus()
      }
    }, 50)
  }

  React.useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => mobileInputRef.current?.focus(), 80)
      return () => clearTimeout(timer)
    }
  }, [isModalOpen])

  return (
    <>
      {/* Desktop Search Input */}
      <div className="hidden sm:block w-full relative" ref={dropdownRef}>
        <form onSubmit={handleSearchSubmit} className="w-full">
          <SearchBar
            ref={desktopInputRef}
            placeholder="Search for ideas..."
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            onClear={handleClear}
          />
          <button type="submit" className="hidden" />
        </form>

        {/* Suggestions Dropdown */}
        {showDropdown && debouncedSearchVal.trim().length > 0 && suggestions && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-canvas rounded-[24px] shadow-[0_12px_30px_rgba(0,0,0,0.15)] ring-1 ring-black/5 p-4 z-50 max-h-[400px] overflow-y-auto">
            {loadingSuggestions && (
              <div className="text-body-sm text-mute text-center py-2">Loading suggestions...</div>
            )}
            {!loadingSuggestions && 
              suggestions.categories.length === 0 && 
              suggestions.images.length === 0 && 
              suggestions.users.length === 0 && (
                <div className="text-body-sm text-mute text-center py-2">No ideas found for "{debouncedSearchVal}"</div>
            )}
            
            {!loadingSuggestions && (
              <div className="space-y-4">
                {/* Categories */}
                {suggestions.categories.length > 0 && (
                  <div>
                    <h4 className="text-caption-md text-mute font-bold px-3 mb-1 uppercase tracking-wider">Chủ đề</h4>
                    <div className="space-y-0.5">
                      {suggestions.categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/categories/${cat.slug}`}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-surface-soft rounded-xl transition-colors text-body-sm font-bold text-ink"
                        >
                          <svg className="w-4 h-4 text-ash" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                          </svg>
                          <span>{cat.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}


                {/* Images */}
                {suggestions.images.length > 0 && (
                  <div>
                    <h4 className="text-caption-md text-mute font-bold px-3 mb-1 uppercase tracking-wider">Hình ảnh</h4>
                    <div className="space-y-0.5">
                      {suggestions.images.map((img) => (
                        <Link
                          key={img.id}
                          href={`/images/${img.id}`}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-surface-soft rounded-xl transition-colors text-body-sm font-medium text-ink"
                        >
                          <svg className="w-4 h-4 text-ash" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                          <span className="line-clamp-1">{img.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Search Trigger Icon */}
      <div className="sm:hidden flex justify-end">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="p-2 rounded-full hover:bg-surface-soft text-ink/80 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-outer cursor-pointer"
          aria-label="Search"
        >
          <Search className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Search Modal */}
      {isModalOpen && (
        <div ref={mobileContainerRef} className="fixed inset-0 z-50 w-full h-screen bg-canvas/95 backdrop-blur-md flex flex-col p-4">
          <div className="w-full max-w-2xl mx-auto mt-2 relative">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 w-full">
              <div className="flex-1">
                <SearchBar
                  ref={mobileInputRef}
                  placeholder="Search for ideas..."
                  value={searchVal}
                  onChange={(e) => {
                    setSearchVal(e.target.value)
                    setShowDropdown(true)
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onKeyDown={handleKeyDown}
                  onClear={handleClear}
                />
              </div>
              <button type="submit" className="hidden" />
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-body-strong font-bold text-ink px-3 py-2 hover:bg-surface-soft rounded-full transition-colors cursor-pointer shrink-0"
              >
                Cancel
              </button>
            </form>

            {/* Mobile Suggestions Dropdown */}
            {showDropdown && debouncedSearchVal.trim().length > 0 && suggestions && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-canvas rounded-[24px] shadow-[0_12px_30px_rgba(0,0,0,0.15)] ring-1 ring-black/5 p-4 z-50 max-h-[calc(100vh-140px)] overflow-y-auto">
                {loadingSuggestions && (
                  <div className="text-body-sm text-mute text-center py-2">Loading suggestions...</div>
                )}
                {!loadingSuggestions && 
                  suggestions.categories.length === 0 && 
                  suggestions.images.length === 0 && 
                  suggestions.users.length === 0 && (
                    <div className="text-body-sm text-mute text-center py-2">No ideas found for "{debouncedSearchVal}"</div>
                )}
                
                {!loadingSuggestions && (
                  <div className="space-y-4">
                    {/* Categories */}
                    {suggestions.categories.length > 0 && (
                      <div>
                        <h4 className="text-caption-md text-mute font-bold px-3 mb-1 uppercase tracking-wider">Chủ đề</h4>
                        <div className="space-y-0.5">
                          {suggestions.categories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/categories/${cat.slug}`}
                              onClick={() => {
                                setShowDropdown(false)
                                setIsModalOpen(false)
                              }}
                              className="flex items-center gap-3 px-3 py-2 hover:bg-surface-soft rounded-xl transition-colors text-body-sm font-bold text-ink"
                            >
                              <svg className="w-4 h-4 text-ash" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                              </svg>
                              <span>{cat.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}


                    {/* Images */}
                    {suggestions.images.length > 0 && (
                      <div>
                        <h4 className="text-caption-md text-mute font-bold px-3 mb-1 uppercase tracking-wider">Hình ảnh</h4>
                        <div className="space-y-0.5">
                          {suggestions.images.map((img) => (
                            <Link
                              key={img.id}
                              href={`/images/${img.id}`}
                              onClick={() => {
                                setShowDropdown(false)
                                setIsModalOpen(false)
                              }}
                              className="flex items-center gap-3 px-3 py-2 hover:bg-surface-soft rounded-xl transition-colors text-body-sm font-medium text-ink"
                            >
                              <svg className="w-4 h-4 text-ash" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                              </svg>
                              <span className="line-clamp-1">{img.title}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
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
    <header className="sticky top-0 z-50 w-full bg-canvas px-4  ">
      <div className="flex items-center gap-4 max-w-[1500px] h-20 mx-auto">
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
          <Suspense fallback={<SearchBar placeholder="Search for ideas..." />}>
            <SearchInput />
          </Suspense>
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
      </div>
    </header>
  )
}
