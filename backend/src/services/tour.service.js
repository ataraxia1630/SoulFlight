const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");

const TourService = {
  getAll: async (_req) => {
    return await prisma.tour.findMany();
  },

  getById: async (id) => {
    const tour = await prisma.tour.findUnique({
      where: { id },
    });
    if (!tour) {
      throw new AppError(
        ERROR_CODES.TOUR_NOT_FOUND.statusCode,
        ERROR_CODES.TOUR_NOT_FOUND.message,
        ERROR_CODES.TOUR_NOT_FOUND.code,
      );
    }
    return tour;
  },

  getMine: async (req) => {
    const userId = req.user.id;
    return await prisma.tour.findMany({
      where: {
        Service: { provider_id: userId },
      },
      include: {
        Service: true,
      },
    });
  },

  create: async (data) => {
    const {
      name,
      description,
      service_price,
      duration,
      service_id,
      tourguide_id,
      places,
      is_recurring,
      repeat_rule,
      repeat_days,
      start_date,
      end_date,
      status,
    } = data;

    const created = await prisma.tour.create({
      data: {
        name,
        description,
        service_price,
        duration,
        service_id,
        tourguide_id,
        is_recurring,
        repeat_rule,
        repeat_days,
        start_date,
        end_date,
        status,
        TourPlace: {
          create: places.map((place, _index) => ({
            place_id: place.place_id,
            description: place.description,
            start_time: place.start_time,
            end_time: place.end_time,
            // order: index + 1,
          })),
        },
      },
      include: {
        TourPlace: true,
      },
    });
    return created;
  },

  update: async (id, data) => {
    const {
      name,
      description,
      service_price,
      duration,
      service_id,
      tourguide_id,
      places,
      is_recurring,
      repeat_rule,
      repeat_days,
      start_date,
      end_date,
      status,
    } = data;

    const existingTour = await prisma.tour.findUnique({
      where: { id },
      include: { TourPlaces: true },
    });
    if (!existingTour) {
      throw new AppError(
        ERROR_CODES.TOUR_NOT_FOUND.statusCode,
        ERROR_CODES.TOUR_NOT_FOUND.message,
        ERROR_CODES.TOUR_NOT_FOUND.code,
      );
    }
    const updated = await prisma.tour.update({
      where: { id },
      data: {
        name,
        description,
        service_price,
        duration,
        service_id,
        tourguide_id,
        is_recurring,
        repeat_rule,
        repeat_days,
        start_date,
        end_date,
        status,
        TourPlace: places
          ? {
              deleteMany: {},
              create: places.map((place, _index) => ({
                place_id: place.place_id,
                description: place.description,
                start_time: place.start_time,
                end_time: place.end_time,
                // order: index + 1,
              })),
            }
          : undefined,
      },
      include: { TourPlace: true },
    });
    return updated;
  },

  delete: async (id) => {
    const deleted = await prisma.tour.delete({
      where: { id },
    });
    if (!deleted) {
      throw new AppError(
        ERROR_CODES.TOUR_NOT_FOUND.statusCode,
        ERROR_CODES.TOUR_NOT_FOUND.message,
        ERROR_CODES.TOUR_NOT_FOUND.code,
      );
    }
  },
};

module.exports = { TourService };
