"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, Filter, X, Download, Calendar, MapPin, Package, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

    // Remove individual filter
    const removeFilter = (filterName: string) => {
        const updates: Record<string, () => void> = {
            movementType: () => setMovementType(''),
            region: () => setRegion(''),
            productId: () => setProductSearch(''),
            dateRange: () => {
                setDateFrom('');
                setDateTo('');
            }
        };
        
        updates[filterName]?.();
        
        // Auto-apply after removing
        setTimeout(() => {
            const params = new URLSearchParams();
            if (filterName !== 'movementType' && movementType) params.set('movementType', movementType);
            if (filterName !== 'region' && region) params.set('region', region);
            if (filterName !== 'productId' && productSearch) params.set('productId', productSearch);
            if (filterName !== 'dateRange') {
                if (dateFrom) params.set('from', dateFrom);
                if (dateTo) params.set('to', dateTo);
            }
            params.set('page', '1');
            
            startTransition(() => {
                router.push(`/transactions?${params.toString()}`);
            });
        }, 0);
    };

    // Check if any filters are active
    const hasActiveFilters = movementType || region || productSearch || dateFrom || dateTo;

    // Export to CSV
    const exportToCSV = () => {
        const params = new URLSearchParams();
        if (movementType) params.set('movementType', movementType);
        if (region) params.set('region', region);
        if (productSearch) params.set('productId', productSearch);
        if (dateFrom) params.set('from', dateFrom);
        if (dateTo) params.set('to', dateTo);
        params.set('export', 'csv');

        window.location.href = `/api/transactions/export?${params.toString()}`;
    };

    // Active filter pills
    const activeFilters = [
        { key: 'movementType', label: movementType, icon: Filter },
        { key: 'region', label: region, icon: MapPin },
        { key: 'productId', label: `ID: ${productSearch}`, icon: Package },
        { key: 'dateRange', label: dateFrom && dateTo ? `${dateFrom} → ${dateTo}` : dateFrom || dateTo, icon: Calendar }
    ].filter(f => f.label);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 space-y-5"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 rounded-xl">
                        <Filter className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-stone-900">Filters</h2>
                        <p className="text-xs text-stone-500">
                            {totalCount.toLocaleString()} transaction{totalCount !== 1 ? 's' : ''} found
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {hasActiveFilters && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={clearFilters}
                            disabled={isPending}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Clear All
                        </motion.button>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export CSV</span>
                    </motion.button>
                </div>
            </div>

            {/* Active Filter Pills */}
            <AnimatePresence>
                {activeFilters.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2"
                    >
                        {activeFilters.map((filter) => {
                            const Icon = filter.icon;
                            return (
                                <motion.div
                                    key={filter.key}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm rounded-full border border-emerald-200"
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    <span className="font-medium">{filter.label}</span>
                                    <button
                                        onClick={() => removeFilter(filter.key)}
                                        className="hover:bg-emerald-100 rounded-full p-0.5 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filter Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Product ID Search */}
                <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-2 uppercase tracking-wide">
                        Product ID
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search by ID..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                            className="w-full pl-10 pr-3 py-2.5 border border-stone-200 rounded-xl bg-white placeholder:text-stone-400 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Movement Type */}
                <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-2 uppercase tracking-wide">
                        Movement Type
                    </label>
                    <select
                        value={movementType}
                        onChange={(e) => setMovementType(e.target.value)}
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-xl bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                    >
                        <option value="">All Types</option>
                        <option value="Sale">Sale</option>
                        <option value="Purchase">Purchase</option>
                        <option value="Adjustment">Adjustment</option>
                    </select>
                </div>

                {/* Region */}
                <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-2 uppercase tracking-wide">
                        Region
                    </label>
                    <input
                        type="text"
                        placeholder="Enter region..."
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-xl bg-white placeholder:text-stone-400 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                    />
                </div>

                {/* Date From */}
                <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-2 uppercase tracking-wide">
                        From Date
                    </label>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-xl bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                    />
                </div>

                {/* Date To */}
                <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-2 uppercase tracking-wide">
                        To Date
                    </label>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-xl bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                    />
                </div>
            </div>

            {/* Apply Button */}
            <div className="flex justify-end pt-2">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={applyFilters}
                    disabled={isPending}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors font-semibold text-sm flex items-center gap-2 shadow-sm"
                >
                    {isPending ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            Applying...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            Apply Filters
                        </>
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
}