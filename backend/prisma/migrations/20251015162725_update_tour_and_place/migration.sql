/*
  Warnings:

  - You are about to drop the column `closing_hour` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `opening_hour` on the `Place` table. All the data in the column will be lost.
  - The primary key for the `TourPlace` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `placeId` on the `TourPlace` table. All the data in the column will be lost.
  - You are about to drop the column `tourId` on the `TourPlace` table. All the data in the column will be lost.
  - You are about to drop the column `tourguide_id` on the `TourPlace` table. All the data in the column will be lost.
  - Added the required column `service_price` to the `Tour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place_id` to the `TourPlace` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tour_id` to the `TourPlace` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."TourPlace" DROP CONSTRAINT "TourPlace_placeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TourPlace" DROP CONSTRAINT "TourPlace_tourId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TourPlace" DROP CONSTRAINT "TourPlace_tourguide_id_fkey";

-- AlterTable
ALTER TABLE "public"."Place" DROP COLUMN "closing_hour",
DROP COLUMN "opening_hour",
ADD COLUMN     "entry_fee" DOUBLE PRECISION,
ADD COLUMN     "opening_hours" JSONB;

-- AlterTable
ALTER TABLE "public"."Tour" ADD COLUMN     "service_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tourguide_id" INTEGER;

-- AlterTable
ALTER TABLE "public"."TourPlace" DROP CONSTRAINT "TourPlace_pkey",
DROP COLUMN "placeId",
DROP COLUMN "tourId",
DROP COLUMN "tourguide_id",
ADD COLUMN     "place_id" INTEGER NOT NULL,
ADD COLUMN     "tour_id" INTEGER NOT NULL,
ADD CONSTRAINT "TourPlace_pkey" PRIMARY KEY ("tour_id", "place_id");

-- AddForeignKey
ALTER TABLE "public"."Tour" ADD CONSTRAINT "Tour_tourguide_id_fkey" FOREIGN KEY ("tourguide_id") REFERENCES "public"."TourGuide"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TourPlace" ADD CONSTRAINT "TourPlace_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "public"."Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TourPlace" ADD CONSTRAINT "TourPlace_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "public"."Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
