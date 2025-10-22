ALTER TABLE "Room" RENAME COLUMN "serviceId" TO "service_id";

ALTER TABLE "RoomFacility" RENAME COLUMN "facilityId" TO "facility_id";
ALTER TABLE "RoomFacility" RENAME COLUMN "roomId" TO "room_id";

ALTER TABLE "ServiceOnTag" RENAME COLUMN "serviceId" TO "service_id";
ALTER TABLE "ServiceOnTag" RENAME COLUMN "tagId" TO "tag_id";
