const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");

const ServiceService = {
  getAll: async () => {
    return await prisma.service.findMany();
  },
  getById: async (id) => {
    const service = await prisma.service.findUnique({
      where: { id: Number(id) },
    });
    if (!service) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND.statusCode,
        ERROR_CODES.NOT_FOUND.message,
        ERROR_CODES.NOT_FOUND.code,
      );
    }
    return service;
  },
  create: async (serviceData) => {
    return await prisma.service.create({ data: serviceData });
  },
  update: async (id, serviceData) => {
    const existingService = await prisma.service.findUnique({
      where: { id: Number(id) },
    });
    if (!existingService) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND.statusCode,
        ERROR_CODES.NOT_FOUND.message,
        ERROR_CODES.NOT_FOUND.code,
      );
    }
    return await prisma.service.update({
      where: { id: Number(id) },
      data: serviceData,
    });
  },
  delete: async (id) => {
    const existingService = await prisma.service.findUnique({
      where: { id: Number(id) },
    });
    if (!existingService) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND.statusCode,
        ERROR_CODES.NOT_FOUND.message,
        ERROR_CODES.NOT_FOUND.code,
      );
    }
    await prisma.service.delete({ where: { id: Number(id) } });
  },
};

module.exports = { ServiceService };
