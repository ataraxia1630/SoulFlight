-- AlterTable
ALTER TABLE "public"."Service" ADD COLUMN     "model_tag" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Service" ADD CONSTRAINT "Service_model_tag_fkey" FOREIGN KEY ("model_tag") REFERENCES "public"."ServiceTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
