"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useRegister } from "@/store/api"

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
        <Input type="password" placeholder="Create a password" {...register("password")} />
        {errors.password && <p className="text-error text-caption-sm mt-1">{errors.password.message}</p>}
      </div>
      <div>
        <label className="text-body-strong mb-1 block text-ink">Confirm Password</label>
        <Input type="password" placeholder="Confirm password" {...register("confirmPassword")} />
        {errors.confirmPassword && <p className="text-error text-caption-sm mt-1">{errors.confirmPassword.message}</p>}
      </div>
      <Button type="submit" variant="primary" className="w-full mt-4" disabled={isPending}>
        {isPending ? "Signing up..." : "Sign up"}
      </Button>
    </form>
  )
}
