const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const CloudinaryService = require("../services/cloudinary.service");
const { ERROR_CODES } = require("../constants/errorCode");

const MenuItemService = {
  getAll: async () => {
    return await prisma.menuItem.findMany({
      include: { Menu: true },
    });
  },

  getById: async (id) => {
    const item = await prisma.menuItem.findUnique({
      where: { id: parseInt(id, 10) },
      include: { Menu: true },
    });
    if (!item) {
      return new AppError(
        ERROR_CODES.MENU_ITEM_NOT_FOUND.statusCode,
        ERROR_CODES.MENU_ITEM_NOT_FOUND.message,
        ERROR_CODES.MENU_ITEM_NOT_FOUND.code,
      );
    }
    return item;
  },

  getByMenu: async (menuId) => {
    return await prisma.menuItem.findMany({
      where: { menu_id: parseInt(menuId, 10) },
    });
  },

  create: async (data, imageFile) => {
    let imagePublicId = null;
    if (imageFile) {
      const uploadResult = await CloudinaryService.uploadSingle(imageFile.buffer, {
        folder: "menu-items",
      });
      imagePublicId = uploadResult.public_id;
    }

    const item = await prisma.menuItem.create({
      data: {
        ...data,
        price: parseFloat(data.price),
        menu_id: parseInt(data.menu_id, 10),
        image_url: imagePublicId,
        status: data.status || "AVAILABLE",
      },
    });

    return item;
  },

  update: async (id, data, imageFile) => {
    const itemId = parseInt(id, 10);
    const item = await prisma.menuItem.findUnique({ where: { id: itemId } });
    if (!item) {
      return new AppError(
        ERROR_CODES.MENU_ITEM_NOT_FOUND.statusCode,
        ERROR_CODES.MENU_ITEM_NOT_FOUND.message,
        ERROR_CODES.MENU_ITEM_NOT_FOUND.code,
      );
    }
    let imagePublicId = item.image_url;
    if (imageFile) {
      if (item.image_url) {
        try {
          await CloudinaryService.deleteImage(item.image_url);
        } catch {
          console.warn(`Image not in cloudinary`);
        }
      }
      const uploadResult = await CloudinaryService.uploadSingle(imageFile.buffer, {
        folder: "menu-items",
      });
      imagePublicId = uploadResult.public_id;
    }

    const updated = await prisma.menuItem.update({
      where: { id: itemId },
      data: {
        ...data,
        ...(data.price && { price: parseFloat(data.price) }),
        image_url: imagePublicId,
      },
    });

    return updated;
  },

  delete: async (id) => {
    const itemId = parseInt(id, 10);
    const item = await prisma.menuItem.findUnique({ where: { id: itemId } });
    if (!item) {
      return new AppError(
        ERROR_CODES.MENU_ITEM_NOT_FOUND.statusCode,
        ERROR_CODES.MENU_ITEM_NOT_FOUND.message,
        ERROR_CODES.MENU_ITEM_NOT_FOUND.code,
      );
    }

    if (item.image_url) {
      try {
        await CloudinaryService.deleteImage(item.image_url);
      } catch {
        console.warn(`Image not in cloudinary`);
      }
    }

    await prisma.menuItem.delete({ where: { id: itemId } });
  },
};

module.exports = { MenuItemService };
