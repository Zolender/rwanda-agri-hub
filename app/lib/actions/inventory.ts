"use server";

import prisma from "@/app/lib/db";
import { revalidatePath } from "next/cache";

// This function fetches product details as the admin types
export async function getProductPreview(id: string) {
    return await prisma.product.findUnique({
        where: { id },
        select: {
        id: true,
        categoryId: true,
        quantity: true,
        sellingPriceRwf: true,
        unitOfMeasure: true,
        }
    });
    }

    export async function recordSaleAction(productId: string, quantitySold: number, region: string) {
    try {
        const result = await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({ where: { id: productId } });

        if (!product) throw new Error("Product not found.");
        if (product.quantity < quantitySold) throw new Error("Insufficient stock.");

        const updated = await tx.product.update({
            where: { id: productId },
            data: { quantity: { decrement: quantitySold } }
        });

        await tx.transaction.create({
            data: {
            productId,
            movementType: "Sale",
            quantityFulfilledUnits: quantitySold,
            remainingStockUnits: updated.quantity,
            region,
            orderId: `SALE-${Date.now()}`,
            transactionDate: new Date(),
            }
        });
        return updated;
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}