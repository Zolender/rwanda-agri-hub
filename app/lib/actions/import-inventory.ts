'use server'

import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// 1. Matches your ACTUAL Schema fields
const RowSchema = z.object({
    id: z.string().min(1),
    categoryId: z.string().min(1),
    unitOfMeasure: z.string().default("Kg"),
    unitCostRwf: z.preprocess((val) => Number(val), z.number()),
    sellingPriceRwf: z.preprocess((val) => Number(val), z.number()),
    landedCostRwf: z.preprocess((val) => Number(val), z.number()),
    reorderPointUnits: z.preprocess((val) => Number(val), z.number().int()),
    leadTimeBufferDays: z.preprocess((val) => Number(val), z.number().int()),
});

export async function importInventoryAction(data: any[]) {
    console.log("1. Action Triggered! Rows received:", data.length);
    
    const session = await auth();

    if (!session) {
        console.log("2. Security Fail: No session found");
        return { success: false, error: "Please log in again." };
    }

    console.log("2b. User Authenticated:", session.user?.email, "Role:", session.user?.role);

    try {
        console.log("3. Validating and Preparing Transaction...");

        // Filter out rows that don't have an ID (like that ghost Row 1)
        const validRows = data.filter(row => row.id && row.id.trim() !== "");
        
        // We create the array of operations FIRST
        const operations = data.map((row, index) => {
            console.log(`Row ${index} data:`, JSON.stringify(row));
            const validated = RowSchema.parse(row);
            
            return prisma.product.upsert({
                where: { id: validated.id },
                update: {
                    unitCostRwf: validated.unitCostRwf,
                    sellingPriceRwf: validated.sellingPriceRwf,
                    // You might want to update stock here too:
                    // reorderPointUnits: validated.reorderPointUnits 
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
        });

        // Execute all operations in one single transaction
        await prisma.$transaction(operations);

        console.log("4. Transaction Successful!");
        revalidatePath("/dashboard");
        revalidatePath("/transactions");
        
        return { success: true, count: data.length };
    } catch (error) {
        console.error("Import Error Detail:", error);
        
        // If Zod fails, it gives a very specific error
        if (error instanceof z.ZodError) {
            return { success: false, error: `Row validation failed: ${error.issues[0].message}` };
        }

        return { success: false, error: "Database error. Check your CSV column names." };
    }
}