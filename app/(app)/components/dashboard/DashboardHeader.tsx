"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDarkMode } from "../DarkModeContext"; // ← NEW

type DashboardHeaderProps = {
    lastUpdated: string;
};

export default function DashboardHeader({ lastUpdated }: DashboardHeaderProps) {
    const { isDark } = useDarkMode(); // ← NEW
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.refresh();
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    return (
        <div className="flex items-center justify-between">
            <div>
                {/* ↓ text-slate-800 → adapts */}
                <h1 className={`text-2xl font-bold ${isDark ? 'text-stone-100' : 'text-slate-800'}`}>
                    Dashboard
                </h1>
                {/* ↓ text-slate-500 → adapts */}
                <p className={`text-sm mt-1 ${isDark ? 'text-stone-400' : 'text-slate-500'}`}>
                    Last updated:{' '}
                    {/* ↓ text-slate-700 → adapts */}
                    <span className={`font-medium ${isDark ? 'text-stone-200' : 'text-slate-700'}`}>
                        {lastUpdated}
                    </span>
                </p>
            </div>
            
            {/* ↓ button adapts bg, border, text for dark */}
            <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition-colors disabled:opacity-50 hover:cursor-pointer ${
                    isDark
                        ? 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
                        : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
            >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
        </div>
    );
}