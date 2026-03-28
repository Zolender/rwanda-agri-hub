import prisma from "@/app/lib/db";
import AnimatedStatCard from "@/app/(app)/components/dashboard/AnimatedStatCard";
import StockOnHandTable from "../components/dashboard/StockOnHandTable";
import { formatDistanceToNow } from "date-fns";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { auth } from "@/app/lib/auth";

export default async function DashboardPage() {
    const session = await auth();
    const userRole = (session?.user?.role ?? 'ANALYST') as 'ADMIN' | 'MANAGER' | 'ANALYST';


    const [totalProducts, totalTransactions, products, latestTransaction] = await Promise.all([
        prisma.product.count(),
        prisma.transaction.count(),
        prisma.product.findMany({
            select: {
                id: true,
                categoryId: true,
                unitOfMeasure: true,
                unitCostRwf: true,
                sellingPriceRwf: true,
                quantity: true,
                reorderPointUnits: true
            },
            orderBy: {
                id: 'asc'
            }
        }),
        prisma.transaction.findFirst({
            orderBy: {
                createdAt: "desc"
            },
            select: {
                createdAt: true
            }
        })
    ]);

    const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.unitCostRwf), 0);
    const lowStockItems = products.filter(p => p.quantity <= p.reorderPointUnits).length;
    const lastUpdated = latestTransaction ? formatDistanceToNow(latestTransaction.createdAt, { addSuffix: true }) : "Never";

    return (
        <div className="space-y-8">
            <DashboardHeader lastUpdated={lastUpdated} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatedStatCard 
                    title="Total Products" 
                    value={totalProducts} 
                    iconName="Package"
                    description="Unique items in catalog"
                />

                <AnimatedStatCard 
                    title="Low Stock Alerts" 
                    value={lowStockItems}
                    iconName="AlertTriangle"
                    description="Items needing reorder"
                    trend={{ value: lowStockItems > 0 ? 10 : 0, isPositive: false }}
                />

                <AnimatedStatCard 
                    title="Inventory Value" 
                    value={`${totalValue.toLocaleString()} Rwf`} 
                    iconName="BadgeDollarSign"
                    description="Based on current stock levels"
                />

                <AnimatedStatCard 
                    title="Total Movements" 
                    value={totalTransactions} 
                    iconName="Activity"
                    description="Records in ledger"
                />
            </div>

            <div>
                <StockOnHandTable products={products} userRole={userRole} />
            </div>
        </div>
    );
}