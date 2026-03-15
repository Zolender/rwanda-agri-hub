"use server";

import prisma from "@/app/lib/db";
import { auth } from "@/app/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// 1. Schema matching your CSV headers exactly
const RowSchema = z.object({
    product_id: z.string().min(1),
    category_id: z.string().min(1),
    unit_of_measure: z.string().default("Kg"),
    // Cleaning numeric strings (removing commas, currency, etc.)
    unit_cost_rwf: z.preprocess((v) => Number(String(v).replace(/[^0-9.-]+/g, "")), z.number()),
    selling_price_rwf: z.preprocess((v) => Number(String(v).replace(/[^0-9.-]+/g, "")), z.number()),
    landed_cost_rwf: z.preprocess((v) => Number(String(v).replace(/[^0-9.-]+/g, "")), z.number()),
    product_stock: z.preprocess((v) => parseInt(String(v)) || 0, z.number().int()),
    reorder_point: z.preprocess((v) => parseInt(String(v)) || 0, z.number().int()),
    lead_time_days: z.preprocess((v) => parseInt(String(v)) || 0, z.number().int()),
    // Transaction headers
    movement_type: z.enum(["Sale", "Adjustment", "Purchase"]).default("Purchase"),
    quantity_ordered: z.preprocess((v) => parseInt(String(v)) || 0, z.number().int().optional()),
    quantity_fulfilled: z.preprocess((v) => parseInt(String(v)) || 0, z.number().int()),
    remaining_stock: z.preprocess((v) => parseInt(String(v)) || 0, z.number().int()),
    order_id: z.string().default("INITIAL_IMPORT"),
    region: z.string().default("Kigali Hub"),
    customer_id: z.string().optional().nullable(),
    supplier_id: z.string().optional().nullable(),
    po_id: z.string().optional().nullable(),
});

export async function importInventoryAction(data: any[]) {
    const session = await auth();
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "MANAGER")) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // 1. Map the data through Zod first to catch errors early
        const validatedRows = data
        .filter(row => row.product_id)
        .map(row => RowSchema.parse(row));

        // 2. Run the upserts. Using Promise.all handles them in parallel 
        // without the strict 5-second transaction timeout.
        const results = await Promise.all(
        validatedRows.map((v) => 
            prisma.product.upsert({
            where: { id: v.product_id },
            update: {
                quantity: v.product_stock,
                unitCostRwf: v.unit_cost_rwf,
                sellingPriceRwf: v.selling_price_rwf,
                landedCostRwf: v.landed_cost_rwf,
            },
            create: {
                id: v.product_id,
                categoryId: v.category_id,
                unitOfMeasure: v.unit_of_measure,
                unitCostRwf: v.unit_cost_rwf,
                sellingPriceRwf: v.selling_price_rwf,
                landedCostRwf: v.landed_cost_rwf,
                reorderPointUnits: v.reorder_point,
                leadTimeBufferDays: v.lead_time_days,
                quantity: v.product_stock,
                transactions: {
                create: {
                    orderId: v.order_id,
                    movementType: v.movement_type,
                    quantityOrderedUnits: v.quantity_ordered,
                    quantityFulfilledUnits: v.quantity_fulfilled,
                    remainingStockUnits: v.remaining_stock,
                    region: v.region,
                    customerId: v.customer_id,
                    supplierId: v.supplier_id,
                    poId: v.po_id,
                    transactionDate: new Date(),
                },
                },
            },
            })
        )
    );

    revalidatePath("/dashboard");
    return { success: true, count: results.length };
    } catch (error: any) {
        console.error("Import Error Details:", error);
        return { success: false, error: error.message || "Validation failed on one or more rows." };
    }
}