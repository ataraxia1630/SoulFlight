const prisma = require('../configs/prisma');
const AppError = require('../utils/AppError');
const { ERROR_CODES } = require('../constants/errorCode');

const ServiceTypeService = {
  getAll: async () => {
    return await prisma.serviceType.findMany();
  },

  getById: async (id) => {
    const type = await prisma.serviceType.findUnique({
      where: { id },
    });
    if (!type) {
      throw new AppError(
        ERROR_CODES.SERVICE_TYPE_NOT_FOUND.statusCode,
        ERROR_CODES.SERVICE_TYPE_NOT_FOUND.message,
        ERROR_CODES.SERVICE_TYPE_NOT_FOUND.code
      );
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
    await ServiceTypeService.getById(id); // Ensure it exists
    const updated = await prisma.serviceType.update({
      where: { id },
      data,
    });
    return updated;
  },

  delete: async (id) => {
    await ServiceTypeService.getById(id); // Ensure it exists
    await prisma.serviceType.delete({
      where: { id },
    });
  },
};

module.exports = { ServiceTypeService };
