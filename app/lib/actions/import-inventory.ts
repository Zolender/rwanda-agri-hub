"use server";

import prisma from "@/app/lib/db";
import { auth } from "@/app/lib/auth";
import { success, z } from "zod";
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
    quantity_ordered_units: z.preprocess((v) => parseInt(String(v)) || 0, z.number().int().optional()),
    quantity_fulfilled_units: z.preprocess((v) => parseInt(String(v)) || 0, z.number().int()),
    remaining_stock_units: z.preprocess((v) => parseInt(String(v)) || 0, z.number().int()),
    order_id: z.string().default("INITIAL_IMPORT"),
    region: z.string().default("Kigali Hub"),
    customer_id: z.string().optional().nullable(),
    supplier_id: z.string().optional().nullable(),
    po_id: z.string().optional().nullable(),
});

export async function importInventoryAction(data: any[]) {
    const session = await auth()
    if(!session || (session.user?.role !== "ADMIN" && session.user?.role !== "MANAGER")){
        return { success: false, error: "Unauthorized"};
    }
    try{
        //we validate all the rows first

        const validatedRows = data.filter(row => row.product_id).map(row => RowSchema.parse(row));
        const results = []
        const errors = []

        // now we process each row with retry logic
        for(const row of validatedRows){
            let attempts = 0;
            const maxAttempts = 3;
            let lastError= null;
            while(attempts < maxAttempts){
                try{
                    const result = await prisma.product.upsert({
                        where: { id: row.product_id},
                        update: {
                            quantity: row.product_stock,
                            unitCostRwf: row.unit_cost_rwf,
                            sellingPriceRwf: row.selling_price_rwf,
                            landedCostRwf: row.landed_cost_rwf,
                        },
                        create: {
                            id: row.product_id,
                            categoryId: row.category_id,
                            unitOfMeasure: row.unit_of_measure,
                            unitCostRwf: row.unit_cost_rwf,
                            sellingPriceRwf: row.selling_price_rwf,
                            landedCostRwf: row.landed_cost_rwf,
                            reorderPointUnits: row.reorder_point,
                            leadTimeBufferDays: row.lead_time_days,
                            quantity: row.product_stock,
                            transactions: {
                                create: {
                                    orderId: row.order_id,
                                    movementType: row.movement_type,
                                    quantityOrderedUnits: row.quantity_ordered_units,
                                    quantityFulfilledUnits: row.quantity_fulfilled_units,
                                    remainingStockUnits: row.remaining_stock_units,
                                    region: row.region,
                                    customerId: row.customer_id,
                                    supplierId: row.supplier_id,
                                    poId: row.po_id,
                                    transactionDate: new Date(),
                                }
                            }
                        }   
                    })
                    results.push(result)
                    break
                }catch (error: any){
                    attempts++
                    lastError = error;

                    if(attempts>= maxAttempts){
                        //that means the final attempt failed
                        errors.push({
                            product_id: row.product_id,
                            error: error.message || "Unknown error",
                        })
                    }else{
                        //we would wait before retrying with more rest time between retries
                        await new Promise (resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts - 1)))
                    }
                }
            }
        }
        revalidatePath("/dashboard");
        return{
            success: errors.length === 0,
            count: results.length,
            errors: errors.length > 0 ? errors  : undefined,
            message : errors.length > 0? 
                                    `Imported ${results.length} products, ${errors.length} failed.`
                                    : `Successfully imported ${results.length} products.`
        }
    }catch(error: any){
        console.error("Import Error Details:", error);
        return {
            success: false,
            error: error.message || "Validation failed on on or more rows."
        }
    }
}