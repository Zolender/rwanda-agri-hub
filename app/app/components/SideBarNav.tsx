'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LayoutDashboard, History, FileUp, ShieldCheck } from 'lucide-react';
import { signOut } from "next-auth/react";

export default function SidebarNav() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const role = session?.user?.role;

    // Define our links with their required roles
    const navItems = [
        { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard, minRole: 'ANALYST' },
        { name: 'Transactions', href: '/app/transactions', icon: History, minRole: 'ANALYST' },
        { name: 'Import Data', href: '/app/import', icon: FileUp, minRole: 'MANAGER' },
        { name: 'Admin', href: '/app/admin', icon: ShieldCheck, minRole: 'ADMIN' },
    ];

    // Logic: Only show the link if the user's role allows it
    const filteredItems = navItems.filter((item) => {
        if (item.minRole === 'ADMIN') return role === 'ADMIN';
        if (item.minRole === 'MANAGER') return role === 'ADMIN' || role === 'MANAGER';
        return true; // Analyst (default) sees basic pages
    });


    return (
        <div className='flex flex-col h-full justify-between'> 
            <nav className="space-y-2 px-4">
                {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
                        isActive 
                            ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        <Icon size={20} />
                        <span className="font-medium">{item.name}</span>
                    </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center space-x-3 px-2 py-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                    {session?.user?.name?.[0] || "U"}
                    </div>
                    <div className="overflow-hidden">
                    <p className="text-sm font-medium text-slate-700 truncate">{session?.user?.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{session?.user?.role?.toLowerCase()}</p>
                    </div>
                </div>
                
                    <button 
                        onClick={() => signOut()}
                        className="w-full text-left px-3 py-2 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                        Sign Out
                    </button>
                
            </div>
        </div>
    );
}