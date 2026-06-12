import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const { pathname } = request.nextUrl

    // Protected routes
    const isDashboardRoute = pathname.startsWith('/dashboard')

    // Auth routes (cannot access if logged in)
    const isAuthRoute = pathname === '/login' || pathname === '/register'

    if (isDashboardRoute && !token) {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    if (isAuthRoute && token) {
        const dashboardUrl = new URL('/dashboard', request.url)
        return NextResponse.redirect(dashboardUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
}
