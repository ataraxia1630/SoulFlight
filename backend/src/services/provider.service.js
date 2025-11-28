const prisma = require("../configs/prisma");
const CloudinaryService = require("./cloudinary.service");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");
const { ProviderDTO } = require("../dtos/provider.dto");

const ALLOWED_PROVIDER_FIELDS = [
  "description",
  "province",
  "country",
  "address",
  "website_link",
  "id_card",
  "establish_year",
];

const ALLOWED_USER_FIELDS = ["name", "username", "phone", "status"];

const ProviderService = {
  getMyProfile: async (userId) => {
    const result = await prisma.user.findUnique({
      where: { id: userId },
      include: { Provider: true },
    });

    if (!result?.Provider?.[0]) {
      throw new AppError(
        ERROR_CODES.USER_NOT_FOUND.statusCode,
        ERROR_CODES.USER_NOT_FOUND.message,
        ERROR_CODES.USER_NOT_FOUND.code,
      );
    }

    return ProviderDTO.fromModel(result.Provider[0], result);
  },

  getAll: async () => {
    const usersWithProvider = await prisma.user.findMany({
      where: { Provider: { some: {} } },
      include: { Provider: true },
      orderBy: { updated_at: "desc" },
    });

    return ProviderDTO.fromList(usersWithProvider);
  },

  updateProfile: async (userId, data, file) => {
    const provider = await prisma.provider.findUnique({
      where: { id: userId },
    });

    if (!provider) {
      throw new AppError(
        ERROR_CODES.USER_NOT_FOUND.statusCode,
        ERROR_CODES.USER_NOT_FOUND.message,
        ERROR_CODES.USER_NOT_FOUND.code,
      );
    }

    let logoPublicId = provider.logo_url;

    if (file) {
      if (provider.logo_url) {
        await CloudinaryService.deleteImage(provider.logo_url).catch(() => {});
      }
      const uploadResult = await CloudinaryService.uploadSingle(file.buffer, {
        folder: "logos",
      });
      logoPublicId = uploadResult.public_id;
    }

    const providerUpdateData = Object.keys(data)
      .filter((key) => ALLOWED_PROVIDER_FIELDS.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key] ?? undefined;
        return obj;
      }, {});

    const userUpdateData = Object.keys(data)
      .filter((key) => ALLOWED_USER_FIELDS.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key] ?? undefined;
        return obj;
      }, {});

    if (logoPublicId !== provider.logo_url) {
      providerUpdateData.logo_url = logoPublicId;
    }

    if (
      Object.keys(providerUpdateData).length === 0 &&
      Object.keys(userUpdateData).length === 0 &&
      !file
    ) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      return ProviderDTO.fromModel(provider, user);
    }

    const now = new Date();
    providerUpdateData.updated_at = now;
    userUpdateData.updated_at = now;

    const [updatedProvider, updatedUser] = await prisma.$transaction([
      prisma.provider.update({
        where: { id: userId },
        data: providerUpdateData,
      }),
      prisma.user.update({ where: { id: userId }, data: userUpdateData }),
    ]);

    return ProviderDTO.fromModel(updatedProvider, updatedUser);
  },
};

module.exports = ProviderService;
