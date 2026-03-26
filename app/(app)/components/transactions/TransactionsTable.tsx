'use client';

import { motion } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, FileText, ArrowUpDown } from 'lucide-react';

type Transaction = {
    id: string;
    transactionDate: Date;
    movementType: string;
    quantityOrderedUnits: number;
    remainingStockUnits: number;
    region: string;
    product: {
        id: string;
        categoryId: string;
        unitOfMeasure: string;
    };
};

type TransactionsTableProps = {
    transactions: Transaction[];
    page: number;
    totalPages: number;
    totalCount: number;
    buildPaginationLink: (page: number) => string;
};

export default function TransactionsTable({
    transactions,
    page,
    totalPages,
    totalCount,
    buildPaginationLink
}: TransactionsTableProps) {
    
    const getMovementTypeColor = (type: string) => {
        switch (type) {
            case 'Sale':
                return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'Purchase':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Adjustment':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            default:
                return 'bg-stone-100 text-stone-700 border-stone-200';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden"
        >
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-stone-50 border-b border-stone-200">
                        <tr>
                            {['Date', 'Product ID', 'Category', 'Type', 'Quantity', 'Stock After', 'Region'].map((header, i) => (
                                <th
                                    key={header}
                                    className="px-6 py-4 text-left text-xs font-bold text-stone-700 uppercase tracking-wider"
                                >
                                    <div className="flex items-center gap-2">
                                        {header}
                                        {i < 2 && <ArrowUpDown className="w-3 h-3 text-stone-400" />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-16 text-center">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center gap-3"
                                    >
                                        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center">
                                            <FileText className="w-8 h-8 text-stone-400" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-stone-900 mb-1">No transactions found</p>
                                            <p className="text-sm text-stone-500">Try adjusting your filters or import some data</p>
                                        </div>
                                    </motion.div>
                                </td>
                            </tr>
                        ) : (
                            transactions.map((txn, index) => (
                                <motion.tr
                                    key={txn.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03, duration: 0.3 }}
                                    className="hover:bg-stone-50 transition-colors group"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-stone-900">
                                            {format(txn.transactionDate, 'MMM d, yyyy')}
                                        </div>
                                        <div className="text-xs text-stone-500">
                                            {formatDistanceToNow(txn.transactionDate, { addSuffix: true })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-mono font-medium text-stone-900 bg-stone-50 px-2 py-1 rounded group-hover:bg-stone-100 transition-colors">
                                            {txn.product.id}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                                        {txn.product.categoryId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getMovementTypeColor(txn.movementType)}`}>
                                            {txn.movementType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-stone-900">
                                        {txn.quantityOrderedUnits.toLocaleString()} <span className="text-stone-500 font-normal">{txn.product.unitOfMeasure}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-stone-900">
                                        {txn.remainingStockUnits.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                                        {txn.region}
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-stone-600">
                        Showing <span className="font-semibold text-stone-900">{(page - 1) * 50 + 1}</span> to{' '}
                        <span className="font-semibold text-stone-900">{Math.min(page * 50, totalCount)}</span> of{' '}
                        <span className="font-semibold text-stone-900">{totalCount.toLocaleString()}</span> transactions
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* Previous Button */}
                        {page > 1 ? (
                            <Link
                                href={buildPaginationLink(page - 1)}
                                className="flex items-center gap-2 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-white hover:border-stone-400 transition-all font-medium text-sm"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </Link>
                        ) : (
                            <span className="flex items-center gap-2 px-4 py-2 border border-stone-200 text-stone-400 rounded-lg cursor-not-allowed text-sm">
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </span>
                        )}

                        {/* Page Numbers */}
                        <div className="hidden sm:flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (page <= 3) {
                                    pageNum = i + 1;
                                } else if (page >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = page - 2 + i;
                                }

                                const isActive = pageNum === page;

                                return (
                                    <Link
                                        key={pageNum}
                                        href={buildPaginationLink(pageNum)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold text-sm transition-all ${
                                            isActive
                                                ? 'bg-emerald-600 text-white shadow-sm'
                                                : 'text-stone-600 hover:bg-stone-100'
                                        }`}
                                    >
                                        {pageNum}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Next Button */}
                        {page < totalPages ? (
                            <Link
                                href={buildPaginationLink(page + 1)}
                                className="flex items-center gap-2 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-white hover:border-stone-400 transition-all font-medium text-sm"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        ) : (
                            <span className="flex items-center gap-2 px-4 py-2 border border-stone-200 text-stone-400 rounded-lg cursor-not-allowed text-sm">
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </span>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
}