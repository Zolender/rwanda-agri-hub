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

export async function getPaginatedInventory(page: number = 1, search: string = "") {
    const pageSize = 15;
    const skip = (page - 1) * pageSize;

    // We fetch the data and the total count simultaneously
    const [items, totalCount] = await Promise.all([
        prisma.product.findMany({
        where: {
            OR: [
            { id: { contains: search, mode: 'insensitive' } },
            { categoryId: { contains: search, mode: 'insensitive' } },
            ],
        },
        take: pageSize,
        skip: skip,
        orderBy: { id: 'asc' },
        }),
        prisma.product.count({
        where: {
            OR: [
            { id: { contains: search, mode: 'insensitive' } },
            { categoryId: { contains: search, mode: 'insensitive' } },
            ],
        }}),
    ]);

    return {
        items,
        totalPages: Math.ceil(totalCount / pageSize),
        totalCount
    };
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