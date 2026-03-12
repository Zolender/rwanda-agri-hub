-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('Sale', 'Adjustment', 'Purchase');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "unitOfMeasure" TEXT NOT NULL,
    "unitCostRwf" DOUBLE PRECISION NOT NULL,
    "sellingPriceRwf" DOUBLE PRECISION NOT NULL,
    "landedCostRwf" DOUBLE PRECISION NOT NULL,
    "reorderPointUnits" INTEGER NOT NULL,
    "leadTimeBufferDays" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "movementType" "MovementType" NOT NULL,
    "quantityOrderedUnits" INTEGER,
    "quantityFulfilledUnits" INTEGER NOT NULL,
    "remainingStockUnits" INTEGER NOT NULL,
    "customerId" TEXT,
    "supplierId" TEXT,
    "poId" TEXT,
    "region" TEXT NOT NULL,
    "lostSaleQtyUnits" INTEGER NOT NULL DEFAULT 0,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
