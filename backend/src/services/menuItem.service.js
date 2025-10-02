const prisma = require('../configs/prisma');
const AppError = require('../utils/AppError');

const MenuItemService = {
  getAll: async () => {
    return await prisma.menuItem.findMany();
  },

  getById: async (id) => {
    const item = await prisma.menuItem.findUnique({
      where: { id },
    });
    if (!item) {
      return new AppError(404, 'Menu Item not found');
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
      return new AppError(404, 'Menu Item not found');
    }
    return updated;
  },

  delete: async (id) => {
    const deleted = await prisma.menuItem.delete({
      where: { id },
    });
    if (!deleted) {
      return new AppError(404, 'Menu Item not found');
    }
    return deleted;
  },
};

module.exports = { MenuItemService };
