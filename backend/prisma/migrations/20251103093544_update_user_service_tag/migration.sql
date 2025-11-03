/*
  Warnings:

  - Added the required column `category` to the `ServiceTag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Service" ADD COLUMN     "price_max" DOUBLE PRECISION,
ADD COLUMN     "price_min" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."ServiceTag" ADD COLUMN     "category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "is_admin" BOOLEAN NOT NULL DEFAULT false;
