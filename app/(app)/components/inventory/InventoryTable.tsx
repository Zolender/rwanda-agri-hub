'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { useDarkMode } from '../DarkModeContext'; // ← NEW

interface Product {
    id: string;
    categoryId: string;
    quantity: number;
    unitOfMeasure: string;
    sellingPriceRwf: number;
    reorderPointUnits: number;
}

interface Props {
    initialData: Product[];
    totalPages: number;
    currentPage: number;
}

export default function InventoryTable({ initialData, totalPages, currentPage }: Props) {
    const { isDark } = useDarkMode(); // ← NEW
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
            params.set('page', '1');
        } else {
            params.delete('query');
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    const changePage = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
                {/* ↓ icon color adapts */}
                <Search
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-stone-500' : 'text-slate-400'}`}
                    size={18}
                />
                {/* ↓ input bg/border/text adapts */}
                <input
                    type="text"
                    placeholder="Search by ID or Category..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl border focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all ${
                        isDark
                            ? 'bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-500'
                            : 'bg-white border-slate-200 text-slate-700 placeholder:text-slate-400'
                    }`}
                />
            </div>

            {/* Table Section */}
            {/* ↓ wrapper bg/border adapts */}
            <div className={`border rounded-3xl overflow-hidden shadow-sm ${
                isDark ? 'bg-stone-900 border-stone-700' : 'bg-white border-slate-100'
            }`}>
                <table className="w-full text-left border-collapse">
                    <thead>
                        {/* ↓ header row bg/border adapts */}
                        <tr className={`border-b ${
                            isDark ? 'bg-stone-800 border-stone-700' : 'bg-slate-50/50 border-slate-100'
                        }`}>
                            {/* ↓ header text adapts */}
                            {['Product ID', 'Category', 'Current Stock', 'Price (RWF)', 'Status'].map((h, i) => (
                                <th
                                    key={h}
                                    className={`px-6 py-4 text-xs font-bold uppercase tracking-wider ${
                                        i === 4 ? 'text-right' : ''
                                    } ${isDark ? 'text-stone-500' : 'text-slate-400'}`}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {/* ↓ tbody divider adapts */}
                    <tbody className={`divide-y ${isDark ? 'divide-stone-800' : 'divide-slate-50'}`}>
                        {initialData.map((item) => {
                            const isLowStock = item.quantity <= item.reorderPointUnits;
                            return (
                                // ↓ row hover adapts
                                <tr key={item.id} className={`transition-colors group ${
                                    isDark ? 'hover:bg-stone-800/50' : 'hover:bg-slate-50/50'
                                }`}>
                                    {/* ↓ all cell text colors adapt */}
                                    <td className={`px-6 py-4 font-medium ${isDark ? 'text-stone-200' : 'text-slate-700'}`}>
                                        {item.id}
                                    </td>
                                    <td className={`px-6 py-4 ${isDark ? 'text-stone-400' : 'text-slate-500'}`}>
                                        {item.categoryId}
                                    </td>
                                    <td className={`px-6 py-4 ${isDark ? 'text-stone-300' : 'text-slate-600'}`}>
                                        {item.quantity}{' '}
                                        <span className={`text-xs ${isDark ? 'text-stone-500' : 'text-slate-400'}`}>
                                            {item.unitOfMeasure}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 font-mono ${isDark ? 'text-stone-300' : 'text-slate-600'}`}>
                                        {item.sellingPriceRwf.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {isLowStock ? (
                                            <span className="inline-flex items-center space-x-1 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100">
                                                <AlertTriangle size={12} />
                                                <span>Low Stock</span>
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                                                Healthy
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2 py-4">
                {/* ↓ page text adapts */}
                <p className={`text-sm ${isDark ? 'text-stone-400' : 'text-slate-500'}`}>
                    Page{' '}
                    <span className={`font-bold ${isDark ? 'text-stone-100' : 'text-slate-800'}`}>
                        {currentPage}
                    </span>{' '}
                    of {totalPages}
                </p>
                <div className="flex space-x-2">
                    {/* ↓ pagination buttons adapt */}
                    <button
                        disabled={currentPage <= 1}
                        onClick={() => changePage(currentPage - 1)}
                        className={`p-2 border rounded-xl disabled:opacity-30 transition-all ${
                            isDark
                                ? 'border-stone-700 hover:bg-stone-800 text-stone-300'
                                : 'border-slate-200 hover:bg-white text-slate-600'
                        }`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        disabled={currentPage >= totalPages}
                        onClick={() => changePage(currentPage + 1)}
                        className={`p-2 border rounded-xl disabled:opacity-30 transition-all ${
                            isDark
                                ? 'border-stone-700 hover:bg-stone-800 text-stone-300'
                                : 'border-slate-200 hover:bg-white text-slate-600'
                        }`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}