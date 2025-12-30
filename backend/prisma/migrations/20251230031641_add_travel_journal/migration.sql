-- CreateTable
CREATE TABLE "public"."TravelJournal" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "traveler_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelJournal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."TravelJournal" ADD CONSTRAINT "TravelJournal_traveler_id_fkey" FOREIGN KEY ("traveler_id") REFERENCES "public"."Traveler"("id") ON DELETE CASCADE ON UPDATE CASCADE;
