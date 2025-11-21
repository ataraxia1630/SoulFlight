const prisma = require("../configs/prisma");
const CloudinaryService = require("./cloudinary.service");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");
const { TravelerDTO } = require("../dtos/traveler.dto");

const ALLOWED_TRAVELER_FIELDS = ["gender", "dob", "location", "avatar_url"];

const ALLOWED_USER_FIELDS = ["name", "username", "phone"];

const TravelerService = {
  getMyProfile: async (userId) => {
    const result = await prisma.user.findUnique({
      where: { id: userId },
      include: { Traveler: true },
    });

    if (!result?.Traveler?.[0]) {
      throw new AppError(
        ERROR_CODES.USER_NOT_FOUND.statusCode,
        ERROR_CODES.USER_NOT_FOUND.message,
        ERROR_CODES.USER_NOT_FOUND.code,
      );
    }

    return TravelerDTO.fromModel(result.Traveler[0], result);
  },

  getAll: async () => {
    const usersWithTraveler = await prisma.user.findMany({
      where: { Traveler: { some: {} } },
      include: { Traveler: true },
      orderBy: { updated_at: "desc" },
    });

    return TravelerDTO.fromList(usersWithTraveler);
  },

  updateProfile: async (userId, data, file) => {
    const traveler = await prisma.traveler.findUnique({
      where: { id: userId },
    });

    if (!traveler) {
      throw new AppError(
        ERROR_CODES.USER_NOT_FOUND.statusCode,
        ERROR_CODES.USER_NOT_FOUND.message,
        ERROR_CODES.USER_NOT_FOUND.code,
      );
    }

    let avatarPublicId = traveler.avatar_url;

    if (file) {
      if (traveler.avatar_url) {
        await CloudinaryService.deleteImage(traveler.avatar_url).catch(() => {});
      }
      const uploadResult = await CloudinaryService.uploadSingle(file.buffer, {
        folder: "avatars",
      });
      avatarPublicId = uploadResult.public_id;
    }

    const travelerUpdateData = Object.keys(data)
      .filter((key) => ALLOWED_TRAVELER_FIELDS.includes(key))
      .reduce((obj, key) => {
        if (key === "dob" && data[key]) {
          obj[key] = new Date(data[key]);
        } else {
          obj[key] = data[key] ?? undefined;
        }
        return obj;
      }, {});

    const userUpdateData = Object.keys(data)
      .filter((key) => ALLOWED_USER_FIELDS.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key] ?? undefined;
        return obj;
      }, {});

    if (avatarPublicId !== traveler.avatar_url) {
      travelerUpdateData.avatar_url = avatarPublicId;
    }

    if (
      Object.keys(travelerUpdateData).length === 0 &&
      Object.keys(userUpdateData).length === 0 &&
      !file
    ) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      return TravelerDTO.fromModel(traveler, user);
    }

    const now = new Date();
    travelerUpdateData.updated_at = now;
    userUpdateData.updated_at = now;

    const [updatedTraveler, updatedUser] = await prisma.$transaction([
      prisma.traveler.update({
        where: { id: userId },
        data: travelerUpdateData,
      }),
      prisma.user.update({ where: { id: userId }, data: userUpdateData }),
    ]);

    return TravelerDTO.fromModel(updatedTraveler, updatedUser);
  },
};

module.exports = TravelerService;
