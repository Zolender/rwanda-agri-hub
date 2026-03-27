import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import QuickAdd from "@/app/(app)/components/inventory/QuickAdd";
import { PackagePlus, ShieldAlert } from "lucide-react";

export default async function QuickAddPage() {
    const session = await auth();

    // Hard server-side guard — redirect analysts away entirely
    if (!session) redirect("/login");
    if (session.user?.role === "ANALYST") redirect("/dashboard");

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <PackagePlus className="w-6 h-6 text-emerald-600" />
                    <h1 className="text-2xl font-black text-stone-900 tracking-tight"
                        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                        Receive Stock
                    </h1>
                </div>
                <p className="text-sm text-stone-500 ml-9">
                    Record an incoming delivery or purchase for an existing product.
                </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100 w-fit">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700">
                    {session.user?.role === "ADMIN" ? "Admin" : "Manager"} access
                </span>
            </div>

            <QuickAdd />

            <p className="text-xs text-stone-400 text-center">
                This creates a <strong>Purchase</strong> transaction and increments the product&apos;s stock level.
                Only Managers and Admins can perform this action.
            </p>
        </div>
    );
}