import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" }, // JWT is more compatible with Edge
    providers: [
        Credentials({
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) return null;

            const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
            });

            if (!user || !user.password) return null;

            const passwordsMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
            );

            if (passwordsMatch) return user;
            
            return null;
        },
        }),
    ],
});