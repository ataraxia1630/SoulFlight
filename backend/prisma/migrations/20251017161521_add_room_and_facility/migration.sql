-- CreateTable
CREATE TABLE "public"."Facility" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Room" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price_per_night" DECIMAL(10,2) NOT NULL,
    "max_children_number" INTEGER,
    "max_adult_number" INTEGER,
    "pet_allowed" BOOLEAN NOT NULL DEFAULT false,
    "bed_number" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RoomFacility" (
    "roomId" INTEGER NOT NULL,
    "facilityId" INTEGER NOT NULL,

    CONSTRAINT "RoomFacility_pkey" PRIMARY KEY ("roomId","facilityId")
);

-- CreateIndex
CREATE INDEX "Room_serviceId_idx" ON "public"."Room"("serviceId");

-- CreateIndex
CREATE INDEX "RoomFacility_roomId_idx" ON "public"."RoomFacility"("roomId");

-- CreateIndex
CREATE INDEX "RoomFacility_facilityId_idx" ON "public"."RoomFacility"("facilityId");

-- AddForeignKey
ALTER TABLE "public"."Room" ADD CONSTRAINT "Room_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoomFacility" ADD CONSTRAINT "RoomFacility_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoomFacility" ADD CONSTRAINT "RoomFacility_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "public"."Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;
