'use client'; 

import { useState, useEffect } from 'react'; 

export default function DashboardLoading() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) setIsDark(saved === 'true');
    }, []);

    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div>
                    <div className={`h-8 w-48 rounded ${isDark ? 'bg-stone-800' : 'bg-slate-200'}`} />
                    <div className={`h-4 w-32 rounded mt-2 ${isDark ? 'bg-stone-800' : 'bg-slate-200'}`} />
                </div>
                <div className={`h-10 w-32 rounded ${isDark ? 'bg-stone-800' : 'bg-slate-200'}`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className={`p-6 rounded-lg shadow ${isDark ? 'bg-stone-900' : 'bg-white'}`}>
                        <div className={`h-4 w-24 rounded mb-3 ${isDark ? 'bg-stone-800' : 'bg-slate-200'}`} />
                        <div className={`h-8 w-16 rounded ${isDark ? 'bg-stone-800' : 'bg-slate-200'}`} />
                    </div>
                ))}
            </div>

            <div>
                <div className={`h-8 w-48 rounded mb-4 ${isDark ? 'bg-stone-800' : 'bg-slate-200'}`} />
                <div className={`rounded-lg shadow p-4 space-y-3 ${isDark ? 'bg-stone-900' : 'bg-white'}`}>
                    <div className={`h-10 rounded ${isDark ? 'bg-stone-800' : 'bg-slate-200'}`} />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={`h-16 rounded ${isDark ? 'bg-stone-800/50' : 'bg-slate-100'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}