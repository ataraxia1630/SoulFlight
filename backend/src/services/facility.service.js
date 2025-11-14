const prisma = require("../configs/prisma");
const CloudinaryService = require("../services/cloudinary.service");
const AppError = require("../utils/AppError");
const { FacilityDTO } = require("../dtos/facility.dto");
const { ERROR_CODES } = require("../constants/errorCode");

const FacilityService = {
  create: async (data, file) => {
    let iconPublicId = null;
    if (file || data.icon_url) {
      const uploadOptions = {
        folder: "facilities",
      };
      if (file) {
        const reuslt = await CloudinaryService.uploadSingle(file.buffer, uploadOptions);
        iconPublicId = reuslt.public_id;
      } else if (data.icon_url) {
        const result = await CloudinaryService.uploadFromUrl(data.icon_url, uploadOptions);
        iconPublicId = result.public_id;
      }
    }

    const facility = await prisma.facility.create({
      data: {
        name: data.name,
        icon_url: iconPublicId,
      },
    });

    return FacilityDTO.fromModel(facility);
  },

  getAll: async () => {
    const facilities = await prisma.facility.findMany({
      orderBy: { updated_at: "desc" },
    });
    return FacilityDTO.fromList(facilities);
  },

  getOne: async (id) => {
    const parsedId = parseInt(id, 10);

    const facility = await prisma.facility.findUnique({
      where: { id: parsedId },
    });
    if (!facility) {
      throw new AppError(
        ERROR_CODES.FACILITY_NOT_FOUND.statusCode,
        ERROR_CODES.FACILITY_NOT_FOUND.message,
        ERROR_CODES.FACILITY_NOT_FOUND.code,
      );
    }

    return FacilityDTO.fromModel(facility);
  },

  update: async (id, data, file) => {
    const parsedId = parseInt(id, 10);

    const existingFacility = await prisma.facility.findUnique({
      where: { id: parsedId },
    });
    if (!existingFacility) {
      throw new AppError(
        ERROR_CODES.FACILITY_NOT_FOUND.statusCode,
        ERROR_CODES.FACILITY_NOT_FOUND.message,
        ERROR_CODES.FACILITY_NOT_FOUND.code,
      );
    }

    let iconPublicId = existingFacility.icon_url;
    if (file || data.icon_url) {
      const uploadOptions = {
        folder: "facilities",
      };

      if (existingFacility.icon_url) {
        try {
          await CloudinaryService.deleteImage(existingFacility.icon_url);
        } catch (err) {
          console.warn("Failed to delete old icon:", err.message);
        }
      }

      if (file) {
        const result = await CloudinaryService.uploadSingle(file.buffer, uploadOptions);
        iconPublicId = result.public_id;
      } else if (data.icon_url) {
        const result = await CloudinaryService.uploadFromUrl(data.icon_url, uploadOptions);
        iconPublicId = result.public_id;
      }
    }

    const updatedFacility = await prisma.facility.update({
      where: { id: parsedId },
      data: {
        name: data.name || existingFacility.name,
        icon_url: iconPublicId,
      },
    });

    return FacilityDTO.fromModel(updatedFacility);
  },

  delete: async (id) => {
    const parsedId = parseInt(id, 10);

    const facility = await prisma.facility.findUnique({
      where: { id: parsedId },
    });

    if (facility.icon_url) {
      try {
        await CloudinaryService.deleteImage(facility.icon_url);
      } catch (err) {
        console.warn("Failed to delete facility icon:", err.message);
      }
    }

    await prisma.facility.delete({
      where: { id: parsedId },
    });

    return null;
  },
};

module.exports = FacilityService;
