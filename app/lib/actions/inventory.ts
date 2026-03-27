"use server";

import prisma from "@/app/lib/db";
import { auth } from "@/app/lib/auth";
import { revalidatePath } from "next/cache";



export async function getProductPreview(id: string) {
    return await prisma.product.findUnique({
        where: { id },
        select: {
            id: true,
            categoryId: true,
            quantity: true,
            sellingPriceRwf: true,
            unitCostRwf: true,
            unitOfMeasure: true,
            reorderPointUnits: true,
            leadTimeBufferDays: true,
        },
    });
}

export async function getPaginatedInventory(page: number = 1, search: string = "") {
    const pageSize = 15;
    const skip = (page - 1) * pageSize;

    const whereClause = search
        ? {
                OR: [
                    { id: { contains: search, mode: "insensitive" as const } },
                    { categoryId: { contains: search, mode: "insensitive" as const } },
                ],
            }
        : {};

    const [items, totalCount] = await Promise.all([
        prisma.product.findMany({
            where: whereClause,
            take: pageSize,
            skip: skip,
            orderBy: { id: "asc" },
        }),
        prisma.product.count({ where: whereClause }),
    ]);

    return { items, totalPages: Math.ceil(totalCount / pageSize), totalCount };
}



export async function recordSaleAction(
    productId: string,
    quantitySold: number,
    region: string
) {
    // Auth check — any signed-in role can record a sale, but we still require a session
    const session = await auth();
    if (!session) {
        return { success: false, error: "You must be signed in to record a sale." };
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            const product = await tx.product.findUnique({ where: { id: productId } });

            if (!product) throw new Error("Product not found.");
            if (product.quantity < quantitySold) throw new Error("Insufficient stock.");

            const updated = await tx.product.update({
                where: { id: productId },
                data: { quantity: { decrement: quantitySold } },
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
                },
            });

            return updated;
        });

        revalidatePath("/dashboard");
        revalidatePath("/transactions");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}



export async function recordPurchaseAction(
    productId: string,
    quantityReceived: number,
    region: string,
    supplierId?: string
) {
    const session = await auth();

    if (
        !session ||
        (session.user?.role !== "ADMIN" && session.user?.role !== "MANAGER")
    ) {
        return {
            success: false,
            error: "Only Managers and Admins can receive stock.",
        };
    }

    try {
        await prisma.$transaction(async (tx) => {
            const product = await tx.product.findUnique({ where: { id: productId } });
            if (!product) throw new Error("Product not found.");

            const updated = await tx.product.update({
                where: { id: productId },
                data: { quantity: { increment: quantityReceived } },
            });

            await tx.transaction.create({
                data: {
                    productId,
                    movementType: "Purchase",
                    remainingStockUnits: updated.quantity,
                    quantityOrderedUnits: quantityReceived,
                    region,
                    supplierId: supplierId || null,
                    orderId: `PO-${Date.now()}`,
                    transactionDate: new Date(),
                },
            });
        });

        revalidatePath("/dashboard");
        revalidatePath("/transactions");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}


export async function updateProductAction(
    productId: string,
    data: {
        sellingPriceRwf?: number;
        unitCostRwf?: number;
        reorderPointUnits?: number;
        leadTimeBufferDays?: number;
    }
) {
    const session = await auth();

    if (
        !session ||
        (session.user?.role !== "ADMIN" && session.user?.role !== "MANAGER")
    ) {
        return {
            success: false,
            error: "Only Managers and Admins can edit product details.",
        };
    }

    if (Object.keys(data).length === 0) {
        return { success: false, error: "No fields provided to update." };
    }

    try {
        await prisma.product.update({
            where: { id: productId },
            data,
        });

        revalidatePath("/dashboard");
        revalidatePath("/inventory");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}