/*
  Warnings:

  - You are about to drop the column `image_url` on the `Place` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Image" DROP CONSTRAINT "Image_related_id_fkey";

-- AlterTable
ALTER TABLE "public"."Place" DROP COLUMN "image_url";
