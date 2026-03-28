import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import UsersTable from "../../components/admin/usersTable";
export default async function AdminUsersPage() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
        orderBy: { name: "asc" },
    });

    const currentUserId = session.user?.id ?? "";

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-black tracking-tight text-stone-900 dark:text-stone-100">
                    User Management
                </h1>
                <p className="mt-1 text-sm text-stone-500">
                    Create, edit roles, and remove users. Changes take effect immediately.
                </p>
            </div>

            <UsersTable users={users} currentUserId={currentUserId} />
        </div>
    );
}