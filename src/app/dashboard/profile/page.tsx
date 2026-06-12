"use client"
import * as React from "react"
import Image from "next/image"
import { Camera, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useAuthStore from "@/lib/store/authStore"
import { useUpdateProfile, useChangePassword } from "@/store/api"

export default function ProfilePage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = React.useState<"profile" | "password">("profile")
  
  // Profile state
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = React.useState<string>("")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Password state
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  const { mutate: updateProfile, isPending: updatingProfile } = useUpdateProfile()
  const { mutate: changePassword, isPending: changingPassword } = useChangePassword()

  // Initialize fields once user is loaded
  React.useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
      if (user.avatar) {
        setAvatarPreview(user.avatar)
      }
    }
  }, [user])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ảnh đại diện phải nhỏ hơn 5MB")
        return
      }
      setAvatarFile(file)
      const localUrl = URL.createObjectURL(file)
      setAvatarPreview(localUrl)
    }
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast.error("Họ và tên không được để trống")
      return
    }

    if (!email.trim()) {
      toast.error("Email không được để trống")
      return
    }

    updateProfile({
      name,
      email,
      avatar: avatarFile,
    }, {
      onSuccess: () => {
        toast.success("Cập nhật hồ sơ thành công")
      },
      onError: (err: any) => {
        toast.error(err?.message || "Cập nhật hồ sơ thất bại")
      }
    })
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword) {
      toast.error("Vui lòng nhập mật khẩu hiện tại")
      return
    }

    if (!newPassword) {
      toast.error("Vui lòng nhập mật khẩu mới")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải chứa ít nhất 6 ký tự")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp")
      return
    }

    changePassword({
      currentPassword,
      newPassword,
    }, {
      onSuccess: () => {
        toast.success("Đổi mật khẩu thành công")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      },
      onError: (err: any) => {
        toast.error(err?.message || "Đổi mật khẩu thất bại")
      }
    })
  }

  const userInitial = name?.trim().charAt(0).toUpperCase() || "U"

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-hairline gap-6 text-body-strong font-bold">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "profile"
              ? "border-primary text-primary"
              : "border-transparent text-mute hover:text-ink"
          }`}
        >
          Chỉnh sửa hồ sơ
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "password"
              ? "border-primary text-primary"
              : "border-transparent text-mute hover:text-ink"
          }`}
        >
          Đổi mật khẩu
        </button>
      </div>

      {/* SECTION 1: EDIT PROFILE */}
      {activeTab === "profile" && (
        <div className="bg-canvas border border-hairline rounded-[24px] p-6 sm:p-8 space-y-6">
          <div className="border-b border-hairline pb-4">
            <h2 className="text-heading-lg text-ink font-bold">Chỉnh sửa hồ sơ</h2>
            <p className="text-body-sm text-mute mt-1">Cập nhật thông tin công khai và ảnh đại diện của bạn.</p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Avatar Uploader */}
            <div className="flex flex-col items-center gap-4">
              <div 
                onClick={handleAvatarClick}
                className="group relative w-32 h-32 rounded-full overflow-hidden border border-hairline bg-[#0b8f7e] text-white flex items-center justify-center text-display-md font-bold cursor-pointer hover:opacity-95 shadow-sm"
              >
                {avatarPreview ? (
                  <Image 
                    src={avatarPreview} 
                    alt="Avatar Preview" 
                    fill 
                    sizes="128px" 
                    className="object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                ) : (
                  <span>{userInitial}</span>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept="image/*"
                className="hidden" 
              />

              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleAvatarClick}
                className="rounded-full font-bold text-body-sm "
              >
                Thay đổi ảnh
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-body-strong mb-1 block text-ink">Họ và tên</label>
                <Input 
                  type="text" 
                  placeholder="Nhập họ và tên" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-body-strong mb-1 block text-ink">Email</label>
                <Input 
                  type="email" 
                  placeholder="Nhập địa chỉ email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full rounded-full font-bold bg-[#e60023] hover:bg-[#e60023]/80" 
              disabled={updatingProfile}
            >
              {updatingProfile ? "Đang lưu thay đổi..." : "Lưu thay đổi"}
            </Button>
          </form>
        </div>
      )}

      {/* SECTION 2: CHANGE PASSWORD */}
      {activeTab === "password" && (
        <div className="bg-canvas border border-hairline rounded-[24px] p-6 sm:p-8 space-y-6">
          <div className="border-b border-hairline pb-4">
            <h2 className="text-heading-lg text-ink font-bold">Đổi mật khẩu</h2>
            <p className="text-body-sm text-mute mt-1">Thay đổi mật khẩu đăng nhập của bạn.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-body-strong mb-1 block text-ink">Mật khẩu hiện tại</label>
                <div className="relative">
                  <Input 
                    type={showCurrentPassword ? "text" : "password"} 
                    placeholder="Nhập mật khẩu hiện tại" 
                    className="pr-12"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ash hover:text-ink focus:outline-none cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-body-strong mb-1 block text-ink">Mật khẩu mới</label>
                <div className="relative">
                  <Input 
                    type={showNewPassword ? "text" : "password"} 
                    placeholder="Mật khẩu mới (tối thiểu 6 ký tự)" 
                    className="pr-12"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ash hover:text-ink focus:outline-none cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-body-strong mb-1 block text-ink">Xác nhận mật khẩu mới</label>
                <div className="relative">
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Xác nhận mật khẩu mới" 
                    className="pr-12"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ash hover:text-ink focus:outline-none cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full rounded-full font-bold" 
              disabled={changingPassword}
            >
              {changingPassword ? "Đang cập nhật mật khẩu..." : "Cập nhật mật khẩu"}
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
