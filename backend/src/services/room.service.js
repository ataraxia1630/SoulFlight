const prisma = require("../configs/prisma");

const RoomService = {
  create: (data) => {
    const { connectFacilities, service_id, ...roomData } = data;

    const facilitiesData = (connectFacilities || []).map((facility_id) => ({
      facility: { connect: { id: parseInt(facility_id, 10) } },
    }));

    return prisma.room.create({
      data: {
        ...roomData,
        price_per_night: parseFloat(roomData.price_per_night) || undefined,
        service: { connect: { id: parseInt(service_id, 10) } },
        facilities: {
          create: facilitiesData,
        },
      },
      include: { facilities: { include: { facility: true } } },
    });
  },

  getAll: () =>
    prisma.room.findMany({
      include: { facilities: { include: { facility: true } } },
    }),

  getOne: (id) =>
    prisma.room.findUnique({
      where: { id: parseInt(id, 10) },
      include: { facilities: { include: { facility: true } } },
    }),

  update: (id, data) => {
    const { connectFacilities, disconnectFacilities, service_id, ...roomData } = data;

    const connectData = (connectFacilities || []).map((facility_id) => ({
      facility: { connect: { id: parseInt(facility_id, 10) } },
    }));
    const disconnectData = (disconnectFacilities || []).map((facility_id) => ({
      roomId_facilityId: {
        room_id: parseInt(id, 10),
        facility_id: parseInt(facility_id, 10),
      },
    }));

    return prisma.room.update({
      where: { id: parseInt(id, 10) },
      data: {
        ...roomData,
        price_per_night: roomData.price_per_night
          ? parseFloat(roomData.price_per_night)
          : undefined,
        ...(service_id && {
          service: { connect: { id: parseInt(service_id, 10) } },
        }),
        facilities: {
          create: connectData,
          delete: disconnectData,
        },
      },
      include: { facilities: { include: { facility: true } } },
    });
  },

  remove: (id) => prisma.room.delete({ where: { id: parseInt(id, 10) } }),
};

module.exports = RoomService;
