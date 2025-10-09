const prisma = require('../configs/prisma');
const AppError = require('../utils/AppError');
const { ERROR_CODES } = require('../constants/errorCode');

const ServiceTagService = {
  getAll: async () => {
    return await prisma.serviceTag.findMany();
  },

  getById: async (id) => {
    const tag = await prisma.serviceTag.findUnique({
      where: { id },
    });
    if (!tag) {
      return new AppError(
        ERROR_CODES.SERVICE_TAG_NOT_FOUND.statusCode,
        ERROR_CODES.SERVICE_TAG_NOT_FOUND.message,
        ERROR_CODES.SERVICE_TAG_NOT_FOUND.code
      );
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
      return new AppError(
        ERROR_CODES.SERVICE_TAG_NOT_FOUND.statusCode,
        ERROR_CODES.SERVICE_TAG_NOT_FOUND.message,
        ERROR_CODES.SERVICE_TAG_NOT_FOUND.code
      );
    }
    return updated;
  },

  delete: async (id) => {
    const deleted = await prisma.serviceTag.delete({
      where: { id },
    });
    if (!deleted) {
      return new AppError(
        ERROR_CODES.SERVICE_TAG_NOT_FOUND.statusCode,
        ERROR_CODES.SERVICE_TAG_NOT_FOUND.message,
        ERROR_CODES.SERVICE_TAG_NOT_FOUND.code
      );
    }
    return deleted;
  },
};

module.exports = { ServiceTagService };
