"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, Filter, X, Download } from "lucide-react";

type FiltersBarProps = {
    totalCount: number;
};

export default function FiltersBar({ totalCount }: FiltersBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Read current filters from URL
    const [movementType, setMovementType] = useState(searchParams.get('movementType') || '');
    const [region, setRegion] = useState(searchParams.get('region') || '');
    const [productSearch, setProductSearch] = useState(searchParams.get('productId') || '');
    const [dateFrom, setDateFrom] = useState(searchParams.get('from') || '');
    const [dateTo, setDateTo] = useState(searchParams.get('to') || '');

    // Update URL with new filters
    const applyFilters = () => {
        const params = new URLSearchParams();
        
        if (movementType) params.set('movementType', movementType);
        if (region) params.set('region', region);
        if (productSearch) params.set('productId', productSearch);
        if (dateFrom) params.set('from', dateFrom);
        if (dateTo) params.set('to', dateTo);
        
        // Reset to page 1 when filters change
        params.set('page', '1');

        startTransition(() => {
            router.push(`/transactions?${params.toString()}`);
        });
    };

    // Clear all filters
    const clearFilters = () => {
        setMovementType('');
        setRegion('');
        setProductSearch('');
        setDateFrom('');
        setDateTo('');
        
        startTransition(() => {
            router.push('/transactions');
        });
    };

    // Check if any filters are active
    const hasActiveFilters = movementType || region || productSearch || dateFrom || dateTo;

    // Export to CSV
    const exportToCSV = () => {
        // Build the export URL with current filters
        const params = new URLSearchParams();
        if (movementType) params.set('movementType', movementType);
        if (region) params.set('region', region);
        if (productSearch) params.set('productId', productSearch);
        if (dateFrom) params.set('from', dateFrom);
        if (dateTo) params.set('to', dateTo);
        params.set('export', 'csv');

        window.location.href = `/api/transactions/export?${params.toString()}`;
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-slate-500" />
                    <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
                    {hasActiveFilters && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                            Active
                        </span>
                    )}
                </div>
                
                <div className="flex gap-2">
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            disabled={isPending}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Clear All
                        </button>
                    )}
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Filter Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Product ID Search */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Product ID
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by ID..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                {/* Movement Type */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Movement Type
                    </label>
                    <select
                        value={movementType}
                        onChange={(e) => setMovementType(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="">All Types</option>
                        <option value="Sale">Sale</option>
                        <option value="Purchase">Purchase</option>
                        <option value="Adjustment">Adjustment</option>
                    </select>
                </div>

                {/* Region */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Region
                    </label>
                    <input
                        type="text"
                        placeholder="Enter region..."
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                {/* Date From */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        From Date
                    </label>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                {/* Date To */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        To Date
                    </label>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
            </div>

            {/* Apply Button */}
            <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-slate-500">
                    {totalCount.toLocaleString()} transaction{totalCount !== 1 ? 's' : ''} found
                </p>
                <button
                    onClick={applyFilters}
                    disabled={isPending}
                    className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                    {isPending ? 'Applying...' : 'Apply Filters'}
                </button>
            </div>
        </div>
    );
}