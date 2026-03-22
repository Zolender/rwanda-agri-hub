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
        const {pathname} = nextUrl

        const publicRoutes = ['/','/login']
        const isPublicRoute = publicRoutes.includes(pathname);

        if (isPublicRoute) {
            return true; 
        }

        if(!isLoggedIn){
            return false;
        }

        return true;
        },
    },
} satisfies NextAuthConfig;