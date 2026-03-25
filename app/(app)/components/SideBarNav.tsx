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
    LogOut
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
            <nav className="space-y-1 px-3 mt-4">
                {filteredItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                                    isActive 
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                                        : isDark
                                        ? 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                                <span className="font-medium text-sm">{item.name}</span>
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className={`p-4 border-t ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`flex items-center gap-3 px-3 py-3 mb-2 rounded-xl ${isDark ? 'bg-stone-800' : 'bg-stone-50'}`}
                >
                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                        {session?.user?.name?.[0] || "U"}
                    </div>
                    <div className="overflow-hidden flex-1">
                        <p className={`text-sm font-semibold ${isDark ? 'text-stone-200' : 'text-stone-900'} truncate`}>
                            {session?.user?.name}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-stone-500' : 'text-stone-400'} capitalize`}>
                            {session?.user?.role?.toLowerCase()}
                        </p>
                    </div>
                </motion.div>
                
                <motion.button
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className={`w-full px-3 py-2.5 text-sm rounded-lg transition-colors flex items-center gap-2 font-medium ${
                        isDark 
                            ? 'text-stone-400 hover:bg-red-950 hover:text-red-400'
                            : 'text-stone-500 hover:bg-red-50 hover:text-red-600'
                    }`}
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </motion.button>
            </div>
        </div>
    );
}