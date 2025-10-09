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
      return new AppError(
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
    const updated = await prisma.serviceType.update({
      where: { id },
      data,
    });
    if (!updated) {
      return new AppError(
        ERROR_CODES.SERVICE_TYPE_NOT_FOUND.statusCode,
        ERROR_CODES.SERVICE_TYPE_NOT_FOUND.message,
        ERROR_CODES.SERVICE_TYPE_NOT_FOUND.code
      );
    }
    return updated;
  },

  delete: async (id) => {
    const deleted = await prisma.serviceType.delete({
      where: { id },
    });
    if (!deleted) {
      return new AppError(
        ERROR_CODES.SERVICE_TYPE_NOT_FOUND.statusCode,
        ERROR_CODES.SERVICE_TYPE_NOT_FOUND.message,
        ERROR_CODES.SERVICE_TYPE_NOT_FOUND.code
      );
    }
  },
};

module.exports = { ServiceTypeService };
