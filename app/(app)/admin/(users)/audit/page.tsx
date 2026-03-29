import prisma from "@/app/lib/db";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import AuditLogTable from "./AuditLogTable";

export default async function AuditLogPage() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") redirect("/dashboard");

    const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
    });

    return (
        <div className="space-y-6">
            <AuditLogTable logs={logs} />
        </div>
    );
}