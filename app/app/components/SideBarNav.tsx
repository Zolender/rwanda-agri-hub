'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LayoutDashboard, History, FileUp, ShieldCheck } from 'lucide-react';

export default function SidebarNav() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const role = session?.user?.role;

    // Define our links with their required roles
    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, minRole: 'ANALYST' },
        { name: 'Transactions', href: '/transactions', icon: History, minRole: 'ANALYST' },
        { name: 'Import Data', href: '/import', icon: FileUp, minRole: 'MANAGER' },
        { name: 'Admin', href: '/admin', icon: ShieldCheck, minRole: 'ADMIN' },
    ];

    // Logic: Only show the link if the user's role allows it
    const filteredItems = navItems.filter((item) => {
        if (item.minRole === 'ADMIN') return role === 'ADMIN';
        if (item.minRole === 'MANAGER') return role === 'ADMIN' || role === 'MANAGER';
        return true; // Analyst (default) sees basic pages
    });

    return (
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
    );
}