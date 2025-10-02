const prisma = require('../configs/prisma');
const AppError = require('../utils/appError');

const MenuService = {
  getAll: async () => {
    return await prisma.menu.findMany();
  },

  getById: async (id) => {
    const menu = await prisma.menu.findUnique({
      where: { id },
    });
    if (!menu) {
      return new AppError(404, 'Menu not found');
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
      return new AppError(404, 'Menu not found');
    }
    return updated;
  },

  delete: async (id) => {
    const deleted = await prisma.menu.delete({
      where: { id },
    });
    if (!deleted) {
      return new AppError(404, 'Menu not found');
    }
  },
};

module.exports = { MenuService };
