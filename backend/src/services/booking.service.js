const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");
const { BOOKING_EXPIRY_MINUTES } = require("../configs/booking.config");

const BookingService = {
  getBookingsByTraveler: async (travelerId, { status } = {}) => {
    const where = { traveler_id: travelerId };
    if (status) where.status = status;

    const [bookings] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          service: true,
          provider: {
            include: {
              user: { select: { name: true } },
            },
          },
          voucher: true,
          items: true,
          payment: { select: { id: true, status: true, method: true } },
        },
        orderBy: { booking_date: "desc" },
      }),
      prisma.booking.count({ where }),
    ]);

    const savedBookings = await Promise.all(
      bookings.map((booking) => BookingService.enrichBookingItems(booking)),
    );

    return savedBookings;
  },

  getBookingDetail: async (travelerId, bookingId) => {
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, traveler_id: travelerId },
      include: {
        service: true,
        provider: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
          },
        },
        voucher: true,
        items: true,
        payment: true,
      },
    });

    if (!booking)
      throw new AppError(
        404,
        ERROR_CODES.BOOKING_NOT_FOUND.message,
        ERROR_CODES.BOOKING_NOT_FOUND.code,
      );

    return await BookingService.enrichBookingItems(booking);
  },

  updateBookingInfo: async (travelerId, bookingId, data) => {
    const { notes, voucherCode } = data;

    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findFirst({
        where: { id: bookingId, traveler_id: travelerId },
        include: { voucher: true, service: true },
      });

      if (!booking) {
        throw new AppError(404, "Booking không tồn tại hoặc không thuộc về bạn");
      }

      if (booking.status !== "PENDING") {
        throw new AppError(400, "Chỉ có thể cập nhật khi booking đang chờ thanh toán");
      }

      const updateData = {};
      let newDiscount = booking.discount_amount;
      let newVoucherId = booking.voucher_id;

      if (notes !== undefined) {
        updateData.notes = notes;
      }

      if (voucherCode && BookingService.isVoucherValid(tx, voucherCode)) {
        const discountAmount = booking.total_amount * (voucher.discount_percent / 100);
        newDiscount = discountAmount;
        newVoucherId = voucher.id;

        await tx.voucher.update({
          where: { id: booking.voucher_id },
          data: { used_count: { decrement: 1 } },
        });

        await tx.voucher.update({
          where: { id: voucher.id },
          data: { used_count: { increment: 1 } },
        });

        updateData.discount_amount = newDiscount;
        updateData.final_amount = booking.total_amount - newDiscount;
        updateData.voucher_id = newVoucherId;
      }

      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: updateData,
        include: {
          items: true,
          voucher: true,
          service: { select: { id: true, name: true } },
          provider: true,
        },
      });

      return await BookingService.enrichBookingItems(updatedBooking);
    });
  },

  createBookingFromCart: async (travelerId, voucherMap = {}) => {
    return await prisma.$transaction(async (tx) => {
      const cartItems = await tx.cartItem.findMany({
        where: { cart: { traveler_id: travelerId } },
        include: {
          room: {
            select: {
              service_id: true,
              price_per_night: true,
              name: true,
            },
          },
          tour: {
            select: { service_id: true, total_price: true, name: true },
          },
          ticket: {
            select: { service_id: true, price: true, name: true },
          },
          menu_item: {
            include: { Menu: { select: { service_id: true } } },
          },
        },
      });
      if (!cartItems.length) throw new AppError(400, "Giỏ hàng rỗng");

      const groups = cartItems.reduce((acc, item) => {
        const serviceId =
          item.room?.service_id ||
          item.tour?.service_id ||
          item.ticket?.service_id ||
          item.menu_item?.Menu?.service_id;

        if (!serviceId) throw new AppError(400, "Item không hợp lệ");

        if (!acc[serviceId]) acc[serviceId] = { serviceId, items: [] };
        acc[serviceId].items.push(item);
        return acc;
      }, {});

      const createdBookings = [];

      for (const { serviceId, items } of Object.values(groups)) {
        const service = await tx.service.findUnique({
          where: { id: serviceId },
          include: { Provider: true },
        });
        if (!service) throw new AppError(404, `Service ${serviceId} không tồn tại`);

        let totalAmount = 0;
        const bookingItemsData = [];

        for (const item of items) {
          let unitPrice = 0;
          let itemName = "Dịch vụ";

          if (item.item_type === "ROOM") {
            const nights = Math.max(
              1,
              Math.ceil(
                (new Date(item.checkout_date) - new Date(item.checkin_date)) /
                  (1000 * 60 * 60 * 24),
              ),
            );
            unitPrice = Number(item.room.price_per_night);
            itemName = item.room.name;
            totalAmount += unitPrice * nights * item.quantity;
          } else {
            unitPrice = item.tour?.total_price || item.ticket?.price || item.menu_item?.price || 0;
            itemName = item.tour?.name || item.ticket?.name || item.menu_item?.name;
            totalAmount += unitPrice * item.quantity;
          }

          bookingItemsData.push({
            item_type: item.item_type,
            item_id: item.item_id,
            item_name: itemName,
            quantity: item.quantity,
            unit_price: unitPrice,
            total_price: unitPrice * item.quantity,
            checkin_date: item.checkin_date,
            checkout_date: item.checkout_date,
            visit_date: item.visit_date,
          });
        }

        let discountAmount = 0;
        let voucherId = null;
        const voucherCode = voucherMap[serviceId];

        if (voucherCode) {
          const voucher = await tx.voucher.findFirst({
            where: {
              code: voucherCode,
              service_id: serviceId,
              is_active: true,
            },
          });

          if (voucher) {
            discountAmount = totalAmount * (voucher.discount_percent / 100);
            voucherId = voucher.id;

            await tx.voucher.update({
              where: { id: voucher.id },
              data: { used_count: { increment: 1 } },
            });
          }
        }

        const booking = await tx.booking.create({
          data: {
            traveler_id: travelerId,
            provider_id: service.provider_id,
            service_id: serviceId,
            total_amount: totalAmount,
            discount_amount: discountAmount,
            final_amount: totalAmount - discountAmount,
            voucher_id: voucherId,
            status: "PENDING",
            expiry_time: new Date(Date.now() + BOOKING_EXPIRY_MINUTES * 60 * 1000),
            items: { create: bookingItemsData },
          },
          include: {
            items: true,
            voucher: true,
            service: { select: { id: true, name: true } },
            provider: { include: { user: { select: { name: true } } } },
          },
        });

        const enriched = BookingService.enrichBookingItems(booking);
        createdBookings.push(enriched);
        console.log("Created booking:", booking);
      }

      const itemIdsToDelete = cartItems.map((item) => item.id);
      await tx.cartItem.deleteMany({
        where: {
          id: {
            in: itemIdsToDelete,
          },
        },
      });

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

  isVoucherValid: async (tx, voucherCode) => {
    const voucher = await tx.voucher.findUnique({
      where: { code: voucherCode },
    });

    if (!voucher || (voucher.valid_to && voucher.valid_to < new Date())) {
      throw new AppError(400, "Mã giảm giá không hợp lệ", "INVALID_VOUCHER");
    }

    if (voucher.max_uses && voucher.used_count >= voucher.max_uses) {
      throw new AppError(400, "Mã giảm giá đã hết lượt sử dụng", "VOUCHER_LIMIT_REACHED");
    }

    return true;
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
    });
  },

  enrichBookingItems: async (booking) => {
    if (!booking || !booking.items || !Array.isArray(booking.items)) {
      return booking;
    }

    const enrichedItems = await Promise.all(
      booking.items.map(async (item) => {
        if (!item) return null;

        const details = {
          name: item.item_name || "Unknown Service",
          image: null,
        };

        try {
          if (item.item_type === "ROOM") {
            const room = await prisma.room.findUnique({
              where: { id: item.item_id },
            });
            if (room) {
              details.name = room.name;
              details.service_id = room.service_id;
              // details.image = room.image_url; // Nếu room có ảnh
            }
          } else if (item.item_type === "TOUR") {
            const tour = await prisma.tour.findUnique({
              where: { id: item.item_id },
            });
            if (tour) {
              details.name = tour.name;
              details.service_id = tour.service_id;
            }
          } else if (item.item_type === "TICKET") {
            const ticket = await prisma.ticket.findUnique({
              where: { id: item.item_id },
              include: { Place: true },
            });
            if (ticket) {
              details.name = ticket.name;
              details.place = ticket.Place?.name;
              details.service_id = ticket.service_id;
            }
          } else if (item.item_type === "MENU_ITEM") {
            const menuItem = await prisma.menuItem.findUnique({
              where: { id: item.item_id },
              include: { Menu: true },
            });
            if (menuItem) {
              details.name = menuItem.name;
              details.image = menuItem.image_url;
              details.service_id = menuItem.Menu?.service_id;
            }
          }
        } catch (err) {
          console.error(`Lỗi khi enrich item ${item.id}:`, err);
        }

        return { ...item, ...details };
      }),
    );

    return { ...booking, items: enrichedItems.filter((i) => i !== null) };
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
          service_id: room.service_id,
          total_amount: totalAmount,
          discount_amount: discount,
          final_amount: finalAmount,
          voucher_id: voucherId,
          status: "PENDING",
          notes: guestInfo || null,
          expiry_time: new Date(Date.now() + BOOKING_EXPIRY_MINUTES * 60 * 1000),
        },
      });

      // 7. Tạo booking item
      await tx.bookingItem.create({
        data: {
          booking_id: booking.id,
          item_type: "ROOM",
          item_id: roomId,
          item_name: room.name,
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
          service: true,
          provider: { include: { user: true } },
          items: true,
          voucher: true,
        },
      });
    });
  },

  createTourBooking: async (travelerId, bookingData) => {
    const { tourId, quantity, voucherCode, guestInfo } = bookingData;
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
          service_id: tour.service_id,
          total_amount: totalAmount,
          discount_amount: discount,
          final_amount: finalAmount,
          voucher_id: voucherId,
          status: "PENDING",
          notes: guestInfo || null,
          expiry_time: new Date(Date.now() + BOOKING_EXPIRY_MINUTES * 60 * 1000),
        },
      });
      console.log(booking);

      // 7. Tạo booking item
      await tx.bookingItem.create({
        data: {
          booking_id: booking.id,
          item_type: "TOUR",
          item_id: tourId,
          item_name: tour.name,
          quantity,
          unit_price: tour.total_price,
          total_price: totalAmount,
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
          service: true,
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
          service_id: ticket.service_id,
          total_amount: totalAmount,
          discount_amount: discount,
          final_amount: finalAmount,
          voucher_id: voucherId,
          status: "PENDING",
          notes: guestInfo || null,
          expiry_time: new Date(Date.now() + BOOKING_EXPIRY_MINUTES * 60 * 1000),
        },
      });

      // 7. Tạo booking item
      await tx.bookingItem.create({
        data: {
          booking_id: booking.id,
          item_type: "TICKET",
          item_id: ticketId,
          item_name: ticket.name,
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
          service: true,
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
          service_id: serviceId,
          total_amount: totalAmount,
          discount_amount: discount,
          final_amount: finalAmount,
          voucher_id: voucherId,
          status: "PENDING",
          notes: guestInfo || null,
          expiry_time: new Date(Date.now() + BOOKING_EXPIRY_MINUTES * 60 * 1000),
        },
      });

      // 5. Tạo booking items
      for (const itemData of menuItemsData) {
        await tx.bookingItem.create({
          data: {
            booking_id: booking.id,
            item_type: "MENU_ITEM",
            item_id: itemData.menuItem.id,
            item_name: itemData.menuItem.name,
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
          service: true,
          provider: { include: { user: true } },
          items: true,
          voucher: true,
        },
      });
    });
  },

  getBookingsByProvider: async (providerId) => {
    const where = { provider_id: providerId };

    const [bookings] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          traveler: { include: { user: true } },
          items: true,
          payment: true,
          service: true,
          provider: { include: { user: true } },
        },
        orderBy: { booking_date: "desc" },
      }),
    ]);

    const enrichedBookings = await Promise.all(
      bookings.map((booking) => BookingService.enrichBookingItems(booking)),
    );

    console.log("Bookings for provider:", enrichedBookings);
    return enrichedBookings;
  },

  getBookingForProvider: async (providerId, bookingId) => {
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, provider_id: providerId },
      include: {
        traveler: { include: { user: true } },
        provider: { include: { user: true } },
        items: true,
        payment: true,
        voucher: true,
      },
    });

    if (!booking) {
      throw new AppError(404, "Booking not found", "BOOKING_NOT_FOUND");
    }

    return await BookingService.enrichBookingItems(booking);
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

  getAllBookingsAdmin: async () => {
    const [bookings] = await Promise.all([
      prisma.booking.findMany({
        include: {
          traveler: { include: { user: true } },
          provider: { include: { user: true } },
          items: true,
          payment: true,
          service: true,
        },
        orderBy: { created_at: "desc" },
      }),
    ]);

    const enrichedBookings = await Promise.all(
      bookings.map((booking) => BookingService.enrichBookingItems(booking)),
    );
    return enrichedBookings;
  },

  getBookingDetailAdmin: async (bookingId) => {
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId },
      include: {
        traveler: { include: { user: true } },
        provider: { include: { user: true } },
        items: true,
        payment: true,
        voucher: true,
      },
    });

    if (!booking) {
      throw new AppError(404, "Booking not found", "BOOKING_NOT_FOUND");
    }

    return await BookingService.enrichBookingItems(booking);
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
