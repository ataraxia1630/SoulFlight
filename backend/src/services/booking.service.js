const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");

const BookingService = {
  getBookingsByTraveler: async (travelerId, { page = 1, limit = 10, status } = {}) => {
    const where = { traveler_id: travelerId };
    if (status) where.status = status;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          provider: { select: { name: true } },
          voucher: true,
          items: {
            include: {
              room: { include: { service: true, images: true } },
              tour: true,
              ticket: { include: { place: true } },
              menu_item: true,
            },
          },
          payments: { take: 1, orderBy: { created_at: "desc" } },
        },
        orderBy: { booking_date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  getBookingDetail: async (travelerId, bookingId) => {
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, traveler_id: travelerId },
      include: {
        provider: true,
        voucher: true,
        items: {
          include: {
            room: { include: { service: true, images: true } },
            tour: true,
            ticket: { include: { place: true } },
            menu_item: true,
          },
        },
        payments: { orderBy: { created_at: "desc" } },
      },
    });

    if (!booking)
      throw new AppError(
        404,
        ERROR_CODES.BOOKING_NOT_FOUND.message,
        ERROR_CODES.BOOKING_NOT_FOUND.code,
      );
    return BookingService.enrichBookingItems(booking);
  },

  createBookingFromCart: async (travelerId, voucherCode = null) => {
    return await prisma.$transaction(async (tx) => {
      // 1. Lấy giỏ hàng đầy đủ
      const cartData = await tx.cart.findUnique({
        where: { traveler_id: travelerId },
        include: {
          items: {
            include: {
              room: { include: { service: { include: { Provider: true } } } },
              tour: { include: { Service: { include: { Provider: true } } } },
              ticket: { include: { Service: { include: { Provider: true } } } },
              menu_item: {
                include: {
                  menu: {
                    include: { service: { include: { Provider: true } } },
                  },
                },
              },
            },
          },
        },
      });

      if (!cartData || cartData.items.length === 0) {
        throw new AppError(400, ERROR_CODES.CART_EMPTY.message, ERROR_CODES.CART_EMPTY.code);
      }

      // 2. Nhóm items theo provider
      const itemsByProvider = cartData.items.reduce((acc, item) => {
        let providerId, providerName;

        if (item.item_type === "ROOM" && item.room?.service?.Provider) {
          providerId = item.room.service.Provider.id;
          providerName = item.room.service.Provider.name;
        } else if (item.item_type === "TOUR" && item.tour?.Service?.Provider) {
          providerId = item.tour.Service.Provider.id;
          providerName = item.tour.Service.Provider.name;
        } else if (item.item_type === "TICKET" && item.ticket?.Service?.Provider) {
          providerId = item.ticket.Service.Provider.id;
          providerName = item.ticket.Service.Provider.name;
        } else if (item.item_type === "MENU_ITEM" && item.menu_item?.menu?.service?.Provider) {
          providerId = item.menu_item.menu.service.Provider.id;
          providerName = item.menu_item.menu.service.Provider.name;
        } else {
          throw new AppError(400, "Không xác định được nhà cung cấp", "PROVIDER_NOT_FOUND");
        }

        if (!acc[providerId]) {
          acc[providerId] = { providerId, providerName, items: [], total: 0 };
        }

        const price = item.price || 0;
        const itemTotal = price * item.quantity;

        acc[providerId].items.push({ ...item, price, itemTotal });
        acc[providerId].total += itemTotal;

        return acc;
      }, {});

      // 3. Áp dụng voucher (nếu có) — chia đều theo tỷ lệ
      let globalVoucher = null;
      const voucherDiscounts = {}; // { providerId: discountAmount }

      if (voucherCode) {
        globalVoucher = await tx.voucher.findUnique({
          where: { code: voucherCode },
        });

        if (!globalVoucher || globalVoucher.valid_to < new Date()) {
          throw new AppError(400, "Mã giảm giá không hợp lệ hoặc hết hạn", "INVALID_VOUCHER");
        }

        const totalCartAmount = Object.values(itemsByProvider).reduce((sum, p) => sum + p.total, 0);
        const totalDiscount = totalCartAmount * (globalVoucher.discount_percent / 100);

        // Chia discount theo tỷ lệ đóng góp
        Object.keys(itemsByProvider).forEach((providerId) => {
          const ratio = itemsByProvider[providerId].total / totalCartAmount;
          voucherDiscounts[providerId] = totalDiscount * ratio;
        });
      }

      // 4. Tạo nhiều Booking (mỗi provider 1 cái)
      const createdBookings = [];

      for (const { providerId, items, total } of Object.values(itemsByProvider)) {
        const discount = voucherDiscounts[providerId] || 0;
        const finalAmount = total - discount;

        const booking = await tx.booking.create({
          data: {
            traveler_id: travelerId,
            provider_id: providerId,
            total_amount: total,
            discount_amount: discount,
            final_amount: finalAmount,
            voucher_id: globalVoucher?.id,
            status: "PENDING",
          },
        });

        // Tạo BookingItem
        const bookingItems = items.map((item) => ({
          booking_id: booking.id,
          item_type: item.item_type,
          item_id: item.item_id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          checkin_date: item.checkin_date,
          checkout_date: item.checkout_date,
          visit_date: item.visit_date,
        }));

        await tx.bookingItem.createMany({ data: bookingItems });
        createdBookings.push(booking);
      }

      // 5. Xóa giỏ hàng
      await tx.cartItem.deleteMany({ where: { cart_id: cartData.id } });

      return createdBookings;
    });
  },

  cancelBooking: async (travelerId, bookingId, _reason) => {
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, traveler_id: travelerId },
    });

    if (!booking)
      throw new AppError(
        404,
        ERROR_CODES.BOOKING_NOT_FOUND.message,
        ERROR_CODES.BOOKING_NOT_FOUND.code,
      );
    if (!["PENDING", "PAID"].includes(booking.status)) {
      throw new AppError(
        400,
        ERROR_CODES.CANNOT_CANCEL_BOOKING.message,
        ERROR_CODES.CANNOT_CANCEL_BOOKING.code,
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: "CANCELLED" },
      });

      // Có thể thêm bảng BookingCancellation nếu cần lưu lý do
    });
  },

  enrichBookingItems: (booking) => {
    booking.items = booking.items.map((item) => {
      let details = {};
      if (item.room) {
        details = {
          name: item.room.name,
          image: item.room.images[0]?.url,
          serviceId: item.room.service_id,
        };
      } else if (item.tour) {
        details = { name: item.tour.name };
      } else if (item.ticket) {
        details = { name: item.ticket.name, place: item.ticket.place.name };
      } else if (item.menu_item) {
        details = { name: item.menu_item.name };
      }
      return { ...item, details };
    });
    return booking;
  },

  getBookingsByProvider: async (providerId, filters) => {
    const where = { provider_id: providerId };
    if (filters.status) where.status = filters.status;
    if (filters.from || filters.to) {
      where.booking_date = {};
      if (filters.from) where.booking_date.gte = new Date(filters.from);
      if (filters.to) where.booking_date.lte = new Date(filters.to);
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          traveler: { include: { user: true } },
          items: true,
          payments: true,
        },
        orderBy: { booking_date: "desc" },
        skip: (filters.page - 1) * filters.limit,
        take: Number(filters.limit),
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      bookings: bookings.map(BookingService.enrichBookingItems),
      total,
      page: filters.page,
      limit: filters.limit,
    };
  },

  providerUpdateStatus: async (providerId, bookingId, newStatus, _note) => {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { provider: true },
    });

    if (!booking) {
      throw new AppError(
        404,
        ERROR_CODES.BOOKING_NOT_FOUND.message,
        ERROR_CODES.BOOKING_NOT_FOUND.code,
      );
    }

    if (booking.provider_id !== providerId) {
      throw new AppError(403, "You do not have permission to update this booking", "FORBIDDEN");
    }

    const allowedTransitions = {
      PENDING: ["CANCELLED"],
      PAID: ["IN_PROGRESS", "CANCELLED"],
      IN_PROGRESS: ["COMPLETED"],
    };

    if (["CANCELLED", "COMPLETED", "REFUNDED"].includes(booking.status)) {
      throw new AppError(
        400,
        ERROR_CODES.BOOKING_FINALIZED.message,
        ERROR_CODES.BOOKING_FINALIZED.code,
      );
    }

    const allowedNextStatuses = allowedTransitions[booking.status];
    if (!allowedNextStatuses || !allowedNextStatuses.includes(newStatus)) {
      throw new AppError(
        400,
        ERROR_CODES.INVALID_STATUS_TRANSITION.message,
        ERROR_CODES.INVALID_STATUS_TRANSITION.code,
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: newStatus },
      include: {
        items: {
          include: {
            room: { include: { service: true } },
            tour: true,
            ticket: true,
            menu_item: true,
          },
        },
        traveler: { include: { user: true } },
        provider: true,
        voucher: true,
      },
    });

    return updatedBooking;
  },

  // Admin được phép đổi bất kỳ status nào
  adminForceUpdateStatus: async (bookingId, newStatus) => {
    return await prisma.booking.update({
      where: { id: bookingId },
      data: { status: newStatus },
      include: { items: true, traveler: true, provider: true },
    });
  },
};

module.exports = { BookingService };
