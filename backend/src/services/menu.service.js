const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");

const MenuService = {
  getAll: async () => {
    return await prisma.menu.findMany();
  },

  getById: async (id) => {
    const menu = await prisma.menu.findUnique({
      where: { id },
    });
    if (!menu) {
      return new AppError(
        ERROR_CODES.MENU_NOT_FOUND.statusCode,
        ERROR_CODES.MENU_NOT_FOUND.message,
        ERROR_CODES.MENU_NOT_FOUND.code,
      );
    }
    return menu;
  },

  create: async (data) => {
    const created = await prisma.menu.create({
      data,
    });
    return created;
  },

  update: async (id, data) => {
    const updated = await prisma.menu.update({
      where: { id },
      data,
    });
    if (!updated) {
      return new AppError(
        ERROR_CODES.MENU_NOT_FOUND.statusCode,
        ERROR_CODES.MENU_NOT_FOUND.message,
        ERROR_CODES.MENU_NOT_FOUND.code,
      );
    }
    return updated;
  },

  delete: async (id) => {
    const deleted = await prisma.menu.delete({
      where: { id },
    });
    if (!deleted) {
      return new AppError(
        ERROR_CODES.MENU_NOT_FOUND.statusCode,
        ERROR_CODES.MENU_NOT_FOUND.message,
        ERROR_CODES.MENU_NOT_FOUND.code,
      );
    }
  },
};

module.exports = { MenuService };
