-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_related_id_fkey" FOREIGN KEY ("related_id") REFERENCES "public"."Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
