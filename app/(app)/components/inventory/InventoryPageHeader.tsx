"use client";

import { useDarkMode } from "../DarkModeContext";

export default function InventoryPageHeader({ totalCount }: { totalCount: number }) {
    const { isDark } = useDarkMode();

    return (
        <header className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0">
                <p className={`text-xs font-mono uppercase tracking-widest ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                    Stock
                </p>
                <h1
                    className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight ${
                        isDark ? 'text-stone-100' : 'text-slate-900'
                    }`}
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                    Inventory Master List
                </h1>
                <p className={`text-sm mt-0.5 ${isDark ? 'text-stone-400' : 'text-slate-500'}`}>
                    Managing{' '}
                    <span className={`font-semibold ${isDark ? 'text-stone-200' : 'text-slate-700'}`}>
                        {totalCount.toLocaleString()}
                    </span>{' '}
                    active products in the hub.
                </p>
            </div>
        </header>
    );
}