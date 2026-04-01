'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    History,
    FileUp,
    ShieldCheck,
    ShoppingBag,
    PackagePlus,
    LogOut,
    ChevronRight,
    Users,
    ScrollText,
    UserCircle
} from 'lucide-react';

type Role = 'ADMIN' | 'MANAGER' | 'ANALYST';

type NavItem = {
    name: string;
    href: string;
    icon: React.ElementType;
    minRole: Role;
};

type NavGroup = {
    label: string;           // section header e.g. "Admin"
    minRole: Role;           // hide entire group if role doesn't qualify
    items: NavItem[];
};

export default function SidebarNav({ isDark, role }: { isDark: boolean; role: Role }) {
    const pathname = usePathname();

    // ── Helper — does this role meet the minimum? ──────────────────────────────
    const hasAccess = (minRole: Role) => {
        if (minRole === 'ANALYST') return true;
        if (minRole === 'MANAGER') return role === 'ADMIN' || role === 'MANAGER';
        if (minRole === 'ADMIN')   return role === 'ADMIN';
        return false;
    };

    // ── Main nav items (no grouping) ───────────────────────────────────────────
    const mainItems: NavItem[] = [
        { name: 'Dashboard',     href: '/dashboard',      icon: LayoutDashboard, minRole: 'ANALYST' },
        { name: 'Transactions',  href: '/transactions',   icon: History,         minRole: 'ANALYST' },
        { name: 'Record Sale',   href: '/dashboard/sale', icon: ShoppingBag,     minRole: 'ANALYST' },
        { name: 'Receive Stock', href: '/dashboard/add',  icon: PackagePlus,     minRole: 'MANAGER' },
        { name: 'Import Data',   href: '/import',         icon: FileUp,          minRole: 'MANAGER' },
        { name: 'Profile',       href: '/profile',        icon: UserCircle,      minRole: 'ANALYST' },
    ];

    
    const adminGroup: NavGroup = {
        label: 'Admin',
        minRole: 'MANAGER', // show the section header to MANAGER too (they see Users)
        items: [
            { name: 'Users',     href: '/admin', icon: Users,      minRole: 'ADMIN'   },
            { name: 'Audit Log', href: '/admin/audit', icon: ScrollText, minRole: 'ADMIN'   },
        ],
    };

    const visibleMainItems  = mainItems.filter(item => hasAccess(item.minRole));
    const showAdminGroup    = hasAccess(adminGroup.minRole);
    const visibleAdminItems = adminGroup.items.filter(item => hasAccess(item.minRole));

    // ── Shared link renderer ───────────────────────────────────────────────────
    const renderNavLink = (item: NavItem, index: number) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href.startsWith('/admin') && pathname.startsWith(item.href + '/'));

        return (
            <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
            >
                <Link
                    href={item.href}
                    className={`
                        relative flex items-center justify-between gap-3 px-4 py-3 rounded-xl
                        transition-all duration-300 group overflow-hidden
                        ${isActive
                            ? 'bg-linear-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                            : isDark
                            ? 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'
                            : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                        }
                    `}
                >
                    {isActive && (
                        <motion.div
                            className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                    )}
                    <div className="flex items-center gap-3 relative z-10">
                        <Icon className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-semibold">{item.name}</span>
                    </div>
                    {isActive && (
                        <ChevronRight className="w-4 h-4 relative z-10 opacity-70" />
                    )}
                </Link>
            </motion.div>
        );
    };

    return (
        <div className="flex flex-col h-full justify-between">
            <nav className="px-3 py-4 space-y-1">
                {/* ── Main items ─────────────────────────────────────────────── */}
                {visibleMainItems.map((item, i) => renderNavLink(item, i))}

                {/* ── Admin group ────────────────────────────────────────────── */}
                {showAdminGroup && visibleAdminItems.length > 0 && (
                    <div className="pt-3">
                        {/* Section divider + label */}
                        <div className={`flex items-center gap-2 px-4 pb-2 ${
                            isDark ? 'text-stone-600' : 'text-stone-400'
                        }`}>
                            <div className={`flex-1 h-px ${isDark ? 'bg-stone-800' : 'bg-stone-200'}`} />
                            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <ShieldCheck className="w-3 h-3" />
                                Admin
                            </span>
                            <div className={`flex-1 h-px ${isDark ? 'bg-stone-800' : 'bg-stone-200'}`} />
                        </div>

                        {/* Admin sub-links */}
                        <div className="space-y-1">
                            {visibleAdminItems.map((item, i) =>
                                renderNavLink(item, visibleMainItems.length + i)
                            )}
                        </div>
                    </div>
                )}
            </nav>

           {/* ── Profile + Sign out ────────────────────────────────── */}
            <div className={`p-3 border-t ${isDark ? 'border-stone-800' : 'border-stone-200'} space-y-1`}>
                <Link
                    href="/profile"
                    className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                        transition-colors
                        ${pathname === '/profile'
                            ? 'bg-linear-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                            : isDark
                            ? 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'
                            : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
                        }
                    `}
                >
                    <UserCircle className="w-5 h-5" />
                    My Profile
                </Link>

                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                        transition-colors
                        ${isDark
                            ? 'text-stone-400 hover:bg-stone-800 hover:text-rose-400'
                            : 'text-stone-500 hover:bg-rose-50 hover:text-rose-600'
                        }
                    `}
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}