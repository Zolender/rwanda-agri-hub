"use server";

import prisma from "@/app/lib/db";
import { auth } from "@/app/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// ── Shared auth guard ──────────────────────────────────────────────────────────
async function requireAdmin() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        throw new Error("Only ADMINs can manage users.");
    }
    return session;
}

// ── Password strength checker ──────────────────────────────────────────────────
// We export this so the modal can use the exact same rules client-side
// One source of truth — if we change rules here, the modal reflects it too
export function checkPasswordStrength(password: string): {
    score: number;        // 0–4
    errors: string[];     // which rules are failing
} {
    const errors: string[] = [];

    if (password.length < 8)              errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password))          errors.push("At least one uppercase letter");
    if (!/[0-9]/.test(password))          errors.push("At least one number");
    if (!/[^A-Za-z0-9]/.test(password))   errors.push("At least one special character (!@#$...)");

    // score = how many rules are passing (4 = all passing = strong)
    return { score: 4 - errors.length, errors };
}

// ── 1. Create a new user
export async function createUserAction(data: {
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "MANAGER" | "ANALYST";
}) {
    await requireAdmin();

    if (!data.email || !data.password || !data.name) {
        return { success: false, error: "Name, email and password are required." };
    }

    // Server-side password strength check — same rules as the client
    const { errors } = checkPasswordStrength(data.password);
    if (errors.length > 0) {
        return { success: false, error: `Weak password: ${errors[0]}` };
    }

    try {
        const hashedPassword = await bcrypt.hash(data.password, 12);

        await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role,
            },
        });

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error: any) {
        if (error.code === "P2002") {
            return { success: false, error: "A user with that email already exists." };
        }
        return { success: false, error: error.message };
    }
}

// ── 2. Update a user's role 
export async function updateUserRoleAction(
    userId: string,
    newRole: "ADMIN" | "MANAGER" | "ANALYST"
) {
    const session = await requireAdmin();

    if (session.user?.id === userId) {
        return { success: false, error: "You cannot change your own role." };
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
        });

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ── 3. Delete a user 
export async function deleteUserAction(userId: string) {
    const session = await requireAdmin();

    if (session.user?.id === userId) {
        return { success: false, error: "You cannot delete your own account." };
    }

    try {
        await prisma.user.delete({ where: { id: userId } });

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}