-- AddForeignKey
ALTER TABLE "public"."Registration" ADD CONSTRAINT "Registration_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "public"."Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
