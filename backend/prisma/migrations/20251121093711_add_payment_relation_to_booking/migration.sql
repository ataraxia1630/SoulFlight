/*
  Warnings:

  - You are about to drop the column `booking_id` on the `Payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_booking_id_fkey";

-- DropIndex
DROP INDEX "public"."Payment_booking_id_idx";

-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "payment_id" TEXT;

-- AlterTable
ALTER TABLE "public"."Payment" DROP COLUMN "booking_id",
ADD COLUMN     "payload" JSONB;

-- CreateIndex
CREATE INDEX "Payment_transaction_id_idx" ON "public"."Payment"("transaction_id");

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "public"."Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
