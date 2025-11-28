const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");

const CartService = {
  getOrCreateCart: async (travelerId) => {
    let cart = await prisma.cart.findUnique({
      where: { traveler_id: travelerId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { traveler_id: travelerId },
        include: { items: true },
      });
    }
    return cart;
  },

  getCartByTravelerId: async (travelerId) => {
    const cart = await prisma.cart.findUnique({
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

    if (!cart)
      throw new AppError(404, ERROR_CODES.CART_NOT_FOUND.message, ERROR_CODES.CART_NOT_FOUND.code);

    // Tính giá động + gán details
    const enrichedItems = await Promise.all(
      cart.items.map(async (item) => {
        let price = 0;
        let details = null;

        if (item.item_type === "ROOM" && item.room) {
          price = Number(item.room.price_per_night);
          details = {
            name: item.room.name,
            serviceName: item.room.service.name,
            image: item.room.images[0]?.url,
          };
        } else if (item.item_type === "TOUR" && item.tour) {
          price = item.tour.service_price;
          details = { name: item.tour.name, duration: item.tour.duration };
        } else if (item.item_type === "TICKET" && item.ticket) {
          price = item.ticket.price;
          details = { name: item.ticket.name, place: item.ticket.place.name };
        } else if (item.item_type === "MENU_ITEM" && item.menu_item) {
          price = item.menu_item.price;
          details = { name: item.menu_item.name, unit: item.menu_item.unit };
        }

        return {
          ...item,
          price,
          total: price * item.quantity,
          details,
        };
      }),
    );

    return { ...cart, items: enrichedItems };
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
