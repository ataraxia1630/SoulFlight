const prisma = require('../configs/prisma');
const AppError = require('../utils/appError');

const ServiceTypeService = {
  getAll: async () => {
    return await prisma.serviceType.findMany();
  },

  getById: async (id) => {
    const type = await prisma.serviceType.findUnique({
      where: { id },
    });
    if (!type) {
      return new AppError(404, 'Service Type not found');
    }
    return type;
  },

  create: async (data) => {
    const created = await prisma.serviceType.create({
      data,
    });
    return created;
  },

  update: async (id, data) => {
    const updated = await prisma.serviceType.update({
      where: { id },
      data,
    });
    if (!updated) {
      return new AppError(404, 'Service Type not found');
    }
    return updated;
  },

  delete: async (id) => {
    const deleted = await prisma.serviceType.delete({
      where: { id },
    });
    if (!deleted) {
      return new AppError(404, 'Service Type not found');
    }
  },
};

module.exports = { ServiceTypeService };
