/*
  Warnings:

  - The `notes` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_provider_id_fkey";

-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "expiry_time" TIMESTAMP(3),
ADD COLUMN     "service_id" INTEGER,
ALTER COLUMN "provider_id" DROP NOT NULL,
DROP COLUMN "notes",
ADD COLUMN     "notes" JSONB;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "public"."Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
