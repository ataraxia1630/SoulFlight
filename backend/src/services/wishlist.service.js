const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");

const WishlistService = {
  toggle: async (travelerId, serviceId) => {
    const sId = parseInt(serviceId, 10);

    const service = await prisma.service.findUnique({ where: { id: sId } });
    if (!service) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND.statusCode,
        ERROR_CODES.NOT_FOUND.message,
        ERROR_CODES.NOT_FOUND.code,
      );
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        traveler_id_service_id: {
          traveler_id: travelerId,
          service_id: sId,
        },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { id: existing.id },
      });
      return { liked: false, message: "Đã xóa khỏi danh sách yêu thích" };
    }

    await prisma.wishlist.create({
      data: {
        traveler_id: travelerId,
        service_id: sId,
      },
    });

    return { liked: true, message: "Đã thêm vào danh sách yêu thích" };
  },

  getWishlist: async (travelerId) => {
    const wishlistItems = await prisma.wishlist.findMany({
      where: { traveler_id: travelerId },
      include: {
        service: {
          include: {
            Type: true,
            Provider: {
              include: { user: { select: { name: true } } },
            },
            Wishlists: travelerId ? { where: { traveler_id: travelerId } } : false,
            Tags: {
              include: { Tag: true },
            },
            Rooms: {
              take: 1,
              select: { id: true },
            },
            Tours: {
              take: 1,
              include: {
                TourPlace: {
                  take: 1,
                  select: { place_id: true },
                },
              },
            },
            Menus: {
              take: 1,
              select: {
                cover_url: true,
                MenuItems: {
                  take: 1,
                  select: { image_url: true },
                },
              },
            },
            Tickets: {
              take: 1,
              select: { place_id: true },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return wishlistItems.map((item) => item.service);
  },
};

module.exports = WishlistService;
