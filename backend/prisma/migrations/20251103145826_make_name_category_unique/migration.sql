/*
  Warnings:

  - A unique constraint covering the columns `[name,category]` on the table `ServiceTag` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."ServiceTag_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "ServiceTag_name_category_key" ON "public"."ServiceTag"("name", "category");
