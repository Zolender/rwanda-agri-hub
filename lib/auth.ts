import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/db"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
        // This defines the "Email/Password" login logic
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
        },
        
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) return null

            // 1. Find the user in Supabase
            const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
            })

            if (!user || !user.password) return null

            // 2. Check if the password is correct
            const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
            )

            if (!isValid) return null

            return user
        },
        }),
    ],
    callbacks: {
        // This part is CRITICAL for your RBAC (Roles)
        // It attaches the user's role to the session so we can check it in the UI
        async session({ session, user }) {
        if (session.user) {
            // @ts-ignore (We will fix types later)
            session.user.role = user.role
        }
        return session
        },
    },
    pages: {
        signIn: "/login", // Tells NextAuth to use your custom login page
    },
    session: {
        strategy: "database", // This means sessions are stored in Supabase, not just JWTs
        },
})