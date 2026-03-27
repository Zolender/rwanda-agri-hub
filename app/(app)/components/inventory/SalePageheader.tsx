"use client";

import { History, ShieldCheck } from "lucide-react";
import { useDarkMode } from "../DarkModeContext";

export default function SalePageHeader() {
    const { isDark } = useDarkMode();

    return (
        <>
            <header className="flex flex-col space-y-1">
                <div className={`flex items-center space-x-2 text-xs font-medium uppercase tracking-widest ${
                    isDark ? 'text-stone-500' : 'text-slate-400'
                }`}>
                    <span>Inventory</span>
                    <span>/</span>
                    <span className="text-emerald-500">Stock Out</span>
                </div>
                <h1
                    className={`text-3xl font-black tracking-tight ${
                        isDark ? 'text-stone-100' : 'text-slate-900'
                    }`}
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                    Record a Sale
                </h1>
                <p className={`text-sm ${isDark ? 'text-stone-400' : 'text-slate-500'}`}>
                    Search for a product SKU to deduct stock and update the ledger.
                </p>
            </header>

        </>
    );
}

export function SalePageSidebar() {
    const { isDark } = useDarkMode();

    return (
        <div className="space-y-6">
            <div className={`p-6 rounded-3xl shadow-lg ${
                isDark ? 'bg-stone-800 text-stone-100' : 'bg-slate-900 text-white'
            }`}>
                <div className="flex items-center space-x-3 mb-4">
                    <History className="text-emerald-400" size={20} />
                    <h3 className="font-semibold">Quick Tip</h3>
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-300' : 'text-slate-300'}`}>
                    Always verify the <strong>Product Preview</strong> before confirming.
                    If the stock is below 10 units, the system will highlight it in amber.
                </p>
            </div>

            <div className={`p-6 rounded-3xl border ${
                isDark
                    ? 'bg-emerald-950 border-emerald-900'
                    : 'bg-emerald-50 border-emerald-100'
            }`}>
                <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <h4 className={`font-bold text-sm uppercase ${
                        isDark ? 'text-emerald-400' : 'text-emerald-800'
                    }`}>
                        Inventory Health
                    </h4>
                </div>
                <p className={`text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    Any sale recorded here will instantly reflect on the main dashboard analytics.
                </p>
            </div>
        </div>
    );
}