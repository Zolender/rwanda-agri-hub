import prisma from "@/app/lib/db";
import StatCard from "@/app/(app)/components/dashboard/StatCard";
import { Package, AlertTriangle, BadgeDollarSign, Activity } from "lucide-react";
import StockOnHandTable from "../components/dashboard/StockOnHandTable";
import {formatDistanceToNow} from "date-fns";
import DashboardHeader from "../components/dashboard/DashboardHeader";

export default async function DashboardPage() {
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
                createdAt : "desc"
            },
            select: {
                createdAt : true
            }
        })
]);

// const totalValue = inventoryData._sum.unitCostRwf || 0;



const totalValue = products.reduce( (sum, p) => sum + (p.quantity * p.unitCostRwf), 0)



const lowStockItems = products.filter( p => p.quantity<= p.reorderPointUnits).length

const lastUpdated = latestTransaction ? formatDistanceToNow(latestTransaction.createdAt, { addSuffix: true}) : "Never";

    return (
        <div className="space-y-6">
            
            <DashboardHeader lastUpdated={lastUpdated}/>


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
            <div>
                <h2 className="text-2xl font-bold mb-4">
                    <StockOnHandTable products={products}/>
                </h2>
            </div>
        </div>
    );
}