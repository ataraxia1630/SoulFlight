const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const CloudinaryService = require("../services/cloudinary.service");
const { ERROR_CODES } = require("../constants/errorCode");
const { RoomDTO } = require("../dtos/room.dto");
const { getDateRange } = require("../utils/date");
const { generateAvailable } = require("../utils/generateAvailable");
const { attachImages, attachImagesList } = require("../utils/attachImage");
const { uploadImages, updateImageList } = require("../utils/imageHandler");
const cron = require("node-cron");

const roomInclude = (travelerId) => ({
  facilities: { include: { facility: true } },
  service: {
    include: {
      Provider: {
        include: { user: true },
      },
      Wishlists: travelerId
        ? {
            where: { traveler_id: parseInt(travelerId, 10) },
          }
        : false,
    },
  },
});

const RoomService = {
  create: async (data, files = []) => {
    const { connectFacilities, service_id, ...roomData } = data;

    const room = await prisma.$transaction(async (tx) => {
      const createdRoom = await tx.room.create({
        data: {
          ...roomData,
          price_per_night: parseFloat(roomData.price_per_night),
          service: { connect: { id: parseInt(service_id, 10) } },
          facilities: {
            create: (connectFacilities || []).map((id) => ({
              facility: { connect: { id: parseInt(id, 10) } },
            })),
          },
        },
        include: roomInclude(null),
      });

      await generateAvailable(
        createdRoom.id,
        createdRoom.total_rooms,
        createdRoom.price_per_night,
        tx,
      );

      return createdRoom;
    });

    if (files.length > 0) {
      await uploadImages(room.id, files, "Room", "rooms");
    }

    const fullRoom = await prisma.room.findUnique({
      where: { id: room.id },
      include: roomInclude(null),
    });

    const roomWithImages = await attachImages({
      entity: fullRoom,
      type: "Room",
    });

    return RoomDTO.fromModel(roomWithImages);
  },

  getAll: async (travelerId) => {
    const rooms = await prisma.room.findMany({
      include: roomInclude(travelerId),
      orderBy: { updated_at: "desc" },
    });

    const roomsWithImages = await attachImagesList({
      entities: rooms,
      type: "Room",
    });

    return RoomDTO.fromList(roomsWithImages);
  },

  getOne: async (id, travelerId) => {
    const roomId = parseInt(id, 10);
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: roomInclude(travelerId),
    });

    if (!room) {
      throw new AppError(
        ERROR_CODES.ROOM_NOT_FOUND.statusCode,
        ERROR_CODES.ROOM_NOT_FOUND.message,
        ERROR_CODES.ROOM_NOT_FOUND.code,
      );
    }

    const roomWithImages = await attachImages({
      entity: room,
      type: "Room",
    });

    return RoomDTO.fromModel(roomWithImages);
  },

  update: async (id, data, files = [], imageUpdates = []) => {
    const roomId = parseInt(id, 10);
    const exists = await prisma.room.findUnique({ where: { id: roomId } });
    if (!exists) {
      throw new AppError(
        ERROR_CODES.ROOM_NOT_FOUND.statusCode,
        ERROR_CODES.ROOM_NOT_FOUND.message,
        ERROR_CODES.ROOM_NOT_FOUND.code,
      );
    }

    const {
      connectFacilities,
      disconnectFacilities,
      imageActions: _imageActions,
      service_id,
      ...roomData
    } = data;

    await prisma.$transaction(async (tx) => {
      const updateData = {
        ...roomData,
        ...(roomData.price_per_night && {
          price_per_night: parseFloat(roomData.price_per_night),
        }),
        ...(service_id && {
          service: { connect: { id: parseInt(service_id, 10) } },
        }),
        facilities: {
          create: (connectFacilities || []).map((id) => ({
            facility: { connect: { id: parseInt(id, 10) } },
          })),
          delete: (disconnectFacilities || []).map((id) => ({
            roomId_facilityId: {
              room_id: roomId,
              facility_id: parseInt(id, 10),
            },
          })),
        },
      };

      await tx.room.update({
        where: { id: roomId },
        data: updateData,
      });

      if (imageUpdates.length > 0) {
        await updateImageList(tx, roomId, "Room", imageUpdates);
      }
    });

    if (files.length > 0) {
      await uploadImages(roomId, files, "Room", "rooms");
    }

    const fullRoom = await prisma.room.findUnique({
      where: { id: roomId },
      include: roomInclude(null),
    });

    const roomWithImages = await attachImages({
      entity: fullRoom,
      type: "Room",
    });

    return RoomDTO.fromModel(roomWithImages);
  },

  delete: async (id) => {
    const roomId = parseInt(id, 10);
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      throw new AppError(
        ERROR_CODES.ROOM_NOT_FOUND.statusCode,
        ERROR_CODES.ROOM_NOT_FOUND.message,
        ERROR_CODES.ROOM_NOT_FOUND.code,
      );
    }

    await prisma.$transaction(async (tx) => {
      const images = await tx.image.findMany({
        where: { related_id: roomId, related_type: "Room" },
        select: { url: true },
      });
      if (images.length > 0) {
        try {
          await CloudinaryService.deleteMultiple(images.map((i) => i.url));
        } catch {
          console.warn(`Image not in cloudinary`);
        }
      }
      await tx.room.delete({ where: { id: roomId } });
    });

    return null;
  },

  checkAvailability: async (roomId, travelerId, checkIn, checkOut, quantity = 1) => {
    const room = await prisma.room.findUnique({
      where: { id: parseInt(roomId, 10) },
      include: roomInclude(travelerId),
    });

    if (!room) {
      throw new AppError(
        ERROR_CODES.ROOM_NOT_FOUND.statusCode,
        ERROR_CODES.ROOM_NOT_FOUND.message,
        ERROR_CODES.ROOM_NOT_FOUND.code,
      );
    }
    const roomWithImages = await attachImages({ entity: room, type: "Room" });
    if (!checkIn || !checkOut) {
      throw new AppError(
        ERROR_CODES.MISSING_DATES.statusCode,
        ERROR_CODES.MISSING_DATES.message,
        ERROR_CODES.MISSING_DATES.code,
      );
    }
    const dates = getDateRange(checkIn, checkOut);
    const availabilities = await prisma.RoomAvailability.findMany({
      where: { room_id: roomWithImages.id, date: { in: dates } },
      orderBy: { date: "asc" },
    });

    if (availabilities.length !== dates.length) {
      return RoomDTO.withAvailability(roomWithImages, {
        available: false,
        available_count: 0,
        required_quantity: quantity,
        nights: dates.length,
        dates: [],
      });
    }

    const details = availabilities.map((a) => ({
      date: a.date,
      available: a.available_count,
    }));
    const minAvailable = Math.min(...availabilities.map((a) => a.available_count));

    return RoomDTO.withAvailability(roomWithImages, {
      available: minAvailable >= quantity,
      available_count: minAvailable,
      required_quantity: quantity,
      nights: dates.length,
      dates: details,
    });
  },

  getAvailable: async (serviceId, travelerId, checkIn, checkOut, adults = 1, children = 0) => {
    const service_id = parseInt(serviceId, 10);
    const rooms = await prisma.room.findMany({
      where: { service_id },
      include: roomInclude(travelerId),
      orderBy: { price_per_night: "asc" },
    });

    const roomsWithImages = await attachImagesList({ entities: rooms, type: "Room" });
    const results = [];
    const totalGuests = adults + children;

    for (const room of roomsWithImages) {
      const capacity = (room.max_adult_number || 2) + (room.max_children_number || 0);
      if (totalGuests > capacity) continue;
      try {
        const avail = await RoomService.checkAvailability(
          room.id,
          travelerId,
          checkIn,
          checkOut,
          1,
        );
        if (avail.availability.available) {
          results.push(avail);
        }
      } catch {}
    }
    return results;
  },

  getByService: async (serviceId, travelerId) => {
    const service_id = parseInt(serviceId, 10);
    const rooms = await prisma.room.findMany({
      where: { service_id },
      include: roomInclude(travelerId),
    });
    rooms.sort((a, b) => {
      const isAvailableA = a.status === "AVAILABLE";
      const isAvailableB = b.status === "AVAILABLE";

      if (isAvailableA !== isAvailableB) {
        return Number(isAvailableB) - Number(isAvailableA);
      }
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
    const roomsWithImages = await attachImagesList({ entities: rooms, type: "Room" });
    return RoomDTO.fromList(roomsWithImages);
  },

  getByProvider: async (providerId, travelerId) => {
    const provider_id = parseInt(providerId, 10);
    const rooms = await prisma.room.findMany({
      where: { service: { provider_id: provider_id } },
      include: roomInclude(travelerId),
      orderBy: { updated_at: "desc" },
    });
    const roomsWithImages = await attachImagesList({ entities: rooms, type: "Room" });
    return RoomDTO.fromList(roomsWithImages);
  },
};

const startRoomExtensionCron = () => {
  // chạy mỗi ngày một lần vào lúc 00:30 (tránh trùng giờ với TicketCron)
  cron.schedule("30 0 * * *", async () => {
    try {
      console.log("[RoomCron] Checking for rooms needing extension...");

      const rooms = await prisma.room.findMany({
        where: {
          status: "AVAILABLE",
          service: { status: "AVAILABLE" },
        },
        select: { id: true, total_rooms: true, price_per_night: true },
      });

      const thresholdDate = new Date();
      thresholdDate.setHours(0, 0, 0, 0);
      const warningLimit = new Date(thresholdDate);
      warningLimit.setDate(warningLimit.getDate() + 30);

      let extendedCount = 0;

      for (const room of rooms) {
        const lastAvail = await prisma.roomAvailability.findFirst({
          where: { room_id: room.id },
          orderBy: { date: "desc" },
          select: { date: true },
        });

        if (!lastAvail || lastAvail.date < warningLimit) {
          let startDate = new Date(thresholdDate);

          if (lastAvail) {
            const nextDayAfterOldLimit = new Date(lastAvail.date);
            nextDayAfterOldLimit.setDate(nextDayAfterOldLimit.getDate() + 1);
            nextDayAfterOldLimit.setHours(0, 0, 0, 0);

            if (nextDayAfterOldLimit > startDate) {
              startDate = nextDayAfterOldLimit;
            }
          }

          await prisma.$transaction(async (tx) => {
            await generateAvailable(room.id, room.total_rooms, room.price_per_night, tx, startDate);
          });

          extendedCount++;
        }
      }

      if (extendedCount > 0) {
        console.log(`[RoomCron] Extended availability for ${extendedCount} rooms.`);
      }
    } catch (error) {
      console.error("[RoomCron] Error extending rooms:", error);
    }
  });
};

module.exports = { RoomService, startRoomExtensionCron };
