import prisma from "@/app/lib/db";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Shield, ShieldAlert } from "lucide-react";

// Colour coding per action type — makes the log scannable at a glance
const actionStyles: Record<string, { bg: string; text: string; label: string }> = {
    CREATE_USER:    { bg: "bg-emerald-100", text: "text-emerald-700", label: "Create User" },
    UPDATE_ROLE:    { bg: "bg-amber-100",   text: "text-amber-700",   label: "Update Role" },
    DELETE_USER:    { bg: "bg-red-100",     text: "text-red-700",     label: "Delete User" },
    UPDATE_PRODUCT: { bg: "bg-blue-100",    text: "text-blue-700",    label: "Update Product" },
    RECORD_SALE:    { bg: "bg-rose-100",    text: "text-rose-700",    label: "Sale" },
    RECORD_PURCHASE:{ bg: "bg-sky-100",     text: "text-sky-700",     label: "Purchase" },
};

export default async function AuditLogPage() {
    // ADMIN only — same guard pattern as /admin/users
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") redirect("/dashboard");

    // Fetch the 200 most recent log entries
    // We limit to 200 for now — pagination can come later
    const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <p className="text-xs font-mono uppercase tracking-widest text-emerald-600">
                    Security
                </p>
                <h1
                    className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-stone-900"
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                    Audit Log
                </h1>
                <p className="text-sm mt-1 text-stone-500">
                    {logs.length} recent action{logs.length !== 1 ? "s" : ""} recorded
                </p>
            </div>

            {/* Table card */}
            <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
                {logs.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
                            <Shield className="w-8 h-8 text-stone-400" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-stone-900 mb-1">No activity yet</p>
                            <p className="text-sm text-stone-500">
                                Actions will appear here as users interact with the system
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-stone-50 border-b border-stone-200">
                                <tr>
                                    {["Time", "User", "Role", "Action", "Target", "Detail"].map((h) => (
                                        <th
                                            key={h}
                                            className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-stone-600"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {logs.map((log) => {
                                    const style = actionStyles[log.action] ?? {
                                        bg: "bg-stone-100",
                                        text: "text-stone-700",
                                        label: log.action,
                                    };

                                    return (
                                        <tr key={log.id} className="hover:bg-stone-50 transition-colors">
                                            {/* Time */}
                                            <td className="px-5 py-3.5 whitespace-nowrap">
                                                <div className="text-sm font-medium text-stone-800">
                                                    {format(log.createdAt, "MMM d, yyyy")}
                                                </div>
                                                <div className="text-xs text-stone-400">
                                                    {format(log.createdAt, "HH:mm:ss")}
                                                </div>
                                            </td>

                                            {/* User */}
                                            <td className="px-5 py-3.5 whitespace-nowrap text-sm text-stone-700">
                                                {log.userEmail ?? "—"}
                                            </td>

                                            {/* Role */}
                                            <td className="px-5 py-3.5 whitespace-nowrap">
                                                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                                                    {log.userRole ?? "—"}
                                                </span>
                                            </td>

                                            {/* Action badge */}
                                            <td className="px-5 py-3.5 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
                                                    {style.label}
                                                </span>
                                            </td>

                                            {/* Target */}
                                            <td className="px-5 py-3.5 whitespace-nowrap">
                                                <span className="text-xs font-mono text-stone-500">
                                                    {log.targetType && log.targetId
                                                        ? `${log.targetType}`
                                                        : "—"}
                                                </span>
                                            </td>

                                            {/* Detail */}
                                            <td className="px-5 py-3.5 text-sm text-stone-600 max-w-xs truncate">
                                                {log.detail ?? "—"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}