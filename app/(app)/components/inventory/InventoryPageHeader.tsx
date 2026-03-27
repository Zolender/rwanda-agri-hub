"use client";

import { useDarkMode } from "../DarkModeContext";

export default function InventoryPageHeader({ totalCount }: { totalCount: number }) {
    const { isDark } = useDarkMode();

    return (
        <header className="flex justify-between items-end">
            <div>
                <p className={`text-xs font-mono uppercase tracking-widest mb-1 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                    Stock
                </p>
                <h1
                    className={`text-3xl font-black tracking-tight ${
                        isDark ? 'text-stone-100' : 'text-slate-900'
                    }`}
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                    Inventory Master List
                </h1>
                <p className={`text-sm mt-1 ${isDark ? 'text-stone-400' : 'text-slate-500'}`}>
                    Managing {totalCount.toLocaleString()} active products in the hub.
                </p>
            </div>
        </header>
    );
}