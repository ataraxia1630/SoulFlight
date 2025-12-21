const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const CloudinaryService = require("../services/cloudinary.service");
const { ERROR_CODES } = require("../constants/errorCode");
const { MenuDTO } = require("../dtos/menu.dto");

const menuInclude = {
  Service: {
    include: {
      Provider: {
        include: {
          user: true,
        },
      },
    },
  },
  MenuItems: true,
};

const MenuService = {
  getAll: async () => {
    const menus = await prisma.menu.findMany({
      include: menuInclude,
      orderBy: { updated_at: "desc" },
    });
    return MenuDTO.fromList(menus);
  },

  getById: async (id) => {
    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(id, 10) },
      include: menuInclude,
    });
    if (!menu) {
      return new AppError(
        ERROR_CODES.MENU_NOT_FOUND.statusCode,
        ERROR_CODES.MENU_NOT_FOUND.message,
        ERROR_CODES.MENU_NOT_FOUND.code,
      );
    }
    return MenuDTO.fromModel(menu);
  },

  getByService: async (serviceId) => {
    const menus = await prisma.menu.findMany({
      where: { service_id: parseInt(serviceId, 10) },
      include: menuInclude,
    });
    return MenuDTO.fromList(menus);
  },

  getByProvider: async (providerId) => {
    const menus = await prisma.menu.findMany({
      where: { Service: { provider_id: parseInt(providerId, 10) } },
      include: menuInclude,
    });
    return MenuDTO.fromList(menus);
  },

  create: async (data, coverFile) => {
    let coverPublicId = null;
    if (coverFile) {
      const result = await CloudinaryService.uploadSingle(coverFile.buffer, {
        folder: "menu-covers",
      });
      coverPublicId = result.public_id;
    }

    const menu = await prisma.menu.create({
      data: {
        ...data,
        service_id: parseInt(data.service_id, 10),
        cover_url: coverPublicId,
      },
      include: menuInclude,
    });

    return MenuDTO.fromModel(menu);
  },

  update: async (id, data, coverFile) => {
    const menuId = parseInt(id, 10);
    const menu = await prisma.menu.findUnique({ where: { id: menuId } });
    if (!menu) {
      return new AppError(
        ERROR_CODES.MENU_NOT_FOUND.statusCode,
        ERROR_CODES.MENU_NOT_FOUND.message,
        ERROR_CODES.MENU_NOT_FOUND.code,
      );
    }

    let coverPublicId = menu.cover_url;
    if (coverFile) {
      if (menu.cover_url) {
        try {
          await CloudinaryService.deleteImage(menu.cover_url);
        } catch {
          console.warn(`Image not in cloudinay`);
        }
      }
      const result = await CloudinaryService.uploadSingle(coverFile.buffer, {
        folder: "menu-covers",
      });
      coverPublicId = result.public_id;
    }

    const updated = await prisma.menu.update({
      where: { id: menuId },
      data: {
        ...data,
        cover_url: coverPublicId,
      },
      include: menuInclude,
    });

    return MenuDTO.fromModel(updated);
  },

  delete: async (id) => {
    const menuId = parseInt(id, 10);

    const menu = await prisma.menu.findUnique({
      where: { id: menuId },
      include: { MenuItems: true },
    });

    if (!menu) {
      return new AppError(
        ERROR_CODES.MENU_NOT_FOUND.statusCode,
        ERROR_CODES.MENU_NOT_FOUND.message,
        ERROR_CODES.MENU_NOT_FOUND.code,
      );
    }

    await prisma.$transaction(async (tx) => {
      for (const item of menu.MenuItems) {
        if (item.image_url) {
          try {
            await CloudinaryService.deleteImage(item.image_url);
          } catch {
            console.warn(`Image not in cloudinary`);
          }
        }
      }
      await tx.menuItem.deleteMany({ where: { menu_id: menuId } });

      if (menu.cover_url) {
        try {
          await CloudinaryService.deleteImage(menu.cover_url);
        } catch {
          console.warn(`Image not in cloudinary`);
        }
      }
      await tx.menu.delete({ where: { id: menuId } });
    });

    return { message: "Menu and all its items deleted successfully" };
  },
};

module.exports = { MenuService };
