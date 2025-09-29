const prisma = require('../configs/prisma');

const ServiceTypeService = {
  getAll: async () => {
    return await prisma.serviceType.findMany();
  },

  getById: async (id) => {
    return await prisma.serviceType.findUnique({
      where: { id },
    });
  },

  create: async (data) => {
    return await prisma.serviceType.create({
      data,
    });
  },

  update: async (id, data) => {
    return await prisma.serviceType.update({
      where: { id },
      data,
    });
  },

  delete: async (id) => {
    return await prisma.serviceType.delete({
      where: { id },
    });
  },
};

module.exports = { ServiceTypeService };
