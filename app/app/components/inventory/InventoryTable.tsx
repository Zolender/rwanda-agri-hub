'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

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
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');

    // This handles the URL synchronization for searching
    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
        params.set('query', term);
        params.set('page', '1'); // Reset to page 1 on new search
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
            type="text"
            placeholder="Search by ID or Category..."
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-3 text-slate-700 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
        </div>

        {/* Table Section */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Product ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Price (RWF)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {initialData.map((item) => {
                const isLowStock = item.quantity <= item.reorderPointUnits;
                
                return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-700">{item.id}</td>
                    <td className="px-6 py-4 text-slate-500">{item.categoryId}</td>
                    <td className="px-6 py-4 text-slate-600">
                        {item.quantity} <span className="text-xs text-slate-400">{item.unitOfMeasure}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">
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
            <p className="text-sm text-slate-500">
            Page <span className="font-bold text-slate-800">{currentPage}</span> of {totalPages}
            </p>
            <div className="flex space-x-2">
            <button
                disabled={currentPage <= 1}
                onClick={() => changePage(currentPage - 1)}
                className="p-2 border border-slate-200 rounded-xl hover:bg-white disabled:opacity-30 transition-all"
            >
                <ChevronLeft size={20} />
            </button>
            <button
                disabled={currentPage >= totalPages}
                onClick={() => changePage(currentPage + 1)}
                className="p-2 border border-slate-200 rounded-xl hover:bg-white disabled:opacity-30 transition-all"
            >
                <ChevronRight size={20} />
            </button>
            </div>
        </div>
        </div>
    );
}