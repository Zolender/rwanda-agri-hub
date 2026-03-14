'use server'

import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// 1. Matches your ACTUAL Schema fields
const RowSchema = z.object({
    id: z.string().min(1), // This is your SKU/Product ID
    categoryId: z.string().min(1),
    unitOfMeasure: z.string().default("Kg"),
    unitCostRwf: z.preprocess((val) => Number(val), z.number()),
    sellingPriceRwf: z.preprocess((val) => Number(val), z.number()),
    landedCostRwf: z.preprocess((val) => Number(val), z.number()),
    reorderPointUnits: z.preprocess((val) => Number(val), z.number().int()),
    leadTimeBufferDays: z.preprocess((val) => Number(val), z.number().int()),
});

export async function importInventoryAction(data: any[]) {
    const session = await auth();

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGER")) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.$transaction(
        data.map((row) => {
            const validated = RowSchema.parse(row);
            
            return prisma.product.upsert({
            where: { id: validated.id }, // Using 'id' as the unique SKU
            update: {
                unitCostRwf: validated.unitCostRwf,
                sellingPriceRwf: validated.sellingPriceRwf,
                // Add other fields you want to update if the product exists
            },
            create: {
                id: validated.id,
                categoryId: validated.categoryId,
                unitOfMeasure: validated.unitOfMeasure,
                unitCostRwf: validated.unitCostRwf,
                sellingPriceRwf: validated.sellingPriceRwf,
                landedCostRwf: validated.landedCostRwf,
                reorderPointUnits: validated.reorderPointUnits,
                leadTimeBufferDays: validated.leadTimeBufferDays,
            },
            });
        })
        );

        revalidatePath("/dashboard");
        return { success: true, count: data.length };
    } catch (error) {
        console.error("Import Error:", error);
        return { success: false, error: "Data mismatch. Check CSV column names." };
    }
}