import prisma from "@/app/lib/db";
import StatCard from "@/app/app/components/dashboard/StatCard";
import { Package, AlertTriangle, BadgeDollarSign, Activity } from "lucide-react";

export default async function DashboardPage() {
    const [totalProducts, totalTransactions, inventoryData] = await Promise.all([
        prisma.product.count(),
        prisma.transaction.count(),
        prisma.product.aggregate({
        _sum: {
            unitCostRwf: true,
            quantity: true // Make sure you added 'quantity' to the schema!
        }
        })
]);

// Calculate the total value (Sum of costs)
const totalValue = inventoryData._sum.unitCostRwf || 0;

    const lowStockItems = await prisma.product.count({
        where: {
            quantity: {
            lt: prisma.product.fields.reorderPointUnits
            }
        }
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Total Unique Products */}
            <StatCard 
                title="Total Products" 
                value={totalProducts} 
                icon={Package} 
                description="Unique items in catalog"
            />

            {/* 2. Low Stock - Using our new AlertTriangle icon! */}
            <StatCard 
                title="Low Stock Alerts" 
                value={lowStockItems} // This will work once you add the quantity field
                icon={AlertTriangle} 
                description="Items needing reorder"
                trend={{ value: lowStockItems > 0 ? 10 : 0, isPositive: false }}
            />

            {/* 3. Total Inventory Value (Quantity * Unit Cost) */}
            <StatCard 
                title="Inventory Value" 
                value={`${totalValue.toLocaleString()} Rwf`} 
                icon={BadgeDollarSign} 
                description="Based on current stock levels"
            />

            {/* 4. Movements / Activity */}
            <StatCard 
                title="Total Movements" 
                value={totalTransactions} 
                icon={Activity} 
                description="Records in ledger"
            />
        </div>
    );
}