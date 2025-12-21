const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");
const { TourDTO } = require("../dtos/tour.dto");
const { attachImagesList } = require("../utils/attachImage");

// lấy ảnh từ place
const commonInclude = {
  Service: {
    include: {
      Provider: {
        include: { user: true },
      },
    },
  },
  TourGuide: true,
  TourPlace: {
    include: {
      Place: true,
    },
  },
};

const attachPlaceImages = async (tours) => {
  if (!tours || tours.length === 0) return tours;

  const allPlaces = tours.flatMap((tour) => tour.TourPlace.map((tp) => tp.Place));

  if (allPlaces.length === 0) return tours;

  const placesWithImages = await attachImagesList({
    entities: allPlaces,
    type: "Place",
  });

  const placeMap = new Map(placesWithImages.map((p) => [p.id, p]));

  tours.forEach((tour) => {
    tour.TourPlace.forEach((tp) => {
      tp.Place = placeMap.get(tp.Place.id) || tp.Place;
    });
  });

  return tours;
};

const autoUpdateTourStatus = async (tour) => {
  if (tour.end_time < new Date() && tour.status === "AVAILABLE") {
    await prisma.tour.update({
      where: { id: tour.id },
      data: { status: "NO_LONGER_PROVIDED" },
    });
    tour.status = "NO_LONGER_PROVIDED";
  }
  return tour;
};

