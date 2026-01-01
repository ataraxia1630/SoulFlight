/*
  Warnings:

  - A unique constraint covering the columns `[blockchain_wallet]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[blockchain_wallet]` on the table `Traveler` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('PAYMENT', 'REFUND', 'TRANSFER', 'CASHBACK', 'AIRDROP');

-- CreateEnum
CREATE TYPE "public"."BlockchainTxStatus" AS ENUM ('PENDING', 'CONFIRMING', 'CONFIRMED', 'FAILED', 'REVERTED');

-- AlterTable
ALTER TABLE "public"."Payment" ADD COLUMN     "blockchain_booking_id" TEXT,
ADD COLUMN     "blockchain_tx_hash" TEXT;

-- AlterTable
ALTER TABLE "public"."Provider" ADD COLUMN     "blockchain_wallet" TEXT;

-- AlterTable
ALTER TABLE "public"."Traveler" ADD COLUMN     "blockchain_wallet" TEXT,
ADD COLUMN     "wallet_balance" DECIMAL(20,8) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."BlockchainTransaction" (
    "id" TEXT NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "from_address" TEXT NOT NULL,
    "to_address" TEXT NOT NULL,
    "amount_tpt" DECIMAL(20,8) NOT NULL,
    "amount_vnd" DECIMAL(15,2) NOT NULL,
    "tx_type" "public"."TransactionType" NOT NULL,
    "status" "public"."BlockchainTxStatus" NOT NULL DEFAULT 'PENDING',
    "block_number" INTEGER,
    "gas_used" TEXT,
    "gas_price" TEXT,
    "error_message" TEXT,
    "payment_id" TEXT,
    "traveler_id" INTEGER,
    "provider_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlockchainTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlockchainTransaction_tx_hash_key" ON "public"."BlockchainTransaction"("tx_hash");

-- CreateIndex
CREATE UNIQUE INDEX "BlockchainTransaction_payment_id_key" ON "public"."BlockchainTransaction"("payment_id");

-- CreateIndex
CREATE INDEX "BlockchainTransaction_from_address_idx" ON "public"."BlockchainTransaction"("from_address");

-- CreateIndex
CREATE INDEX "BlockchainTransaction_to_address_idx" ON "public"."BlockchainTransaction"("to_address");

-- CreateIndex
CREATE INDEX "BlockchainTransaction_tx_hash_idx" ON "public"."BlockchainTransaction"("tx_hash");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_blockchain_wallet_key" ON "public"."Provider"("blockchain_wallet");

-- CreateIndex
CREATE UNIQUE INDEX "Traveler_blockchain_wallet_key" ON "public"."Traveler"("blockchain_wallet");

-- AddForeignKey
ALTER TABLE "public"."BlockchainTransaction" ADD CONSTRAINT "BlockchainTransaction_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "public"."Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlockchainTransaction" ADD CONSTRAINT "BlockchainTransaction_traveler_id_fkey" FOREIGN KEY ("traveler_id") REFERENCES "public"."Traveler"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlockchainTransaction" ADD CONSTRAINT "BlockchainTransaction_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "public"."Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
