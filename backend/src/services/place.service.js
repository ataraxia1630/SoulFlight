const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");
const { PlaceDTO } = require("../dtos/place.dto");
const { attachImages, attachImagesList } = require("../utils/attachImage");
const { uploadImages, updateImageList } = require("../utils/imageHandler");

const PlaceService = {
  create: async (data, files = []) => {
    const place = await prisma.place.create({ data });

    if (files.length > 0) {
      await uploadImages(place.id, files, "Place", "places");
    }

    const placeWithImages = await attachImages({
      entity: place,
      type: "Place",
    });
    return PlaceDTO.fromModel(placeWithImages);
  },

  getAll: async () => {
    const places = await prisma.place.findMany({
      orderBy: {
        updated_at: "desc",
      },
    });

    const placesWithImages = await attachImagesList({
      entities: places,
      type: "Place",
    });

    return PlaceDTO.fromList(placesWithImages);
  },

  getById: async (id) => {
    const placeId = parseInt(id, 10);
    const place = await prisma.place.findUnique({
      where: { id: placeId },
    });
    if (!place) {
      throw new AppError(
        ERROR_CODES.PLACE_NOT_FOUND.statusCode,
        ERROR_CODES.PLACE_NOT_FOUND.message,
        ERROR_CODES.PLACE_NOT_FOUND.code,
      );
    }

    const placeWithImages = await attachImages({
      entity: place,
      type: "Place",
    });
    return PlaceDTO.fromModel(placeWithImages);
  },

  update: async (id, data, files = [], imageUpdates = []) => {
    const placeId = parseInt(id, 10);
    const exists = await prisma.place.findUnique({ where: { id: placeId } });
    if (!exists) {
      throw new AppError(
        ERROR_CODES.PLACE_NOT_FOUND.statusCode,
        ERROR_CODES.PLACE_NOT_FOUND.message,
        ERROR_CODES.PLACE_NOT_FOUND.code,
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.place.update({ where: { id: placeId }, data });
      if (imageUpdates.length > 0) {
        await updateImageList(tx, placeId, "Place", imageUpdates);
      }
    });

    if (files.length > 0) {
      await uploadImages(placeId, files, "Place", "places");
    }

    const updated = await prisma.place.findUnique({ where: { id: placeId } });
    const placeWithImages = await attachImages({
      entity: updated,
      type: "Place",
    });

    return PlaceDTO.fromModel(placeWithImages);
  },

  delete: async (id) => {
    const placeId = parseInt(id, 10);

    const exists = await prisma.place.findUnique({ where: { id: placeId } });
    if (!exists) {
      throw new AppError(
        ERROR_CODES.PLACE_NOT_FOUND.statusCode,
        ERROR_CODES.PLACE_NOT_FOUND.message,
        ERROR_CODES.PLACE_NOT_FOUND.code,
      );
    }

    await prisma.$transaction(async (tx) => {
      const images = await tx.image.findMany({
        where: { related_id: placeId, related_type: "Place" },
        select: { url: true },
      });

      if (images.length > 0) {
        try {
          await CloudinaryService.deleteMultiple(images.map((i) => i.url));
        } catch {
          console.warn(`Image not in cloudinary`);
        }
      }

      await tx.image.deleteMany({
        where: { related_id: placeId, related_type: "Place" },
      });

      await tx.tourPlace.deleteMany({
        where: { place_id: placeId },
      });

      await tx.place.delete({ where: { id: placeId } });
    });
  },
};

module.exports = { PlaceService };
