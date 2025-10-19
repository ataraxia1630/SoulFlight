const prisma = require("../configs/prisma");

const RoomService = {
  create: (data) => {
    const { connectFacilities, serviceId, ...roomData } = data;

    const facilitiesData = (connectFacilities || []).map((facilityId) => ({
      facility: { connect: { id: parseInt(facilityId, 10) } },
    }));

    return prisma.room.create({
      data: {
        ...roomData,
        price_per_night: parseFloat(roomData.price_per_night) || undefined,
        service: { connect: { id: parseInt(serviceId, 10) } },
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
    const { connectFacilities, disconnectFacilities, serviceId, ...roomData } = data;

    const connectData = (connectFacilities || []).map((facilityId) => ({
      facility: { connect: { id: parseInt(facilityId, 10) } },
    }));
    const disconnectData = (disconnectFacilities || []).map((facilityId) => ({
      roomId_facilityId: {
        roomId: parseInt(id, 10),
        facilityId: parseInt(facilityId, 10),
      },
    }));

    return prisma.room.update({
      where: { id: parseInt(id, 10) },
      data: {
        ...roomData,
        price_per_night: roomData.price_per_night
          ? parseFloat(roomData.price_per_night)
          : undefined,
        ...(serviceId && {
          service: { connect: { id: parseInt(serviceId, 10) } },
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
