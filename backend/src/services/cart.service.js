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
      const cart = await CartService.getOrCreateCart(travelerId);

      if (!cart.items || cart.items.length === 0) {
        return { id: cart.id, traveler_id: cart.traveler_id, items: [] };
      }

      const enrichedItems = await Promise.all(
        cart.items.map(async (item) => {
          try {
            let price = 0;
            let details = { providerId: null, providerName: "Unknown" };

            if (item.item_type === "ROOM" && item.room) {
              price = Number(item.room[0].price_per_night || 0);
              details = {
                providerId: item.room.service?.provider_id,
                providerName: item.room.service?.Provider?.name || "Unknown",
                name: item.room.name,
                image: item.room.images?.[0]?.url,
              };
            }

            return {
              id: item.id,
              item_type: item.item_type,
              item_id: item.item_id,
              quantity: item.quantity,
              checkin_date: item.checkin_date,
              checkout_date: item.checkout_date,
              visit_date: item.visit_date,
              note: item.note,
              price,
              total: price * item.quantity,
              details,
            };
          } catch (itemError) {
            console.error("Lỗi khi enrich item ID", item.id, ":", itemError);
            return {
              ...item,
              price: 0,
              total: 0,
              details: { providerId: null, providerName: "Error" },
            };
          }
        }),
      );

      return {
        id: cart.id,
        traveler_id: cart.traveler_id,
        items: enrichedItems,
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
