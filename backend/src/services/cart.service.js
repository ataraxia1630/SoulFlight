const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");

const CartService = {
  getOrCreateCart: async (travelerId) => {
    let cart = await prisma.cart.findUnique({
      where: { traveler_id: travelerId },
      include: {
        items: {
          include: {
            room: true,
            tour: true,
            ticket: true,
            menu_item: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { traveler_id: travelerId },
        include: {
          items: {
            include: {
              room: true,
              tour: true,
              ticket: true,
              menu_item: true,
            },
          },
        },
      });
    }
    return cart;
  },

  getCartByTravelerId: async (travelerId) => {
    try {
      const cart = await prisma.cart.findUnique({
        where: { traveler_id: travelerId },
        include: {
          items: {
            include: {
              room: { include: { service: true } },
              tour: { include: { Service: true } },
              ticket: { include: { Service: true } },
              menu_item: { include: { Menu: { include: { Service: true } } } },
            },
          },
        },
      });

      if (!cart) return { items: [] };

      const enrichedItems = cart.items.map((item) => {
        let price = 0;
        let serviceInfo = null;
        let name = "";

        if (item.item_type === "ROOM" && item.room) {
          price = Number(item.room.price_per_night);
          serviceInfo = item.room.service;
          name = item.room.name;
        } else if (item.item_type === "TOUR" && item.tour) {
          price = Number(item.tour.total_price);
          serviceInfo = item.tour.Service;
          name = item.tour.name;
        } else if (item.item_type === "TICKET" && item.ticket) {
          price = Number(item.ticket.price);
          serviceInfo = item.ticket.Service;
          name = item.ticket.name;
        } else if (item.item_type === "MENU_ITEM" && item.menu_item) {
          price = Number(item.menu_item.price);
          serviceInfo = item.menu_item.Menu?.Service;
          name = item.menu_item.name;
        }

        return {
          ...item,
          price,
          total: price * item.quantity,
          serviceId: serviceInfo?.id,
          serviceName: serviceInfo?.name,
          itemName: name,
        };
      });

      const groupedByService = enrichedItems.reduce((acc, item) => {
        const sId = item.serviceId || "unknown";
        if (!acc[sId]) {
          acc[sId] = {
            serviceId: sId,
            serviceName: item.serviceName || "Dịch vụ không xác định",
            items: [],
            serviceTotal: 0,
          };
        }
        acc[sId].items.push(item);
        acc[sId].serviceTotal += item.total;
        return acc;
      }, {});

      return {
        id: cart.id,
        traveler_id: cart.traveler_id,
        services: Object.values(groupedByService),
      };
    } catch (_error) {
      throw new AppError(500, "Không thể tải giỏ hàng", "CART_LOAD_FAILED");
    }
  },

  addToCart: async (travelerId, data) => {
    const cart = await CartService.getOrCreateCart(travelerId);

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart.id,
        item_type: data.itemType,
        item_id: data.itemId,
        checkin_date: data.checkinDate || null,
        checkout_date: data.checkoutDate || null,
        visit_date: data.visitDate || null,
      },
    });

    if (existingItem) {
      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (data.quantity || 1) },
      });
    }

    return await prisma.cartItem.create({
      data: {
        cart_id: cart.id,
        item_type: data.itemType,
        item_id: data.itemId,
        quantity: data.quantity || 1,
        checkin_date: data.checkinDate,
        checkout_date: data.checkoutDate,
        visit_date: data.visitDate,
        note: data.note,
      },
    });
  },

  updateCartItem: async (travelerId, itemId, data) => {
    const cart = await prisma.cart.findUnique({
      where: { traveler_id: travelerId },
    });
    if (!cart)
      throw new AppError(404, ERROR_CODES.CART_NOT_FOUND.message, ERROR_CODES.CART_NOT_FOUND.code);

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
    });
    if (!item || item.cart_id !== cart.id) {
      throw new AppError(
        404,
        ERROR_CODES.CART_ITEM_NOT_FOUND.message,
        ERROR_CODES.CART_ITEM_NOT_FOUND.code,
      );
    }

    return await prisma.cartItem.update({
      where: { id: itemId },
      data,
    });
  },

  removeFromCart: async (travelerId, itemId) => {
    const cart = await prisma.cart.findUnique({
      where: { traveler_id: travelerId },
    });
    if (!cart)
      throw new AppError(404, ERROR_CODES.CART_NOT_FOUND.message, ERROR_CODES.CART_NOT_FOUND.code);

    const result = await prisma.cartItem.deleteMany({
      where: { id: itemId, cart_id: cart.id },
    });

    if (result.count === 0) {
      throw new AppError(
        404,
        ERROR_CODES.CART_ITEM_NOT_FOUND.message,
        ERROR_CODES.CART_ITEM_NOT_FOUND.code,
      );
    }
  },

  clearCart: async (travelerId) => {
    const cart = await prisma.cart.findUnique({
      where: { traveler_id: travelerId },
    });
    if (!cart) return;

    await prisma.cartItem.deleteMany({
      where: { cart_id: cart.id },
    });
  },
};

module.exports = { CartService };
