import { auth, signOut } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AppLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    const session = await auth();

    // Guard: If someone sneaks past middleware, catch them here
    if (!session) redirect("/login");

    const role = session.user?.role;

    return (
        <div className="flex h-screen bg-slate-50">
        {/* --- SIDEBAR --- */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
            <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                Agri<span className="text-emerald-600">Hub</span>
            </h2>
            </div>

            <nav className="flex-1 px-4 space-y-1">
            <NavLink href="/app/dashboard">Dashboard</NavLink>
            <NavLink href="/app/transactions">Ledger</NavLink>
            
            {/* Role-Based Links */}
            {(role === "ADMIN" || role === "MANAGER") && (
                <NavLink href="/import">Import Data</NavLink>
            )}
            
            {role === "ADMIN" && (
                <NavLink href="/admin">Team Access</NavLink>
            )}
            </nav>

            <div className="p-4 border-t border-slate-100">
            <div className="flex items-center space-x-3 px-2 py-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                {session.user?.name?.[0] || "U"}
                </div>
                <div className="overflow-hidden">
                <p className="text-sm font-medium text-slate-700 truncate">{session.user?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{role?.toLowerCase()}</p>
                </div>
            </div>
            
            <form action={async () => { "use server"; await signOut(); }}>
                <button className="w-full text-left px-3 py-2 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                Sign Out
                </button>
            </form>
            </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 overflow-y-auto p-8">
            {children}
        </main>
        </div>
    );
}

// Small helper component for the Zen Links
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
        href={href}
        className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-all"
        >
        {children}
        </Link>
    );
}