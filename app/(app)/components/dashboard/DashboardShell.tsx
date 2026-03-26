'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarNav from '../SideBarNav';
import { Leaf, Moon, Sun, Menu, X } from 'lucide-react';

export default function DashboardShell({ children, session }: { children: React.ReactNode; session: any }) {
    const [isDark, setIsDark] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            <AnimatePresence mode="wait">
                <motion.aside
                    initial={{ x: -300 }}
                    animate={{ x: isSidebarOpen || window.innerWidth >= 1024 ? 0 : -300 }}
                    exit={{ x: -300 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className={`
                        fixed lg:relative z-50 h-screen w-64 
                        ${isDark ? 'bg-stone-900/95 border-stone-800' : 'bg-white/95 border-stone-200'} 
                        border-r backdrop-blur-xl flex flex-col transition-colors
                        lg:translate-x-0
                    `}
                >
                    {/* Logo Header */}
                    <div className={`p-6 border-b ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                    className="w-9 h-9 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl grid place-items-center shrink-0 shadow-lg shadow-emerald-600/20"
                                >
                                    <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </motion.div>
                                <h2 
                                    className={`text-lg font-black ${isDark ? 'text-stone-100' : 'text-stone-900'} tracking-tight`}
                                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                                >
                                    Agri<span className="text-emerald-600">Hub</span>
                                </h2>
                            </div>

                            {/* Close button - Mobile only */}
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="lg:hidden p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto">
                        <SidebarNav isDark={isDark} />
                    </div>

                    {/* Dark Mode Toggle - Desktop */}
                    <div className={`hidden lg:block p-4 border-t ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
                        <motion.button
                            onClick={toggleDarkMode}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors ${
                                isDark 
                                    ? 'bg-stone-800 text-stone-300 hover:bg-stone-700' 
                                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                            }`}
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            <span className="text-sm font-medium">
                                {isDark ? 'Light Mode' : 'Dark Mode'}
                            </span>
                        </motion.button>
                    </div>
                </motion.aside>
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Top Bar */}
                <motion.header
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className={`lg:hidden ${isDark ? 'bg-stone-900/95 border-stone-800' : 'bg-white/95 border-stone-200'} border-b backdrop-blur-xl px-4 py-3 flex items-center justify-between sticky top-0 z-30`}
                >
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className={`p-2 rounded-lg ${isDark ? 'hover:bg-stone-800' : 'hover:bg-stone-100'} transition-colors`}
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
                        className={`p-2 rounded-lg ${isDark ? 'hover:bg-stone-800' : 'hover:bg-stone-100'} transition-colors`}
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </motion.button>
                </motion.header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}