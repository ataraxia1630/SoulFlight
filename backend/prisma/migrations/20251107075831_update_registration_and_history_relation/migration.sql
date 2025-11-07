/*
  Warnings:

  - Added the required column `registration_id` to the `ApprovalHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ApprovalHistory" ADD COLUMN     "registration_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."ApprovalHistory" ADD CONSTRAINT "ApprovalHistory_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "public"."Registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