const TourService = {
  getAll: async () => {
    const tours = await prisma.tour.findMany({
      include: commonInclude,
      orderBy: { created_at: "desc" },
    });

    // Cập nhật status
    const now = new Date();
    const expiredTours = tours.filter((t) => t.end_time < now && t.status === "AVAILABLE");

    if (expiredTours.length > 0) {
      await prisma.tour.updateMany({
        where: {
          id: { in: expiredTours.map((t) => t.id) },
          status: "AVAILABLE",
        },
        data: { status: "NO_LONGER_PROVIDED" },
      });
      expiredTours.forEach((t) => {
        t.status = "NO_LONGER_PROVIDED";
      });
    }
    await attachPlaceImages(tours);
    return TourDTO.fromList(tours);
  },

  getById: async (id) => {
    const tourId = parseInt(id, 10);
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
      include: commonInclude,
    });
    if (!tour) {
      throw new AppError(
        ERROR_CODES.TOUR_NOT_FOUND.statusCode,
        ERROR_CODES.TOUR_NOT_FOUND.message,
        ERROR_CODES.TOUR_NOT_FOUND.code,
      );
    }

    await autoUpdateTourStatus(tour);
    await attachPlaceImages([tour]);
    return TourDTO.fromModel(tour);
  },

  getByService: async (serviceId) => {
    const tours = await prisma.tour.findMany({
      where: { service_id: parseInt(serviceId, 10) },
      include: commonInclude,
    });

    const now = new Date();
    const expiredTours = tours.filter((t) => t.end_time < now && t.status === "AVAILABLE");

    if (expiredTours.length > 0) {
      await prisma.tour.updateMany({
        where: { id: { in: expiredTours.map((t) => t.id) } },
        data: { status: "NO_LONGER_PROVIDED" },
      });
      expiredTours.forEach((t) => {
        t.status = "NO_LONGER_PROVIDED";
      });
    }

    await attachPlaceImages(tours);
    return TourDTO.fromList(tours);
  },

  getByProvider: async (providerId) => {
    const tours = await prisma.tour.findMany({
      where: { Service: { provider_id: parseInt(providerId, 10) } },
      include: commonInclude,
    });

    const now = new Date();
    const expiredTours = tours.filter((t) => t.end_time < now && t.status === "AVAILABLE");

    if (expiredTours.length > 0) {
      await prisma.tour.updateMany({
        where: { id: { in: expiredTours.map((t) => t.id) } },
        data: { status: "NO_LONGER_PROVIDED" },
      });
      expiredTours.forEach((t) => {
        t.status = "NO_LONGER_PROVIDED";
      });
    }

    await attachPlaceImages(tours);
    return TourDTO.fromList(tours);
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
    const { places = [], ...tourData } = data;

    const tour = await prisma.tour.create({
      data: {
        ...tourData,
        service_price: parseFloat(tourData.service_price),
        total_price: parseFloat(tourData.total_price || tourData.service_price),
        start_time: new Date(tourData.start_time),
        end_time: new Date(tourData.end_time),
        max_participants: parseInt(tourData.max_participants, 10),
        current_bookings: 0,
        service_id: parseInt(tourData.service_id, 10),
        tourguide_id: tourData.tourguide_id ? parseInt(tourData.tourguide_id, 10) : null,
        TourPlace: {
          create: places.map((p) => ({
            place_id: parseInt(p.place_id, 10),
            description: p.description || null,
            start_time: p.start_time || null,
            end_time: p.end_time || null,
          })),
        },
      },
      include: commonInclude,
    });

    return await TourService.getById(tour.id);
  },

  update: async (id, data) => {
    const tourId = parseInt(id, 10);
    const tour = await prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour) {
      throw new AppError(
        ERROR_CODES.TOUR_NOT_FOUND.statusCode,
        ERROR_CODES.TOUR_NOT_FOUND.message,
        ERROR_CODES.TOUR_NOT_FOUND.code,
      );
    }
    const { places, ...tourData } = data;

    const updateData = {
      ...tourData,
      ...(tourData.service_price && {
        service_price: parseFloat(tourData.service_price),
      }),
      ...(tourData.total_price && {
        total_price: parseFloat(tourData.total_price),
      }),
      ...(tourData.start_time && { start_time: new Date(tourData.start_time) }),
      ...(tourData.end_time && { end_time: new Date(tourData.end_time) }),
      ...(tourData.max_participants && {
        max_participants: parseInt(tourData.max_participants, 10),
      }),
      ...(tourData.service_id && {
        service_id: parseInt(tourData.service_id, 10),
      }),
      ...(tourData.tourguide_id !== undefined && {
        tourguide_id: tourData.tourguide_id ? parseInt(tourData.tourguide_id, 10) : null,
      }),
    };

    if (places !== undefined) {
      updateData.TourPlace = {
        deleteMany: {},
        create: places.map((p) => ({
          place_id: parseInt(p.place_id, 10),
          description: p.description || null,
          start_time: p.start_time || null,
          end_time: p.end_time || null,
        })),
      };
    }

    await prisma.tour.update({
      where: { id: tourId },
      data: updateData,
    });

    return await TourService.getById(tourId);
  },

  delete: async (id) => {
    const tourId = parseInt(id, 10);
    const tour = await prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour) {
      throw new AppError(
        ERROR_CODES.TOUR_NOT_FOUND.statusCode,
        ERROR_CODES.TOUR_NOT_FOUND.message,
        ERROR_CODES.TOUR_NOT_FOUND.code,
      );
    }
    await prisma.tourPlace.deleteMany({ where: { tour_id: tourId } });
    await prisma.tour.delete({ where: { id: tourId } });
  },

  // dùng cho booking
  checkAvailability: async (tourId, checkIn, checkOut, quantity = 1) => {
    const tour = await TourService.getById(tourId);

    const d = (x) => new Date(x).toISOString().slice(0, 10);

    const inDate = d(checkIn);
    const outDate = d(checkOut);
    const start = d(tour.start_time);
    const end = d(tour.end_time);

    if (inDate < start || outDate > end) {
      return {
        available: false,
        reason: "Khoảng ngày người dùng chọn phải nằm hoàn toàn bên trong thời gian tour",
      };
    }

    if (tour.status !== "AVAILABLE") {
      return { available: false, reason: `Tour is ${tour.status}` };
    }

    return {
      available: tour.available_slots >= quantity,
      available_count: tour.available_slots,
      required_quantity: quantity,
      tour,
    };
  },

  getAvailable: async (serviceId, checkIn, checkOut, participants = 1) => {
    const tours = await TourService.getByService(serviceId);
    const results = [];

    if (!checkIn || !checkOut) {
      throw new AppError(
        ERROR_CODES.MISSING_DATES.statusCode,
        ERROR_CODES.MISSING_DATES.message,
        ERROR_CODES.MISSING_DATES.code,
      );
    }

    for (const tour of tours) {
      const check = await TourService.checkAvailability(tour.id, checkIn, checkOut, participants);

      if (check.available) results.push(check.tour);
    }

    return results;
  },
};

module.exports = { TourService };
