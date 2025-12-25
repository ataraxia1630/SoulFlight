/*
  Warnings:

  - You are about to drop the column `booking_id` on the `Review` table. All the data in the column will be lost.
  - Added the required column `service_id` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `traveler_id` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_booking_id_fkey";

-- AlterTable
ALTER TABLE "public"."Review" DROP COLUMN "booking_id",
ADD COLUMN     "menu_id" INTEGER,
ADD COLUMN     "room_id" INTEGER,
ADD COLUMN     "service_id" INTEGER NOT NULL,
ADD COLUMN     "ticket_id" INTEGER,
ADD COLUMN     "tour_id" INTEGER,
ADD COLUMN     "traveler_id" INTEGER NOT NULL,
ALTER COLUMN "rating" SET DEFAULT 5;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_traveler_id_fkey" FOREIGN KEY ("traveler_id") REFERENCES "public"."Traveler"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "public"."Tour"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "public"."Menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;
