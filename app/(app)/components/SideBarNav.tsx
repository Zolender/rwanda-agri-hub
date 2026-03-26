'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, 
    History, 
    FileUp, 
    ShieldCheck, 
    ShoppingBag,
    LogOut,
    ChevronRight
} from 'lucide-react';

export default function SidebarNav({ isDark }: { isDark: boolean }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const role = session?.user?.role;

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, minRole: 'ANALYST' },
        { name: 'Transactions', href: '/transactions', icon: History, minRole: 'ANALYST' },
        { name: 'Record Sale', href: '/dashboard/sale', icon: ShoppingBag, minRole: 'ANALYST' },
        { name: 'Import Data', href: '/import', icon: FileUp, minRole: 'MANAGER' },
        { name: 'Admin', href: '/admin', icon: ShieldCheck, minRole: 'ADMIN' },
    ];

    const filteredItems = navItems.filter((item) => {
        if (item.minRole === 'ADMIN') return role === 'ADMIN';
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
                                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-600/20' 
                                        : isDark
                                        ? 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'
                                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                                    }
                                `}
                            >
                                {/* Background Shine Effect */}
                                {isActive && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                        animate={{ x: ['-100%', '100%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />
                                )}

                                <div className="flex items-center gap-3 relative z-10">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </motion.div>
                                    <span className="font-semibold text-sm tracking-tight">{item.name}</span>
                                </div>

                                {/* Arrow Indicator */}
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ 
                                        opacity: isActive ? 1 : 0,
                                        x: isActive ? 0 : -10
                                    }}
                                    className="relative z-10"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </motion.div>
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div className={`p-4 border-t ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`flex items-center gap-3 px-3 py-3 mb-3 rounded-xl transition-colors ${
                        isDark ? 'bg-stone-800/50 hover:bg-stone-800' : 'bg-stone-50 hover:bg-stone-100'
                    }`}
                >
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-600/30"
                    >
                        {session?.user?.name?.[0] || "U"}
                    </motion.div>
                    <div className="overflow-hidden flex-1">
                        <p className={`text-sm font-bold ${isDark ? 'text-stone-100' : 'text-stone-900'} truncate`}>
                            {session?.user?.name}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'} capitalize`}>
                            {session?.user?.role?.toLowerCase()}
                        </p>
                    </div>
                </motion.div>
                
                <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className={`w-full px-3 py-2.5 text-sm rounded-xl transition-all flex items-center gap-2 font-semibold ${
                        isDark 
                            ? 'text-rose-400 hover:bg-rose-950/50 border border-stone-800 hover:border-rose-900/50'
                            : 'text-red-600 hover:bg-red-50 border border-stone-200 hover:border-red-200'
                    }`}
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </motion.button>
            </div>
        </div>
    );
}