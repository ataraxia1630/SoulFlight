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
          provider: {
            include: {
              user: { select: { name: true } },
            },
          },
          voucher: true,
          items: {
            include: {
              room: { include: { service: true } },
              tour: true,
              ticket: { include: { place: true } },
              menu_item: true,
            },
          },
          payment: { select: { id: true, status: true, method: true } },
        },
        orderBy: { booking_date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      bookings: bookings.map(BookingService.enrichBookingItems),
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
        provider: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
          },
        },
        voucher: true,
        items: true,
        payment: true,
        reviews: true,
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
              room: {
                include: {
                  service: { include: { Provider: true } },
                },
              },
              tour: {
                include: {
                  Service: { include: { Provider: true } },
                },
              },
              ticket: {
                include: {
                  Service: { include: { Provider: true } },
                  Place: { select: { name: true } },
                },
              },
              menu_item: {
                include: {
                  Menu: {
                    include: { Service: { include: { Provider: true } } },
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

      // 2. Validate dates và availability
      for (const item of cartData.items) {
        await BookingService.validateCartItem(tx, item);
      }

      // 3. Nhóm items theo provider và tính giá
      const itemsByProvider = await BookingService.groupItemsByProvider(cartData.items);

      // 4. Áp dụng voucher (nếu có)
      let globalVoucher = null;
      const voucherDiscounts = {};

      if (voucherCode) {
        const voucherResult = await BookingService.applyVoucher(tx, voucherCode, itemsByProvider);
        globalVoucher = voucherResult.voucher;
        Object.assign(voucherDiscounts, voucherResult.discounts);
      }

      // 5. Tạo bookings cho từng provider
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

        // Tạo BookingItems
        const bookingItems = items.map((item) => ({
          booking_id: booking.id,
          item_type: item.item_type,
          item_id: item.item_id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.itemTotal,
          checkin_date: item.checkin_date,
          checkout_date: item.checkout_date,
          visit_date: item.visit_date,
        }));

        await tx.bookingItem.createMany({ data: bookingItems });

        // Update availability
        await BookingService.updateAvailability(tx, items, "decrement");

        createdBookings.push(booking);
      }

      // 6. Update voucher usage
      if (globalVoucher) {
        await tx.voucher.update({
          where: { id: globalVoucher.id },
          data: { used_count: { increment: 1 } },
        });
      }

      // 7. Xóa giỏ hàng
      await tx.cartItem.deleteMany({ where: { cart_id: cartData.id } });

      return createdBookings;
    });
  },

  // Helper: Validate cart item
  validateCartItem: async (tx, item) => {
    if (item.item_type === "ROOM") {
      if (!item.checkin_date || !item.checkout_date) {
        throw new AppError(
          400,
          "Room booking phải có checkin_date và checkout_date",
          "MISSING_DATES",
        );
      }

      const checkin = new Date(item.checkin_date);
      const checkout = new Date(item.checkout_date);

      if (checkout <= checkin) {
        throw new AppError(400, "Checkout phải sau checkin", "INVALID_DATES");
      }

      if (checkin < new Date()) {
        throw new AppError(400, "Không thể đặt phòng quá khứ", "PAST_DATE");
      }

      // Check availability
      const dates = BookingService.getDateRange(checkin, checkout);
      for (const date of dates) {
        const avail = await tx.roomAvailability.findUnique({
          where: {
            room_id_date: { room_id: item.item_id, date },
          },
        });

        if (!avail || avail.available_count < item.quantity) {
          throw new AppError(400, `Phòng "${item.room?.name}" không đủ chỗ`, "ROOM_UNAVAILABLE");
        }
      }
    }

    if (item.item_type === "TOUR") {
      if (!item.visit_date) {
        throw new AppError(400, "Tour phải có visit_date", "MISSING_DATE");
      }

      if (new Date(item.visit_date) < new Date()) {
        throw new AppError(400, "Không thể đặt tour quá khứ", "PAST_DATE");
      }

      const tour = await tx.tour.findUnique({ where: { id: item.item_id } });
      if (tour.current_bookings + item.quantity > tour.max_participants) {
        throw new AppError(400, `Tour "${item.tour?.name}" đã đầy`, "TOUR_FULL");
      }
    }

    if (item.item_type === "TICKET") {
      if (!item.visit_date) {
        throw new AppError(400, "Ticket phải có visit_date", "MISSING_DATE");
      }

      if (new Date(item.visit_date) < new Date()) {
        throw new AppError(400, "Không thể đặt ticket quá khứ", "PAST_DATE");
      }

      const avail = await tx.ticketAvailability.findUnique({
        where: {
          ticket_id_date: {
            ticket_id: item.item_id,
            date: new Date(item.visit_date),
          },
        },
      });

      if (avail && avail.available_count < item.quantity) {
        throw new AppError(400, "Ticket không đủ số lượng", "TICKET_UNAVAILABLE");
      }
    }
  },

  // Helper: Group items by provider
  groupItemsByProvider: (cartItems) => {
    return cartItems.reduce((acc, item) => {
      let providerId,
        providerName,
        price = 0;

      if (item.item_type === "ROOM" && item.room?.service?.Provider) {
        providerId = item.room.service.Provider.id;
        providerName = item.room.service.Provider.user?.name || "Unknown";

        const checkin = new Date(item.checkin_date);
        const checkout = new Date(item.checkout_date);
        const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
        price = Number(item.room.price_per_night) * nights;
      } else if (item.item_type === "TOUR" && item.tour?.Service?.Provider) {
        providerId = item.tour.Service.Provider.id;
        providerName = item.tour.Service.Provider.user?.name || "Unknown";
        price = Number(item.tour.total_price);
      } else if (item.item_type === "TICKET" && item.ticket?.Service?.Provider) {
        providerId = item.ticket.Service.Provider.id;
        providerName = item.ticket.Service.Provider.user?.name || "Unknown";
        price = Number(item.ticket.price);
      } else if (item.item_type === "MENU_ITEM" && item.menu_item?.Menu?.Service?.Provider) {
        providerId = item.menu_item.Menu.Service.Provider.id;
        providerName = item.menu_item.Menu.Service.Provider.user?.name || "Unknown";
        price = Number(item.menu_item.price);
      } else {
        throw new AppError(400, "Không xác định được provider", "PROVIDER_NOT_FOUND");
      }

      if (!acc[providerId]) {
        acc[providerId] = { providerId, providerName, items: [], total: 0 };
      }

      const itemTotal = price * item.quantity;

      acc[providerId].items.push({
        ...item,
        price,
        itemTotal,
      });
      acc[providerId].total += itemTotal;

      return acc;
    }, {});
  },

  // Helper: Apply voucher
  applyVoucher: async (tx, voucherCode, itemsByProvider) => {
    const voucher = await tx.voucher.findUnique({
      where: { code: voucherCode },
    });

    if (!voucher || (voucher.valid_to && voucher.valid_to < new Date())) {
      throw new AppError(400, "Mã giảm giá không hợp lệ", "INVALID_VOUCHER");
    }

    if (voucher.max_uses && voucher.used_count >= voucher.max_uses) {
      throw new AppError(400, "Mã giảm giá đã hết lượt sử dụng", "VOUCHER_LIMIT_REACHED");
    }

    const totalCartAmount = Object.values(itemsByProvider).reduce((sum, p) => sum + p.total, 0);
    const totalDiscount = totalCartAmount * (voucher.discount_percent / 100);

    const discounts = {};
    Object.keys(itemsByProvider).forEach((providerId) => {
      const ratio = itemsByProvider[providerId].total / totalCartAmount;
      discounts[providerId] = totalDiscount * ratio;
    });

    return { voucher, discounts };
  },

  // Helper: Update availability
  updateAvailability: async (tx, items, operation) => {
    for (const item of items) {
      if (item.item_type === "ROOM") {
        const dates = BookingService.getDateRange(
          new Date(item.checkin_date),
          new Date(item.checkout_date),
        );

        for (const date of dates) {
          await tx.roomAvailability.updateMany({
            where: { room_id: item.item_id, date },
            data: {
              available_count: {
                [operation]: item.quantity,
              },
            },
          });
        }
      }

      if (item.item_type === "TOUR") {
        await tx.tour.update({
          where: { id: item.item_id },
          data: {
            current_bookings: {
              [operation]: item.quantity,
            },
          },
        });
      }

      if (item.item_type === "TICKET") {
        await tx.ticketAvailability.update({
          where: {
            ticket_id_date: {
              ticket_id: item.item_id,
              date: new Date(item.visit_date),
            },
          },
          data: {
            available_count: {
              [operation]: item.quantity,
            },
          },
        });
      }
    }
  },

  // Helper: Get date range
  getDateRange: (start, end) => {
    const dates = [];
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  },

  cancelBooking: async (travelerId, bookingId, reason) => {
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, traveler_id: travelerId },
      include: { items: true },
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
        data: {
          status: "CANCELLED",
          notes: reason ? `Cancelled: ${reason}` : booking.notes,
        },
      });

      // Restore availability
      await BookingService.updateAvailability(tx, booking.items, "increment");

      // TODO: Trigger refund if paid
      if (booking.status === "PAID" && booking.payment_id) {
        // await PaymentService.initiateRefund(booking.payment_id);
      }
    });
  },

  enrichBookingItems: (booking) => {
    if (booking.items) {
      booking.items = booking.items.map((item) => {
        let details = {};
        if (item.room) {
          details = {
            name: item.room.name,
            image: item.room.image_url,
            serviceId: item.room.service_id,
          };
        } else if (item.tour) {
          details = { name: item.tour.name };
        } else if (item.ticket) {
          details = { name: item.ticket.name, place: item.ticket.Place?.name };
        } else if (item.menu_item) {
          details = { name: item.menu_item.name };
        }
        return { ...item, details };
      });
    }
    return booking;
  },

  createRoomBooking: async (travelerId, bookingData) => {
    const { roomId, checkinDate, checkoutDate, quantity, voucherCode, guestInfo } = bookingData;

    return await prisma.$transaction(async (tx) => {
      // 1. Lấy thông tin room
      const room = await tx.room.findUnique({
        where: { id: roomId },
        include: {
          service: {
            include: { Provider: true },
          },
        },
      });

      if (!room) {
        throw new AppError(404, "Không tìm thấy phòng", "ROOM_NOT_FOUND");
      }

      // 2. Validate dates
      const checkin = new Date(checkinDate);
      const checkout = new Date(checkoutDate);

      if (checkout <= checkin) {
        throw new AppError(400, "Checkout phải sau checkin", "INVALID_DATES");
      }

      if (checkin < new Date()) {
        throw new AppError(400, "Không thể đặt phòng quá khứ", "PAST_DATE");
      }

      // 3. Check availability
      const dates = BookingService.getDateRange(checkin, checkout);
      for (const date of dates) {
        const avail = await tx.roomAvailability.findUnique({
          where: {
            room_id_date: { room_id: roomId, date },
          },
        });

        if (!avail || avail.available_count < quantity) {
          throw new AppError(
            400,
            `Phòng không đủ chỗ cho ngày ${date.toLocaleDateString("vi-VN")}`,
            "ROOM_UNAVAILABLE",
          );
        }
      }

      // 4. Tính giá
      const nights = dates.length;
      const pricePerNight = Number(room.price_per_night);
      const totalAmount = pricePerNight * nights * quantity;

      // 5. Áp dụng voucher
      let discount = 0;
      let voucherId = null;

      if (voucherCode) {
        const voucher = await tx.voucher.findUnique({
          where: { code: voucherCode },
        });

        if (voucher && (!voucher.valid_to || voucher.valid_to >= new Date())) {
          // Check if voucher applies to this service
          if (voucher.is_global || voucher.service_id === room.service_id) {
            discount = totalAmount * (voucher.discount_percent / 100);
            voucherId = voucher.id;

            // Update usage
            await tx.voucher.update({
              where: { id: voucher.id },
              data: { used_count: { increment: 1 } },
            });
          }
        }
      }

      const finalAmount = totalAmount - discount;

      // 6. Tạo booking
      const booking = await tx.booking.create({
        data: {
          traveler_id: travelerId,
          provider_id: room.service.Provider.id,
          total_amount: totalAmount,
          discount_amount: discount,
          final_amount: finalAmount,
          voucher_id: voucherId,
          status: "PENDING",
          notes: guestInfo ? JSON.stringify(guestInfo) : null,
        },
      });

      // 7. Tạo booking item
      await tx.bookingItem.create({
        data: {
          booking_id: booking.id,
          item_type: "ROOM",
          item_id: roomId,
          quantity,
          unit_price: pricePerNight,
          total_price: totalAmount,
          checkin_date: checkin,
          checkout_date: checkout,
        },
      });

      // 8. Update availability
      for (const date of dates) {
        await tx.roomAvailability.updateMany({
          where: { room_id: roomId, date },
          data: {
            available_count: { decrement: quantity },
          },
        });
      }

      // 9. Return full booking
      return await tx.booking.findUnique({
        where: { id: booking.id },
        include: {
          provider: { include: { user: true } },
          items: true,
          voucher: true,
        },
      });
    });
  },

  createTourBooking: async (travelerId, bookingData) => {
    const { tourId, visitDate, quantity, voucherCode, guestInfo } = bookingData;
    console.log(bookingData);
    return await prisma.$transaction(async (tx) => {
      // 1. Lấy thông tin tour
      const tour = await tx.tour.findUnique({
        where: { id: tourId },
        include: {
          Service: {
            include: { Provider: true },
          },
        },
      });

      if (!tour) {
        throw new AppError(404, "Không tìm thấy tour", "TOUR_NOT_FOUND");
      }
      console.log(tour);
      // 2. Validate date
      const visit = new Date(visitDate);
      if (visit < new Date()) {
        throw new AppError(400, "Không thể đặt tour quá khứ", "PAST_DATE");
      }

      // 3. Check availability
      if (tour.current_bookings + quantity > tour.max_participants) {
        throw new AppError(400, "Tour đã đầy chỗ", "TOUR_FULL");
      }

      // 4. Tính giá
      const totalAmount = Number(tour.total_price) * quantity;

      // 5. Áp dụng voucher
      let discount = 0;
      let voucherId = null;

      if (voucherCode) {
        const voucher = await tx.voucher.findUnique({
          where: { code: voucherCode },
        });

        if (voucher && (!voucher.valid_to || voucher.valid_to >= new Date())) {
          if (voucher.is_global || voucher.service_id === tour.service_id) {
            discount = totalAmount * (voucher.discount_percent / 100);
            voucherId = voucher.id;

            await tx.voucher.update({
              where: { id: voucher.id },
              data: { used_count: { increment: 1 } },
            });
          }
        }
      }

      const finalAmount = totalAmount - discount;

      // 6. Tạo booking
      const booking = await tx.booking.create({
        data: {
          traveler_id: travelerId,
          provider_id: tour.Service.Provider.id,
          total_amount: totalAmount,
          discount_amount: discount,
          final_amount: finalAmount,
          voucher_id: voucherId,
          status: "PENDING",
          notes: guestInfo ? JSON.stringify(guestInfo) : null,
        },
      });
      console.log(booking);

      // 7. Tạo booking item
      await tx.bookingItem.create({
        data: {
          booking_id: booking.id,
          item_type: "TOUR",
          item_id: tourId,
          quantity,
          unit_price: tour.total_price,
          total_price: totalAmount,
          visit_date: visit,
        },
      });

      // 8. Update tour bookings
      await tx.tour.update({
        where: { id: tourId },
        data: {
          current_bookings: { increment: quantity },
        },
      });

      // 9. Return full booking
      return await tx.booking.findUnique({
        where: { id: booking.id },
        include: {
          provider: { include: { user: true } },
          items: true,
          voucher: true,
        },
      });
    });
  },

  createTicketBooking: async (travelerId, bookingData) => {
    const { ticketId, visitDate, quantity, voucherCode, guestInfo } = bookingData;

    return await prisma.$transaction(async (tx) => {
      // 1. Lấy thông tin ticket
      const ticket = await tx.ticket.findUnique({
        where: { id: ticketId },
        include: {
          Service: {
            include: { Provider: true },
          },
          Place: true,
        },
      });

      if (!ticket) {
        throw new AppError(404, "Không tìm thấy vé", "TICKET_NOT_FOUND");
      }

      // 2. Validate date
      const visit = new Date(visitDate);
      if (visit < new Date()) {
        throw new AppError(400, "Không thể đặt vé quá khứ", "PAST_DATE");
      }

      // 3. Check availability
      const avail = await tx.ticketAvailability.findUnique({
        where: {
          ticket_id_date: {
            ticket_id: ticketId,
            date: visit,
          },
        },
      });

      if (avail && avail.available_count < quantity) {
        throw new AppError(400, "Vé không đủ số lượng", "TICKET_UNAVAILABLE");
      }

      // 4. Tính giá
      const totalAmount = Number(ticket.price) * quantity;

      // 5. Áp dụng voucher
      let discount = 0;
      let voucherId = null;

      if (voucherCode) {
        const voucher = await tx.voucher.findUnique({
          where: { code: voucherCode },
        });

        if (voucher && (!voucher.valid_to || voucher.valid_to >= new Date())) {
          if (voucher.is_global || voucher.service_id === ticket.service_id) {
            discount = totalAmount * (voucher.discount_percent / 100);
            voucherId = voucher.id;

            await tx.voucher.update({
              where: { id: voucher.id },
              data: { used_count: { increment: 1 } },
            });
          }
        }
      }

      const finalAmount = totalAmount - discount;

      // 6. Tạo booking
      const booking = await tx.booking.create({
        data: {
          traveler_id: travelerId,
          provider_id: ticket.Service.Provider.id,
          total_amount: totalAmount,
          discount_amount: discount,
          final_amount: finalAmount,
          voucher_id: voucherId,
          status: "PENDING",
          notes: guestInfo ? JSON.stringify(guestInfo) : null,
        },
      });

      // 7. Tạo booking item
      await tx.bookingItem.create({
        data: {
          booking_id: booking.id,
          item_type: "TICKET",
          item_id: ticketId,
          quantity,
          unit_price: ticket.price,
          total_price: totalAmount,
          visit_date: visit,
        },
      });

      // 8. Update availability
      if (avail) {
        await tx.ticketAvailability.update({
          where: {
            ticket_id_date: {
              ticket_id: ticketId,
              date: visit,
            },
          },
          data: {
            available_count: { decrement: quantity },
          },
        });
      }

      // 9. Return full booking
      return await tx.booking.findUnique({
        where: { id: booking.id },
        include: {
          provider: { include: { user: true } },
          items: true,
          voucher: true,
        },
      });
    });
  },

  createMenuBooking: async (travelerId, bookingData) => {
    const { serviceId, items, visitDate, voucherCode, guestInfo } = bookingData;
    // items = [{ menuItemId, quantity }, ...]

    return await prisma.$transaction(async (tx) => {
      // 1. Lấy thông tin service (restaurant)
      const service = await tx.service.findUnique({
        where: { id: serviceId },
        include: {
          Provider: true,
        },
      });

      if (!service) {
        throw new AppError(404, "Không tìm thấy nhà hàng", "SERVICE_NOT_FOUND");
      }

      // 2. Validate và tính tổng tiền
      let totalAmount = 0;
      const menuItemsData = [];

      for (const item of items) {
        const menuItem = await tx.menuItem.findUnique({
          where: { id: item.menuItemId },
          include: { Menu: true },
        });

        if (!menuItem) {
          throw new AppError(
            404,
            `Không tìm thấy món ăn ID ${item.menuItemId}`,
            "MENU_ITEM_NOT_FOUND",
          );
        }

        if (menuItem.status !== "AVAILABLE") {
          throw new AppError(
            400,
            `Món "${menuItem.name}" hiện không có sẵn`,
            "MENU_ITEM_UNAVAILABLE",
          );
        }

        const itemTotal = Number(menuItem.price) * item.quantity;
        totalAmount += itemTotal;

        menuItemsData.push({
          menuItem,
          quantity: item.quantity,
          itemTotal,
        });
      }

      // 3. Áp dụng voucher
      let discount = 0;
      let voucherId = null;

      if (voucherCode) {
        const voucher = await tx.voucher.findUnique({
          where: { code: voucherCode },
        });

        if (voucher && (!voucher.valid_to || voucher.valid_to >= new Date())) {
          if (voucher.is_global || voucher.service_id === serviceId) {
            discount = totalAmount * (voucher.discount_percent / 100);
            voucherId = voucher.id;

            await tx.voucher.update({
              where: { id: voucher.id },
              data: { used_count: { increment: 1 } },
            });
          }
        }
      }

      const finalAmount = totalAmount - discount;

      // 4. Tạo booking
      const booking = await tx.booking.create({
        data: {
          traveler_id: travelerId,
          provider_id: service.Provider.id,
          total_amount: totalAmount,
          discount_amount: discount,
          final_amount: finalAmount,
          voucher_id: voucherId,
          status: "PENDING",
          notes: guestInfo ? JSON.stringify(guestInfo) : null,
        },
      });

      // 5. Tạo booking items
      for (const itemData of menuItemsData) {
        await tx.bookingItem.create({
          data: {
            booking_id: booking.id,
            item_type: "MENU_ITEM",
            item_id: itemData.menuItem.id,
            quantity: itemData.quantity,
            unit_price: itemData.menuItem.price,
            total_price: itemData.itemTotal,
            visit_date: visitDate ? new Date(visitDate) : null,
          },
        });
      }

      // 6. Return full booking
      return await tx.booking.findUnique({
        where: { id: booking.id },
        include: {
          provider: { include: { user: true } },
          items: true,
          voucher: true,
        },
      });
    });
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
          payment: true,
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

  getBookingForProvider: async (providerId, bookingId) => {
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, provider_id: providerId },
      include: {
        traveler: { include: { user: true } },
        items: true,
        payment: true,
        voucher: true,
      },
    });

    if (!booking) {
      throw new AppError(404, "Booking not found", "BOOKING_NOT_FOUND");
    }

    return BookingService.enrichBookingItems(booking);
  },

  providerUpdateStatus: async (providerId, bookingId, newStatus, note) => {
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
      throw new AppError(403, "Unauthorized", "FORBIDDEN");
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
      data: {
        status: newStatus,
        notes: note || booking.notes,
      },
      include: {
        items: true,
        traveler: { include: { user: true } },
        provider: true,
        voucher: true,
      },
    });

    return updatedBooking;
  },

  getAllBookingsAdmin: async (filters) => {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.providerId) where.provider_id = Number(filters.providerId);
    if (filters.travelerId) where.traveler_id = Number(filters.travelerId);

    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          traveler: { include: { user: true } },
          provider: { include: { user: true } },
          items: true,
          payment: true,
        },
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      bookings: bookings.map(BookingService.enrichBookingItems),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  getBookingDetailAdmin: async (bookingId) => {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        traveler: { include: { user: true } },
        provider: { include: { user: true } },
        items: true,
        payment: true,
        voucher: true,
        reviews: true,
      },
    });

    if (!booking) {
      throw new AppError(404, "Booking not found", "BOOKING_NOT_FOUND");
    }

    return BookingService.enrichBookingItems(booking);
  },

  adminForceUpdateStatus: async (bookingId, newStatus, note) => {
    return await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: newStatus,
        notes: note || undefined,
      },
      include: {
        items: true,
        traveler: { include: { user: true } },
        provider: { include: { user: true } },
      },
    });
  },
};

module.exports = { BookingService };
