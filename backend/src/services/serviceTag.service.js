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
      throw new AppError(
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
    await ServiceTagService.getById(id); // Ensure it exists
    const updated = await prisma.serviceTag.update({
      where: { id },
      data,
    });
    return updated;
  },

  delete: async (id) => {
    await ServiceTagService.getById(id); // Ensure it exists
    await prisma.serviceTag.delete({
      where: { id },
    });
  },
};

module.exports = { ServiceTagService };
