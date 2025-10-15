const prisma = require('../configs/prisma');
const AppError = require('../utils/AppError');
const { ERROR_CODES } = require('../constants/errorCode');

const PlaceService = {
  getAll: async () => {
    return await prisma.place.findMany();
  },

  getById: async (id) => {
    const place = await prisma.place.findUnique({
      where: { id },
    });
    if (!place) {
      throw new AppError(
        ERROR_CODES.PLACE_NOT_FOUND.statusCode,
        ERROR_CODES.PLACE_NOT_FOUND.message,
        ERROR_CODES.PLACE_NOT_FOUND.code
      );
    }
    return place;
  },

  create: async (data) => {
    const created = await prisma.place.create({
      data,
    });
    return created;
  },

  update: async (id, data) => {
    const updated = await prisma.place.update({
      where: { id },
      data,
    });
    if (!updated) {
      throw new AppError(
        ERROR_CODES.PLACE_NOT_FOUND.statusCode,
        ERROR_CODES.PLACE_NOT_FOUND.message,
        ERROR_CODES.PLACE_NOT_FOUND.code
      );
    }
    return updated;
  },

  delete: async (id) => {
    const deleted = await prisma.place.delete({
      where: { id },
    });
    if (!deleted) {
      throw new AppError(
        ERROR_CODES.PLACE_NOT_FOUND.statusCode,
        ERROR_CODES.PLACE_NOT_FOUND.message,
        ERROR_CODES.PLACE_NOT_FOUND.code
      );
    }
  },
};

module.exports = { PlaceService };
