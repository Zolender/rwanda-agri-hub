import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { auth } from '@/app/lib/auth';
import { format } from 'date-fns';

export async function GET(request: NextRequest) {
    // Check authentication
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;

    // Build where clause from URL params
    const where: any = {};
    
    if (searchParams.get('movementType')) {
        where.movementType = searchParams.get('movementType');
    }
    
    if (searchParams.get('region')) {
        where.region = {
            contains: searchParams.get('region')!,
            mode: 'insensitive'
        };
    }

    if (searchParams.get('productId')) {
        where.productId = {
            contains: searchParams.get('productId')!,
            mode: 'insensitive'
        };
    }
    
    if (searchParams.get('from') || searchParams.get('to')) {
        where.transactionDate = {};
        if (searchParams.get('from')) {
            where.transactionDate.gte = new Date(searchParams.get('from')!);
        }
        if (searchParams.get('to')) {
            const toDate = new Date(searchParams.get('to')!);
            toDate.setHours(23, 59, 59, 999);
            where.transactionDate.lte = toDate;
        }
    }

    // Fetch all matching transactions (no pagination for export)
    const transactions = await prisma.transaction.findMany({
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
        take: 10000 //limit for now oo
    });

    // Build CSV
    const headers = [
        'Transaction Date',
        'Product ID',
        'Category',
        'Movement Type',
        'Quantity Ordered',
        'Remaining Stock',
        'Region',
        'Order ID',
        'Unit of Measure'
    ];

    const rows = transactions.map(txn => [
        format(txn.transactionDate, 'yyyy-MM-dd HH:mm:ss'),
        txn.product.id,
        txn.product.categoryId,
        txn.movementType,
        txn.quantityOrderedUnits,
        txn.remainingStockUnits,
        txn.region,
        txn.orderId,
        txn.product.unitOfMeasure
    ]);

    const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Return CSV file
    return new NextResponse(csv, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="transactions-${format(new Date(), 'yyyy-MM-dd')}.csv"`
        }
    });
}