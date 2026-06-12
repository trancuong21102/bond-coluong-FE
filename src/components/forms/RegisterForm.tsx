"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useRegister } from "@/store/api"
import { Eye, EyeOff } from "lucide-react"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export function RegisterForm() {
  const router = useRouter()
  const { mutate: registerMutate, isPending } = useRegister()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    registerMutate({ name: data.name, email: data.email, password: data.password }, {
      onSuccess: () => {
        toast.success("Account created successfully! Please log in.")
        router.push("/login")
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to create account.")
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-body-strong mb-1 block text-ink">Name</label>
        <Input type="text" placeholder="Your name" {...register("name")} />
        {errors.name && <p className="text-error text-caption-sm mt-1">{errors.name.message}</p>}
      </div>
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
            placeholder="Create a password"
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
      <div>
        <label className="text-body-strong mb-1 block text-ink">Confirm Password</label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            className="pr-12"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(v => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ash hover:text-ink focus:outline-none cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-error text-caption-sm mt-1">{errors.confirmPassword.message}</p>}
      </div>
      <Button type="submit" variant="primary" className="w-full mt-4 bg-[#e60023] hover:bg-[#e60023]/80" disabled={isPending}>
        {isPending ? "Signing up..." : "Sign up"}
      </Button>
    </form>
  )
}
