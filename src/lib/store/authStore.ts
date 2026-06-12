import { create } from "zustand"

export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER"
  avatar?: string | null
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: User) => void
}

const getStoredToken = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

const getStoredUser = () => {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem("user")
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  token: getStoredToken(),
  isAuthenticated: !!getStoredToken(),
  login: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      // Set token in cookie for middleware route protection
      document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`
    }
    set({ user, token, isAuthenticated: true })
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      // Clear cookie
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    set({ user: null, token: null, isAuthenticated: false })
  },
  updateUser: (user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user))
    }
    set({ user })
  },
}))

export default useAuthStore
