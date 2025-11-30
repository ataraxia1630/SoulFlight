-- AlterTable
ALTER TABLE "public"."Room" ADD COLUMN     "floor" INTEGER,
ADD COLUMN     "room_number" TEXT,
ADD COLUMN     "size_sqm" DOUBLE PRECISION,
ADD COLUMN     "status" "public"."ServiceStatus" NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "view_type" TEXT;

-- AlterTable
ALTER TABLE "public"."Ticket" ADD COLUMN     "status" "public"."ServiceStatus" NOT NULL DEFAULT 'AVAILABLE';

-- CreateTable
CREATE TABLE "public"."TourAvailability" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "available_slots" INTEGER NOT NULL,
    "max_participants" INTEGER NOT NULL,
    "price_override" DOUBLE PRECISION,

    CONSTRAINT "TourAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RoomAvailability" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "available_count" INTEGER NOT NULL,
    "total_count" INTEGER NOT NULL,
    "price_override" DECIMAL(10,2),

    CONSTRAINT "RoomAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TicketAvailability" (
    "id" SERIAL NOT NULL,
    "ticket_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "available_count" INTEGER NOT NULL,
    "max_count" INTEGER,
    "price_override" DOUBLE PRECISION,

    CONSTRAINT "TicketAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Wishlist" (
    "id" SERIAL NOT NULL,
    "traveler_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "related_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TourAvailability_tour_id_date_idx" ON "public"."TourAvailability"("tour_id", "date");

-- CreateIndex
CREATE INDEX "RoomAvailability_room_id_date_idx" ON "public"."RoomAvailability"("room_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "RoomAvailability_room_id_date_key" ON "public"."RoomAvailability"("room_id", "date");

-- CreateIndex
CREATE INDEX "TicketAvailability_ticket_id_date_idx" ON "public"."TicketAvailability"("ticket_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "TicketAvailability_ticket_id_date_key" ON "public"."TicketAvailability"("ticket_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_traveler_id_service_id_key" ON "public"."Wishlist"("traveler_id", "service_id");

-- CreateIndex
CREATE INDEX "Notification_user_id_is_read_idx" ON "public"."Notification"("user_id", "is_read");

-- AddForeignKey
ALTER TABLE "public"."TourAvailability" ADD CONSTRAINT "TourAvailability_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "public"."Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoomAvailability" ADD CONSTRAINT "RoomAvailability_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TicketAvailability" ADD CONSTRAINT "TicketAvailability_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wishlist" ADD CONSTRAINT "Wishlist_traveler_id_fkey" FOREIGN KEY ("traveler_id") REFERENCES "public"."Traveler"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wishlist" ADD CONSTRAINT "Wishlist_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
