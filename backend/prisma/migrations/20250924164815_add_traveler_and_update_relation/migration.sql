-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "public"."Provider" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Provider_id_seq";

-- CreateTable
CREATE TABLE "public"."Traveler" (
    "id" INTEGER NOT NULL,
    "gender" "public"."Gender",
    "dob" TIMESTAMP(3),
    "location" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Traveler_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Provider" ADD CONSTRAINT "Provider_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Traveler" ADD CONSTRAINT "Traveler_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
