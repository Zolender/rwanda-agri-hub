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
    Shield,
} from 'lucide-react';

type Role = 'ADMIN' | 'MANAGER' | 'ANALYST';

export default function SidebarNav({ isDark, role }: { isDark: boolean; role: Role }) {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard',     href: '/dashboard',      icon: LayoutDashboard, minRole: 'ANALYST'  },
        { name: 'Transactions',  href: '/transactions',   icon: History,         minRole: 'ANALYST'  },
        { name: 'Record Sale',   href: '/dashboard/sale', icon: ShoppingBag,     minRole: 'ANALYST'  },
        { name: 'Receive Stock', href: '/dashboard/add',  icon: PackagePlus,     minRole: 'MANAGER'  },
        { name: 'Import Data',   href: '/import',         icon: FileUp,          minRole: 'MANAGER'  },
        { name: 'Admin',         href: '/admin',          icon: ShieldCheck,     minRole: 'ADMIN'    },
        { href: "/admin/audit", label: "Audit Log",       icon: Shield, adminOnly: true }
    ];

    const filteredItems = navItems.filter((item) => {
        if (item.minRole === 'ADMIN')   return role === 'ADMIN';
        if (item.minRole === 'MANAGER') return role === 'ADMIN' || role === 'MANAGER';
        return true;
    });

    return (
        <div className='flex flex-col h-full justify-between'>
            <nav className="space-y-1 px-3 py-4">
                {filteredItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

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
                                    relative flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl
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
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
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
                })}
            </nav>

            <div className={`p-3 border-t ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
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