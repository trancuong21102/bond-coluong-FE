"use client"
import * as React from "react"
import { useGetMe } from "@/store/api"
import useAuthStore from "@/lib/store/authStore"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token, login, logout, user } = useAuthStore()
  
  // Fetch only if token is present and user object is not loaded in Zustand store yet
  const hasToken = !!token
  const shouldFetch = hasToken && !user

  const { data: response, isError } = useGetMe({
    enabled: shouldFetch,
  })

  React.useEffect(() => {
    if (response?.data && token) {
      login(response.data, token)
    }
  }, [response, token, login])

  React.useEffect(() => {
    if (isError) {
      logout()
    }
  }, [isError, logout])

  return <>{children}</>
}
