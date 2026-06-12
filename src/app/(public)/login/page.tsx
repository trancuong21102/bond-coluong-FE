import { LoginForm } from "@/components/forms/LoginForm"
import Link from "next/link"

export default function LoginPage() {
  return (
    <main className="flex-1 flex w-full items-center justify-center min-h-[calc(100vh-80px)] bg-surface-soft p-4">
        <div className="bg-canvas w-full max-w-3xl p-8 rounded-[32px] shadow-[0_16px_32px_rgba(0,0,0,0.1)] text-center">
          <div className="w-12 h-12 rounded-full bg-primary mx-auto flex items-center justify-center text-on-primary font-bold text-3xl leading-none mb-6">
            P
          </div>
          <h1 className="text-heading-xl text-ink font-bold mb-2">Welcome to Pinterest Mini</h1>
          <p className="text-body-md text-mute mb-8">Find new ideas to try</p>
          
          <div className="text-left mb-6">
            <LoginForm />
          </div>
          
          <p className="text-caption-sm text-mute mt-4">
            By continuing, you agree to Pinterest Mini's Terms of Service and acknowledge you've read our Privacy Policy.
          </p>
          <div className="border-t border-hairline mt-6 pt-6">
            <Link href="/register" className="text-body-strong text-ink hover:underline">
              Not on Pinterest Mini yet? Sign up
            </Link>
          </div>
        </div>
      </main>
  )
}
