-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "shipType" TEXT,
    "country" TEXT,
    "portName" TEXT,
    "cargoDescription" TEXT,
    "arrivalTime" TIMESTAMP(3),
    "departureTime" TIMESTAMP(3),
    "portDelays" INTEGER,
    "lastPort" TEXT,
    "nextPort" TEXT,
    "currentStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FXRate" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "usdToRwf" DOUBLE PRECISION,
    "eurToRwf" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3),
    "fxVolatility" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FXRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionMetrics" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "fulfillmentRation" DOUBLE PRECISION,
    "stockPressure" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_transactionId_key" ON "Shipment"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "FXRate_transactionId_key" ON "FXRate"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionMetrics_transactionId_key" ON "TransactionMetrics"("transactionId");

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FXRate" ADD CONSTRAINT "FXRate_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionMetrics" ADD CONSTRAINT "TransactionMetrics_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
