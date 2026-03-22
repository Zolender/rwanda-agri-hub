import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import SidebarNav from "@/app/(app)/components/SideBarNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (!session) redirect("/login");

    return (
        <div className="flex h-screen bg-slate-50">
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
            <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                Agri<span className="text-emerald-600">Hub</span>
            </h2>
            </div>

            {/* SWAP: Replace the old <nav> with your new component */}
            <div className="flex-1">
            <SidebarNav /> 
            </div>

            <div className="p-4 border-t border-slate-100">
            {/* Keep your user profile/logout section here as it's already beautiful */}
            </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
            {children}
        </main>
    </div>
    );
}