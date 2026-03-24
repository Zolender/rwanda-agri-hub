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
    console.log("DEBUG: Searching for:", search); // <--- Check your terminal!
    
    const pageSize = 15;
    const skip = (page - 1) * pageSize;

    // Ensure we are searching against the correct fields from your CSV
    const whereClause = search ? {
        OR: [
        { id: { contains: search, mode: 'insensitive' as const } },
        { categoryId: { contains: search, mode: 'insensitive' as const } },
        ],
    } : {};

    const [items, totalCount] = await Promise.all([
        prisma.product.findMany({
        where: whereClause,
        take: pageSize,
        skip: skip,
        orderBy: { id: 'asc' },
        }),
        prisma.product.count({ where: whereClause }),
    ]);

    return { items, totalPages: Math.ceil(totalCount / pageSize), totalCount };
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
            remainingStockUnits: updated.quantity,
            quantityOrderedUnits: quantitySold,
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