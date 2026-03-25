'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SidebarNav from '../SideBarNav';
import { Leaf, Moon, Sun } from 'lucide-react';

export default function DashboardShell({ children, session }: { children: React.ReactNode; session: any }) {
    const [isDark, setIsDark] = useState(false);

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
            className={`flex h-screen ${isDark ? 'bg-stone-950' : 'bg-[#fafaf9]'} transition-colors duration-300`}
            style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
        >
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`w-64 ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'} border-r flex flex-col transition-colors`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-stone-200 dark:border-stone-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-emerald-600 rounded-lg grid place-items-center shrink-0">
                                <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
                            </div>
                            <h2 
                                className={`text-lg font-black ${isDark ? 'text-stone-100' : 'text-stone-900'} tracking-tight`}
                                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                            >
                                Agri<span className="text-emerald-600">Hub</span>
                            </h2>
                        </div>

                        {/* Dark Mode Toggle (in header) */}
                        <motion.button
                            onClick={toggleDarkMode}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-2 rounded-lg ${isDark ? 'bg-stone-800 text-stone-400 hover:text-stone-200' : 'bg-stone-100 text-stone-600 hover:text-stone-900'} transition-colors`}
                            aria-label="Toggle dark mode"
                        >
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </motion.button>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto">
                    <SidebarNav isDark={isDark} />
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}