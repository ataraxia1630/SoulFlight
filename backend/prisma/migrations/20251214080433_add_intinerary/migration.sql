-- CreateEnum
CREATE TYPE "public"."ItineraryStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('RESTAURANT', 'ATTRACTION', 'ACCOMMODATION', 'TRANSPORT', 'SHOPPING', 'ENTERTAINMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ActivitySource" AS ENUM ('AI_GENERATED', 'USER_ADDED', 'BOOKING_LINKED');

-- CreateTable
CREATE TABLE "public"."Itinerary" (
    "id" TEXT NOT NULL,
    "traveler_id" INTEGER NOT NULL,
    "title" TEXT,
    "destination" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "budget" DOUBLE PRECISION,
    "preferences" TEXT[],
    "special_request" TEXT,
    "status" "public"."ItineraryStatus" NOT NULL DEFAULT 'DRAFT',
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "cover_image_url" TEXT,
    "ai_summary" TEXT,
    "ai_tips" TEXT[],
    "budget_breakdown" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Itinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ItineraryDay" (
    "id" TEXT NOT NULL,
    "itinerary_id" TEXT NOT NULL,
    "day_number" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "theme" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItineraryDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ItineraryActivity" (
    "id" TEXT NOT NULL,
    "day_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "time" TEXT NOT NULL,
    "duration" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "exact_address" TEXT,
    "type" "public"."ActivityType" NOT NULL,
    "source" "public"."ActivitySource" NOT NULL DEFAULT 'AI_GENERATED',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "estimated_cost" DOUBLE PRECISION,
    "actual_cost" DOUBLE PRECISION,
    "price_level" INTEGER,
    "estimated_rating" DOUBLE PRECISION,
    "popular_times" TEXT,
    "local_tips" TEXT[],
    "photo_url" TEXT,
    "photo_small_url" TEXT,
    "photographer" TEXT,
    "photo_source" TEXT,
    "cuisine" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "user_notes" TEXT,
    "user_rating" INTEGER,
    "cached_reviews" JSONB,
    "booking_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItineraryActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SharedItinerary" (
    "id" TEXT NOT NULL,
    "itinerary_id" TEXT NOT NULL,
    "shared_with_traveler_id" INTEGER NOT NULL,
    "can_edit" BOOLEAN NOT NULL DEFAULT false,
    "shared_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedItinerary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Itinerary_traveler_id_idx" ON "public"."Itinerary"("traveler_id");

-- CreateIndex
CREATE INDEX "Itinerary_status_idx" ON "public"."Itinerary"("status");

-- CreateIndex
CREATE INDEX "Itinerary_start_date_idx" ON "public"."Itinerary"("start_date");

-- CreateIndex
CREATE INDEX "ItineraryDay_itinerary_id_idx" ON "public"."ItineraryDay"("itinerary_id");

-- CreateIndex
CREATE UNIQUE INDEX "ItineraryDay_itinerary_id_day_number_key" ON "public"."ItineraryDay"("itinerary_id", "day_number");

-- CreateIndex
CREATE INDEX "ItineraryActivity_day_id_idx" ON "public"."ItineraryActivity"("day_id");

-- CreateIndex
CREATE INDEX "ItineraryActivity_type_idx" ON "public"."ItineraryActivity"("type");

-- CreateIndex
CREATE INDEX "SharedItinerary_shared_with_traveler_id_idx" ON "public"."SharedItinerary"("shared_with_traveler_id");

-- CreateIndex
CREATE UNIQUE INDEX "SharedItinerary_itinerary_id_shared_with_traveler_id_key" ON "public"."SharedItinerary"("itinerary_id", "shared_with_traveler_id");

-- AddForeignKey
ALTER TABLE "public"."Itinerary" ADD CONSTRAINT "Itinerary_traveler_id_fkey" FOREIGN KEY ("traveler_id") REFERENCES "public"."Traveler"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItineraryDay" ADD CONSTRAINT "ItineraryDay_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItineraryActivity" ADD CONSTRAINT "ItineraryActivity_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "public"."ItineraryDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SharedItinerary" ADD CONSTRAINT "SharedItinerary_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SharedItinerary" ADD CONSTRAINT "SharedItinerary_shared_with_traveler_id_fkey" FOREIGN KEY ("shared_with_traveler_id") REFERENCES "public"."Traveler"("id") ON DELETE CASCADE ON UPDATE CASCADE;
