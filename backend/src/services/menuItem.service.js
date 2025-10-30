const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");

const MenuItemService = {
  getAll: async () => {
    return await prisma.menuItem.findMany();
  },

  getById: async (id) => {
    const item = await prisma.menuItem.findUnique({
      where: { id },
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

  create: async (data) => {
    const created = await prisma.menuItem.create({
      data,
    });
    return created;
  },

  update: async (id, data) => {
    const updated = await prisma.menuItem.update({
      where: { id },
      data,
    });
    if (!updated) {
      return new AppError(
        ERROR_CODES.MENU_ITEM_NOT_FOUND.statusCode,
        ERROR_CODES.MENU_ITEM_NOT_FOUND.message,
        ERROR_CODES.MENU_ITEM_NOT_FOUND.code,
      );
    }
    return updated;
  },

  delete: async (id) => {
    const deleted = await prisma.menuItem.delete({
      where: { id },
    });
    if (!deleted) {
      return new AppError(
        ERROR_CODES.MENU_ITEM_NOT_FOUND.statusCode,
        ERROR_CODES.MENU_ITEM_NOT_FOUND.message,
        ERROR_CODES.MENU_ITEM_NOT_FOUND.code,
      );
    }
    return deleted;
  },
};

module.exports = { MenuItemService };
