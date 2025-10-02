const prisma = require('../configs/prisma');
const AppError = require('../utils/AppError');

const ServiceTagService = {
  getAll: async () => {
    return await prisma.serviceTag.findMany();
  },

  getById: async (id) => {
    const tag = await prisma.serviceTag.findUnique({
      where: { id },
    });
    if (!tag) {
      return new AppError(404, 'Service Tag not found');
    }
    return tag;
  },

  create: async (data) => {
    const created = await prisma.serviceTag.create({
      data,
    });
    return created;
  },

  update: async (id, data) => {
    const updated = await prisma.serviceTag.update({
      where: { id },
      data,
    });
    if (!updated) {
      return new AppError(404, 'Service Tag not found');
    }
    return updated;
  },

  delete: async (id) => {
    const deleted = await prisma.serviceTag.delete({
      where: { id },
    });
    if (!deleted) {
      return new AppError(404, 'Service Tag not found');
    }
    return deleted;
  },
};

module.exports = { ServiceTagService };
