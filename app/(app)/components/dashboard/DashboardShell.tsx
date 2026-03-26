'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import SidebarNav from '../SideBarNav';
import { Leaf, Moon, Sun, Menu, X } from 'lucide-react';

export default function DashboardShell({ children, session }: { children: React.ReactNode; session: any }) {
    const [isDark, setIsDark] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar when route changes (mobile only)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) {
            setIsDark(saved === 'true');
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDark;
        setIsDark(newMode);
        localStorage.setItem('darkMode', String(newMode));
    };

    return (
        <div 
            className={`flex h-screen ${isDark ? 'bg-stone-950' : 'bg-[#fafaf9]'} transition-colors duration-300 overflow-hidden`}
            style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
        >
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar - Desktop & Mobile */}
            <motion.aside
                initial={false}
                animate={{ 
                    x: isSidebarOpen ? 0 : -300
                }}
                transition={{ 
                    type: "spring",
                    damping: 30,
                    stiffness: 300
                }}
                className={`
                    fixed lg:relative z-50 h-screen w-64 
                    ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'} 
                    border-r flex flex-col transition-colors
                    lg:translate-x-0
                `}
            >
                {/* Logo Header with Dark Mode Toggle */}
                <div className={`p-6 border-b ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
                    <div className="flex items-center justify-between gap-3">
                        {/* Logo */}
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                                className="w-9 h-9 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl grid place-items-center shrink-0 shadow-lg shadow-emerald-600/20"
                            >
                                <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
                            </motion.div>
                            <h2 
                                className={`text-lg font-black ${isDark ? 'text-stone-100' : 'text-stone-900'} tracking-tight truncate`}
                                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                            >
                                Agri<span className="text-emerald-600">Hub</span>
                            </h2>
                        </div>

                        {/* Dark Mode Toggle - Desktop */}
                        <motion.button
                            onClick={toggleDarkMode}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`hidden lg:flex p-2 rounded-lg transition-colors ${
                                isDark 
                                    ? 'bg-stone-800 text-amber-400 hover:bg-stone-700' 
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                            aria-label="Toggle dark mode"
                        >
                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: isDark ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                            </motion.div>
                        </motion.button>

                        {/* Close button - Mobile only */}
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className={`lg:hidden p-2 rounded-lg transition-colors ${
                                isDark ? 'hover:bg-stone-800' : 'hover:bg-stone-100'
                            }`}
                        >
                            <X className={`w-5 h-5 ${isDark ? 'text-stone-400' : 'text-stone-600'}`} />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto">
                    <SidebarNav isDark={isDark} />
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Top Bar */}
                <motion.header
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className={`lg:hidden ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'} border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30`}
                >
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className={`p-2 rounded-lg ${isDark ? 'hover:bg-stone-800 text-stone-300' : 'hover:bg-stone-100 text-stone-600'} transition-colors`}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-lg grid place-items-center">
                            <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
                        </div>
                        <span className={`text-base font-black ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                            AgriHub
                        </span>
                    </div>

                    <motion.button
                        onClick={toggleDarkMode}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded-lg transition-colors ${
                            isDark ? 'hover:bg-stone-800 text-amber-400' : 'hover:bg-stone-100 text-stone-600'
                        }`}
                    >
                        <motion.div
                            animate={{ rotate: isDark ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </motion.div>
                    </motion.button>
                </motion.header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <motion.div
                        key={pathname} // Re-animate on route change
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}