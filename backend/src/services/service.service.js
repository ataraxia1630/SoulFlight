const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");
const { ServiceDTO } = require("../dtos/service.dto");

const ServiceService = {
  getAll: async () => {
    const services = await prisma.service.findMany({
      include: {
        Provider: { include: { user: true } },
        Type: true,
      },
    });
    return ServiceDTO.fromList(services);
  },

  getById: async (id) => {
    const service = await prisma.service.findUnique({
      where: { id: Number(id) },
      include: {
        Provider: { include: { user: true } },
        Type: true,
      },
    });
    if (!service) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND.statusCode,
        ERROR_CODES.NOT_FOUND.message,
        ERROR_CODES.NOT_FOUND.code,
      );
    }
    return ServiceDTO.fromModel(service);
  },

  getByProvider: async (providerId) => {
    const services = await prisma.service.findMany({
      where: {
        provider_id: Number(providerId),
      },
      include: {
        Provider: { include: { user: true } },
        Type: true,
      },
    });
    return ServiceDTO.fromList(services);
  },

  create: async (serviceData) => {
    const service = await prisma.service.create({
      data: serviceData,
      include: {
        Provider: { include: { user: true } },
        Type: true,
      },
    });
    return ServiceDTO.fromModel(service);
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
    const service = await prisma.service.update({
      where: { id: Number(id) },
      data: serviceData,
      include: {
        Provider: { include: { user: true } },
        Type: true,
      },
    });
    return ServiceDTO.fromModel(service);
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
