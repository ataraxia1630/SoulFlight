const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const CloudinaryService = require("../services/cloudinary.service");
const { ERROR_CODES } = require("../constants/errorCode");
const { RoomDTO } = require("../dtos/room.dto");
const { getDateRange } = require("../utils/date");
const { generateAvailableRooms } = require("../utils/generateAvailableRooms");

const MAX_IMAGES = 10;

const uploadRoomImages = async (roomId, files) => {
  const currentCount = await prisma.image.count({
    where: { related_id: roomId, related_type: "Room" },
  });

  const remainingSlots = MAX_IMAGES - currentCount;
  if (remainingSlots <= 0) {
    throw new AppError(
      ERROR_CODES.TOO_MANY_IMAGES.statusCode,
      ERROR_CODES.TOO_MANY_IMAGES.message,
      ERROR_CODES.TOO_MANY_IMAGES.code,
    );
  }

  const filesToUpload = files.slice(0, remainingSlots);
  if (filesToUpload.length < files.length) {
    throw new AppError(
      ERROR_CODES.TOO_MANY_IMAGES.statusCode,
      ERROR_CODES.TOO_MANY_IMAGES.message,
      ERROR_CODES.TOO_MANY_IMAGES.code,
    );
  }

  const isFirstImage = currentCount === 0;

  const uploadResults = await Promise.all(
    filesToUpload.map((file) => CloudinaryService.uploadSingle(file.buffer, { folder: "rooms" })),
  );

  const imageData = uploadResults.map((result, i) => ({
    url: result.public_id,
    position: currentCount + i,
    is_main: isFirstImage && i === 0,
    related_id: roomId,
    related_type: "Room",
  }));

  await prisma.image.createMany({
    data: imageData,
    skipDuplicates: true,
  });

  return uploadResults;
};

const updateImageList = async (tx, roomId, updates) => {
  const toDelete = updates.filter((u) => u.delete === true && u.id);
  if (toDelete.length > 0) {
    const ids = toDelete.map((u) => u.id);

    const images = await tx.image.findMany({
      where: { id: { in: ids }, related_id: roomId, related_type: "Room" },
      select: { url: true },
    });
    if (images.length > 0) {
      await CloudinaryService.deleteMultiple(images.map((i) => i.url));
    }

    await tx.image.deleteMany({
      where: { id: { in: ids } },
    });
  }

  const toUpdate = updates.filter((u) => u.id && !u.delete);
  if (toUpdate.length > 0) {
    for (const u of toUpdate) {
      await tx.image.update({
        where: { id: u.id },
        data: {
          position: u.position ?? undefined,
          is_main: u.is_main ?? undefined,
        },
      });
    }
  }

  const hasMain = updates.some((u) => u.is_main === true);
  if (!hasMain) {
    const firstImage = await tx.image.findFirst({
      where: { related_id: roomId, related_type: "Room" },
      orderBy: { position: "asc" },
      select: { id: true },
    });

    if (firstImage) {
      await tx.image.updateMany({
        where: { related_id: roomId, related_type: "Room" },
        data: { is_main: false },
      });
      await tx.image.update({
        where: { id: firstImage.id },
        data: { is_main: true },
      });
    }
  }
};

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
        include: { facilities: { include: { facility: true } } },
      });

      await generateAvailableRooms(
        createdRoom.id,
        createdRoom.total_rooms,
        createdRoom.price_per_night,
        tx,
      );

      return createdRoom;
    });

    if (files.length > 0) {
      await uploadRoomImages(room.id, files);
    }

    const fullRoom = await prisma.room.findUnique({
      where: { id: room.id },
      include: {
        facilities: { include: { facility: true } },
        images: {
          where: { related_type: "Room" },
          orderBy: { position: "asc" },
        },
      },
    });

    return RoomDTO.fromModel(fullRoom);
  },

  getAll: async () => {
    const rooms = await prisma.room.findMany({
      include: {
        facilities: { include: { facility: true } },
        images: {
          where: { related_type: "Room" },
          orderBy: { position: "asc" },
        },
      },
      orderBy: { id: "asc" },
    });

    return RoomDTO.fromList(rooms);
  },

  getOne: async (id) => {
    const roomId = parseInt(id, 10);
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        facilities: { include: { facility: true } },
        images: {
          where: { related_type: "Room" },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!room) {
      throw new AppError(
        ERROR_CODES.ROOM_NOT_FOUND.statusCode,
        ERROR_CODES.ROOM_NOT_FOUND.message,
        ERROR_CODES.ROOM_NOT_FOUND.code,
      );
    }

    return RoomDTO.fromModel(room);
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

    const { connectFacilities, disconnectFacilities, service_id, ...roomData } = data;

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
        await updateImageList(tx, roomId, imageUpdates);
      }
    });

    if (files.length > 0) {
      await uploadRoomImages(roomId, files);
    }

    const fullRoom = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        facilities: { include: { facility: true } },
        images: {
          where: { related_type: "Room" },
          orderBy: { position: "asc" },
        },
      },
    });

    return RoomDTO.fromModel(fullRoom);
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
        await CloudinaryService.deleteMultiple(images.map((i) => i.url));
      }
      await tx.room.delete({ where: { id: roomId } });
    });

    return null;
  },

  checkAvailability: async (roomId, checkIn, checkOut, quantity = 1) => {
    const room = await prisma.room.findUnique({
      where: { id: parseInt(roomId, 10) },
      include: {
        service: { select: { name: true } },
        facilities: { include: { facility: true } },
        images: {
          where: { related_type: "Room" },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!room) {
      throw new AppError(
        ERROR_CODES.ROOM_NOT_FOUND.statusCode,
        ERROR_CODES.ROOM_NOT_FOUND.message,
        ERROR_CODES.ROOM_NOT_FOUND.code,
      );
    }

    if (!checkIn || !checkOut) {
      throw new AppError(
        ERROR_CODES.MISSING_DATES.statusCode,
        ERROR_CODES.MISSING_DATES.message,
        ERROR_CODES.MISSING_DATES.code,
      );
    }

    const dates = getDateRange(checkIn, checkOut);
    const availabilities = await prisma.RoomAvailability.findMany({
      where: { room_id: room.id, date: { in: dates } },
      orderBy: { date: "asc" },
    });

    if (availabilities.length !== dates.length) {
      return RoomDTO.withAvailability(room, {
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
      price_override: a.price_override ? parseFloat(a.price_override) : null,
    }));

    const minAvailable = Math.min(...availabilities.map((_a) => available_count));

    return RoomDTO.withAvailability(room, {
      available: minAvailable >= quantity,
      available_count: minAvailable,
      required_quantity: quantity,
      nights: dates.length,
      dates: details,
    });
  },

  getAvailable: async (serviceId, checkIn, checkOut, adults = 1, children = 0) => {
    const service_id = parseInt(serviceId, 10);
    const rooms = await prisma.room.findMany({
      where: { service_id },
      include: {
        service: { select: { name: true } },
        facilities: { include: { facility: true } },
        images: {
          where: { related_type: "Room" },
          orderBy: { position: "asc" },
        },
      },
    });

    const results = [];
    const totalGuests = adults + children;

    for (const room of rooms) {
      const capacity = (room.max_adult_number || 2) + (room.max_children_number || 0);
      if (totalGuests > capacity) continue;

      try {
        const avail = await checkRoomAvailability(room.id, checkIn, checkOut, 1);
        if (avail.availability.available) {
          results.push(avail);
        }
      } catch (_err) {}
    }

    results.sort((a, b) => a.availability.total_price - b.availability.total_price);
    return results;
  },
};

module.exports = RoomService;
