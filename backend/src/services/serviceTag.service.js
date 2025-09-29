const prisma = require('../configs/prisma');

const ServiceTagService = {
  getAll: async () => {
    return await prisma.serviceTag.findMany();
  },

  getById: async (id) => {
    return await prisma.serviceTag.findUnique({
      where: { id },
    });
  },

  create: async (data) => {
    return await prisma.serviceTag.create({
      data,
    });
  },

  update: async (id, data) => {
    return await prisma.serviceTag.update({
      where: { id },
      data,
    });
  },

  delete: async (id) => {
    return await prisma.serviceTag.delete({
      where: { id },
    });
  },
};

module.exports = { ServiceTagService };
