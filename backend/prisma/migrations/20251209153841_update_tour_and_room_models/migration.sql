/*
  Warnings:

  - You are about to drop the column `room_number` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `total_count` on the `RoomAvailability` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `is_recurring` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `repeat_days` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `repeat_rule` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the `TourAvailability` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."TourAvailability" DROP CONSTRAINT "TourAvailability_tour_id_fkey";

-- AlterTable
ALTER TABLE "public"."Room" DROP COLUMN "room_number",
ADD COLUMN     "total_rooms" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."RoomAvailability" DROP COLUMN "total_count";

-- AlterTable
ALTER TABLE "public"."Tour" DROP COLUMN "duration",
DROP COLUMN "end_date",
DROP COLUMN "is_recurring",
DROP COLUMN "repeat_days",
DROP COLUMN "repeat_rule",
DROP COLUMN "start_date",
ADD COLUMN     "current_bookings" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "end_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "max_participants" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "public"."TourAvailability";
