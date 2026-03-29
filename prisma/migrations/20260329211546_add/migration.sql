-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Transaction_productId_idx" ON "Transaction"("productId");

-- CreateIndex
CREATE INDEX "Transaction_movementType_idx" ON "Transaction"("movementType");

-- CreateIndex
CREATE INDEX "Transaction_transactionDate_idx" ON "Transaction"("transactionDate");

-- CreateIndex
CREATE INDEX "Transaction_region_idx" ON "Transaction"("region");

-- CreateIndex
CREATE INDEX "Transaction_productId_transactionDate_idx" ON "Transaction"("productId", "transactionDate");
