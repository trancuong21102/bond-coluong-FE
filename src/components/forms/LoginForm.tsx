"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import useAuthStore from "@/lib/store/authStore"
import { useLogin } from "@/store/api"
import { Eye, EyeOff } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
})

export function LoginForm() {
  const router = useRouter()
  const login = useAuthStore(state => state.login)
  const { mutate: loginMutate, isPending } = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutate(data, {
      onSuccess: (res: any) => {
        login(res?.data?.user, res?.data?.token)
        toast.success(`Welcome back, ${res?.data?.user?.name}!`)
        router.push("/dashboard")
      },
      onError: (err: any) => {
        toast.error(err?.message || "Invalid email or password.")
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-body-strong mb-1 block text-ink">Email</label>
        <Input type="email" placeholder="Email address" {...register("email")} />
        {errors.email && <p className="text-error text-caption-sm mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="text-body-strong mb-1 block text-ink">Password</label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="pr-12"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ash hover:text-ink focus:outline-none cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-error text-caption-sm mt-1">{errors.password.message}</p>}
      </div>
      <Button type="submit" variant="primary" className="w-full mt-4 bg-[#e60023] hover:bg-[#e60023]/80" disabled={isPending}>
        {isPending ? "Logging in..." : "Log in"}
      </Button>
    </form>
  )
}
