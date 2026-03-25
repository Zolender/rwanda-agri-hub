import prisma from "@/app/lib/db";
import { formatDistanceToNow, format } from "date-fns";
import FiltersBar from "@/app/(app)/components/transactions/FiltersBar";

type SearchParams = {
    page?: string;
    movementType?: string;
    region?: string;
    productId?: string;
    from?: string;
    to?: string;
};

export default async function TransactionsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>; // ← Changed to Promise
}) {
    // ← Await searchParams
    const params = await searchParams;
    
    const page = parseInt(params.page || '1');
    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    // Build where clause from filters
    const where: any = {};
    
    if (params.movementType) {
        where.movementType = params.movementType;
    }
    
    if (params.region) {
        where.region = {
            contains: params.region,
            mode: 'insensitive'
        };
    }

    if (params.productId) {
        where.productId = {
            contains: params.productId,
            mode: 'insensitive'
        };
    }
    
    if (params.from || params.to) {
        where.transactionDate = {};
        if (params.from) {
            where.transactionDate.gte = new Date(params.from);
        }
        if (params.to) {
            // Set to end of day
            const toDate = new Date(params.to);
            toDate.setHours(23, 59, 59, 999);
            where.transactionDate.lte = toDate;
        }
    }

    // Fetch transactions with pagination
    const [transactions, totalCount] = await Promise.all([
        prisma.transaction.findMany({
            where,
            include: {
                product: {
                    select: {
                        id: true,
                        categoryId: true,
                        unitOfMeasure: true
                    }
                }
            },
            orderBy: {
                transactionDate: 'desc'
            },
            take: pageSize,
            skip
        }),
        prisma.transaction.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    // Helper to build pagination links
    const buildPaginationLink = (newPage: number) => {
        const urlParams = new URLSearchParams();
        if (params.movementType) urlParams.set('movementType', params.movementType);
        if (params.region) urlParams.set('region', params.region);
        if (params.productId) urlParams.set('productId', params.productId);
        if (params.from) urlParams.set('from', params.from);
        if (params.to) urlParams.set('to', params.to);
        urlParams.set('page', newPage.toString());
        return `/transactions?${urlParams.toString()}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
                <p className="text-sm text-slate-500 mt-1">
                    View and filter all inventory movements
                </p>
            </div>

            {/* Filters Section */}
            <FiltersBar totalCount={totalCount} />

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    Product ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    Quantity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    Stock After
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    Region
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="text-slate-500">
                                            <p className="text-lg font-medium mb-1">No transactions found</p>
                                            <p className="text-sm">Try adjusting your filters or import some data</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((txn) => (
                                    <tr key={txn.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-900">
                                                {format(txn.transactionDate, 'MMM d, yyyy')}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {formatDistanceToNow(txn.transactionDate, { addSuffix: true })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                            {txn.product.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {txn.product.categoryId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                txn.movementType === 'Sale' ? 'bg-red-100 text-red-800' :
                                                txn.movementType === 'Purchase' ? 'bg-green-100 text-green-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {txn.movementType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                            {txn.quantityOrderedUnits.toLocaleString()} {txn.product.unitOfMeasure}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                            {txn.remainingStockUnits.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {txn.region}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-slate-50 border-t flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                            Page {page} of {totalPages} ({totalCount.toLocaleString()} total)
                        </div>
                        <div className="flex gap-2">
                            {page > 1 ? (
                                <a
                                    href={buildPaginationLink(page - 1)}
                                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Previous
                                </a>
                            ) : (
                                <span className="px-4 py-2 border border-slate-200 text-slate-400 rounded-lg cursor-not-allowed">
                                    Previous
                                </span>
                            )}
                            
                            {page < totalPages ? (
                                <a
                                    href={buildPaginationLink(page + 1)}
                                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Next
                                </a>
                            ) : (
                                <span className="px-4 py-2 border border-slate-200 text-slate-400 rounded-lg cursor-not-allowed">
                                    Next
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}