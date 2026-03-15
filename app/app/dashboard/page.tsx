import prisma from "@/app/lib/db";
import StatCard from "@/app/app/components/dashboard/StatCard";
import { Package, AlertTriangle, BadgeDollarSign, Activity } from "lucide-react";

export default async function DashboardPage() {
    const [totalProducts, totalTransactions, totalValue] = await Promise.all([
        prisma.product.count(),
        prisma.transaction.count(),
        prisma.product.aggregate({
        _sum: {
            unitCostRwf: true // Total value of one of each product
        }
        })
    ]);

    return (
        <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
            title="Total Products" 
            value={totalProducts} 
            icon={Package} 
            />
            {/* We changed this to Transactions until we fix the quantity field */}
            <StatCard 
            title="Total Movements" 
            value={totalTransactions} 
            icon={Activity} 
            description="Total recorded ledger entries"
            />
            <StatCard 
            title="Inventory Value" 
            value={`${(totalValue._sum.unitCostRwf || 0).toLocaleString()} Rwf`} 
            icon={BadgeDollarSign} 
            />
        </div>
        </div>
    );
}