const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");
const { TourDTO } = require("../dtos/tour.dto");
const { attachImagesList } = require("../utils/attachImage");

// lấy ảnh từ place
const commonInclude = (travelerId) => ({
  Service: {
    include: {
      Provider: {
        include: { user: true },
      },
      Wishlists: travelerId
        ? {
            where: { traveler_id: parseInt(travelerId, 10) },
          }
        : false,
    },
  },
  TourGuide: true,
  TourPlace: {
    include: {
      Place: true,
    },
    orderBy: {
      start_time: "asc",
    },
  },
});

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
  getAll: async (travelerId) => {
    const tours = await prisma.tour.findMany({
      include: commonInclude(travelerId),
      orderBy: { updated_at: "desc" },
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

  getById: async (id, travelerId) => {
    const tourId = parseInt(id, 10);
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
      include: commonInclude(travelerId),
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

  getByService: async (serviceId, travelerId) => {
    const tours = await prisma.tour.findMany({
      where: { service_id: parseInt(serviceId, 10) },
      include: commonInclude(travelerId),
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

    tours.sort((a, b) => {
      const isAvailableA = a.status === "AVAILABLE";
      const isAvailableB = b.status === "AVAILABLE";

      if (isAvailableA !== isAvailableB) {
        return Number(isAvailableB) - Number(isAvailableA);
      }
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

    await attachPlaceImages(tours);
    return TourDTO.fromList(tours);
  },

  getByProvider: async (providerId, travelerId) => {
    const tours = await prisma.tour.findMany({
      where: { Service: { provider_id: parseInt(providerId, 10) } },
      include: commonInclude(travelerId),
      orderBy: { updated_at: "desc" },
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

    const startTime = new Date(tourData.start_time);
    const endTime = new Date(tourData.end_time);

    if (endTime <= startTime) {
      throw new AppError(
        ERROR_CODES.INVALID_TOUR_TIME.statusCode,
        ERROR_CODES.INVALID_TOUR_TIME.message,
        ERROR_CODES.INVALID_TOUR_TIME.code,
      );
    }

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
      include: commonInclude(null),
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

    const finalStartTime = tourData.start_time ? new Date(tourData.start_time) : tour.start_time;

    const finalEndTime = tourData.end_time ? new Date(tourData.end_time) : tour.end_time;

    if (finalEndTime <= finalStartTime) {
      throw new AppError(
        ERROR_CODES.INVALID_TOUR_TIME.statusCode,
        ERROR_CODES.INVALID_TOUR_TIME.message,
        ERROR_CODES.INVALID_TOUR_TIME.code,
      );
    }

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
  checkAvailability: async (tourId, travelerId, quantity = 1) => {
    const tour = await TourService.getById(tourId, travelerId);
    if (tour.status !== "AVAILABLE") {
      return { available: false, reason: `Tour đã tạm ngưng hoặc đã kết thúc` };
    }

    return {
      available: tour.available_slots >= quantity,
      available_count: tour.available_slots,
      required_quantity: quantity,
      tour,
    };
  },

  getAvailable: async (serviceId, travelerId, startDate, endDate, participants = 1) => {
    const service_id = parseInt(serviceId, 10);
    const start = new Date(startDate);
    const end = new Date(endDate);

    const tours = await prisma.tour.findMany({
      where: {
        service_id,
        AND: [{ end_time: { gte: start } }, { start_time: { lte: end } }],
      },
      include: commonInclude(travelerId),
      orderBy: { start_time: "asc" },
    });

    const fullyInside = [];
    const overlapped = [];

    for (const tour of tours) {
      const check = await TourService.checkAvailability(tour.id, travelerId, participants);

      if (!check.available) continue;

      const isFullyInside = tour.start_time >= start && tour.end_time <= end;

      if (isFullyInside) {
        fullyInside.push(check.tour);
      } else {
        overlapped.push(check.tour);
      }
    }

    return [...fullyInside, ...overlapped];
  },
};

module.exports = { TourService };
