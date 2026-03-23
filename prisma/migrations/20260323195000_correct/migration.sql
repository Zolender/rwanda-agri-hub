/*
  Warnings:

  - You are about to drop the column `fulfillmentRation` on the `TransactionMetrics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TransactionMetrics" DROP COLUMN "fulfillmentRation",
ADD COLUMN     "fulfillmentRatio" DOUBLE PRECISION;
