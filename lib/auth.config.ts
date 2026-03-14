import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
    providers: [
        Credentials({
        async authorize() {
            return null; // We will override this in the "heavy" file
        },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
        const isLoggedIn = !!auth?.user;
        const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
        const isOnTransactions = nextUrl.pathname.startsWith("/transactions");

        if (isOnDashboard || isOnTransactions) {
            if (isLoggedIn) return true;
            return false; // Redirect unauthenticated users to login
        }
        return true;
        },
    },
} satisfies NextAuthConfig;