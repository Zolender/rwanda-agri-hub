import prisma from "@/app/lib/db";
import { formatDistanceToNow } from "date-fns";

type SearchParams = {
    page?: string;
    movementType?: string;
    region?: string;
    from?: string;
    to?: string;
};

export default async function TransactionsPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const page = parseInt(searchParams.page || '1');
    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    // Build where clause from filters
    const where: any = {};
    
    if (searchParams.movementType) {
        where.movementType = searchParams.movementType;
    }
    
    if (searchParams.region) {
        where.region = {
            contains: searchParams.region,
            mode: 'insensitive'
        };
    }
    
    if (searchParams.from || searchParams.to) {
        where.transactionDate = {};
        if (searchParams.from) {
            where.transactionDate.gte = new Date(searchParams.from);
        }
        if (searchParams.to) {
            where.transactionDate.lte = new Date(searchParams.to);
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
                <p className="text-sm text-slate-500 mt-1">
                    {totalCount.toLocaleString()} total movements
                </p>
            </div>

            {/* Filters Section - We'll build this next session */}
            <div className="bg-white rounded-lg shadow p-4">
                <p className="text-slate-500 text-sm">
                    🚧 Filters coming next session (movement type, region, date range, search)
                </p>
            </div>

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
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((txn) => (
                                    <tr key={txn.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                            {formatDistanceToNow(txn.transactionDate, { addSuffix: true })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                            {txn.product.id}
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
                                            {txn.quantityOrderedUnits.toLocaleString()}
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
                <div className="px-6 py-4 bg-slate-50 border-t flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                        Page {page} of {totalPages} ({totalCount.toLocaleString()} total)
                    </div>
                    <div className="flex gap-2">
                        <a
                            href={`/transactions?page=${page - 1}`}
                            className={`px-4 py-2 border rounded-lg ${
                                page <= 1
                                    ? 'border-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            Previous
                        </a>
                        <a
                            href={`/transactions?page=${page + 1}`}
                            className={`px-4 py-2 border rounded-lg ${
                                page >= totalPages
                                    ? 'border-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            Next
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}