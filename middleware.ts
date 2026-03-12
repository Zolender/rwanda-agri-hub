import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
    const isPublicRoute = ["/", "/login"].includes(nextUrl.pathname)

    // 1. Allow API auth routes (needed for NextAuth to function)
    if (isApiAuthRoute) return NextResponse.next()

    // 2. Redirect logged-in users away from /login to /dashboard
    if (isPublicRoute) {
        if (isLoggedIn && nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard", nextUrl))
        }
        return NextResponse.next()
    }

    // 3. Kick guests out of protected routes
    if (!isLoggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl))
    }

        return NextResponse.next()
})

// This config defines which paths the middleware runs on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}