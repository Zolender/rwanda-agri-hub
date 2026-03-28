import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import UsersTable from "../../components/admin/usersTable";
export default async function AdminUsersPage() {
    // ── Server-side ADMIN guard ────────────────────────────────────────────────
    // Even though the sidebar hides this link from non-ADMINs,
    // we ALWAYS re-check on the server. Never trust the UI alone.
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/dashboard");
    }

    // ── Fetch all users 
    // We select only what we need — no passwords ever sent to the client
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailVerified: true,   // we'll use this as a "last sign-in" proxy
        },
        orderBy: { name: "asc" },
    });

    const currentUserId = session.user?.id ?? "";

    return (
        <div className="p-6 space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-black tracking-tight text-stone-900 dark:text-stone-100">
                    User Management
                </h1>
                <p className="mt-1 text-sm text-stone-500">
                    Create, edit roles, and remove users. Changes take effect immediately.
                </p>
            </div>

            {/* The client component gets all data as props */}
            <UsersTable users={users} currentUserId={currentUserId} />
        </div>
    );
}