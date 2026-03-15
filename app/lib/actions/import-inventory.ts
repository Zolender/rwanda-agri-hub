"use server";

import prisma from "@/app/lib/db";
import { auth } from "@/app/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// 1. Schema mapping all relevant columns from your 20-column CSV
const RowSchema = z.object({
    id: z.string().min(1),
    categoryId: z.string().min(1),
    unitOfMeasure: z.string().default("Kg"),
    // Numeric cleaning: handles "45,000", "500 Rwf", etc.
    unitCostRwf: z.preprocess((v) => Number(String(v).replace(/[^0-9.-]+/g, "")), z.number()),
    sellingPriceRwf: z.preprocess((v) => Number(String(v).replace(/[^0-9.-]+/g, "")), z.number()),
    landedCostRwf: z.preprocess((v) => Number(String(v).replace(/[^0-9.-]+/g, "")), z.number()),
    reorderPointUnits: z.preprocess((v) => parseInt(String(v)), z.number().int()),
    leadTimeBufferDays: z.preprocess((v) => parseInt(String(v)), z.number().int()),
    quantity: z.preprocess((v) => parseInt(String(v)) || 0, z.number().int()),
    // Transaction-specific columns from your CSV
    orderId: z.string().default("INITIAL_IMPORT"),
    region: z.string().default("Kigali Hub"),
    movementType: z.enum(["Sale", "Adjustment", "Purchase"]).default("Purchase"),
    });

export async function importInventoryAction(data: any[]) {
    const session = await auth();
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "MANAGER")) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const results = await prisma.$transaction(
        data.filter(row => row.id).map((row) => {
            const v = RowSchema.parse(row);

            return prisma.product.upsert({
            where: { id: v.id },
            update: {
                quantity: v.quantity, // Updates current stock
                unitCostRwf: v.unitCostRwf,
                sellingPriceRwf: v.sellingPriceRwf,
                landedCostRwf: v.landedCostRwf,
            },
            create: {
                id: v.id,
                categoryId: v.categoryId,
                unitOfMeasure: v.unitOfMeasure,
                unitCostRwf: v.unitCostRwf,
                sellingPriceRwf: v.sellingPriceRwf,
                landedCostRwf: v.landedCostRwf,
                reorderPointUnits: v.reorderPointUnits,
                leadTimeBufferDays: v.leadTimeBufferDays,
                quantity: v.quantity,
                // Create the first history record automatically
                transactions: {
                create: {
                    orderId: v.orderId,
                    movementType: v.movementType,
                    quantityFulfilledUnits: v.quantity,
                    remainingStockUnits: v.quantity,
                    region: v.region,
                    transactionDate: new Date(),
                },
                },
            },
            });
        })
        );

        revalidatePath("/dashboard");
        return { success: true, count: results.length };
    } catch (error: any) {
        console.error("Import Error:", error);
        return { success: false, error: error.message || "Failed to parse CSV rows" };
    }
}