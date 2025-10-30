-- CreateTable
CREATE TABLE "public"."Ticket" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "place_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- RenameForeignKey
ALTER TABLE "public"."Room" RENAME CONSTRAINT "Room_serviceId_fkey" TO "Room_service_id_fkey";

-- RenameForeignKey
ALTER TABLE "public"."RoomFacility" RENAME CONSTRAINT "RoomFacility_facilityId_fkey" TO "RoomFacility_facility_id_fkey";

-- RenameForeignKey
ALTER TABLE "public"."RoomFacility" RENAME CONSTRAINT "RoomFacility_roomId_fkey" TO "RoomFacility_room_id_fkey";

-- RenameForeignKey
ALTER TABLE "public"."ServiceOnTag" RENAME CONSTRAINT "ServiceOnTag_serviceId_fkey" TO "ServiceOnTag_service_id_fkey";

-- RenameForeignKey
ALTER TABLE "public"."ServiceOnTag" RENAME CONSTRAINT "ServiceOnTag_tagId_fkey" TO "ServiceOnTag_tag_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "public"."Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "public"."Room_serviceId_idx" RENAME TO "Room_service_id_idx";

-- RenameIndex
ALTER INDEX "public"."RoomFacility_facilityId_idx" RENAME TO "RoomFacility_facility_id_idx";

-- RenameIndex
ALTER INDEX "public"."RoomFacility_roomId_idx" RENAME TO "RoomFacility_room_id_idx";
