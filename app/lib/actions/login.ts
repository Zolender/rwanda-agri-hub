"use server";

import { signIn } from "@/app/lib/auth";
import { loginRatelimit } from "../utils/ratelimit";
import { headers } from "next/headers";
import { AuthError } from "next-auth";

export async function loginAction(data: {
    email: string;
    password: string;
}) {
    // Get the caller's IP
    const headersList = await headers();
    const ip =
        headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
        headersList.get("x-real-ip") ??
        "unknown";

    // Check rate limit
    const { success, remaining, reset } = await loginRatelimit.limit(ip);

    if (!success) {
        const minutesLeft = Math.ceil((reset - Date.now()) / 1000 / 60);
        return {
            error: `Too many login attempts. Please try again in ${minutesLeft} minute${minutesLeft === 1 ? "" : "s"}.`,
            rateLimited: true,
        };
    }

    try {
        await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        return { success: true, remaining };
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "Invalid email or password. Please try again.", remaining };
        }
        throw error;
    }
}