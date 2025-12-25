const prisma = require("../../configs/prisma");
const PaymentFactory = require("./payment.factory");
const AppError = require("../../utils/AppError");
const { ERROR_CODES } = require("../../constants/errorCode");

const PaymentService = {
  async createPayment(travelerId, { bookingIds, method }) {
    // Validate input
    if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
      throw new AppError(400, "Booking IDs phải là mảng và không được rỗng", "INVALID_BOOKING_IDS");
    }

    if (!["VNPAY", "MOMO", "BLOCKCHAIN"].includes(method)) {
      throw new AppError(400, "Phương thức thanh toán không hợp lệ", "INVALID_PAYMENT_METHOD");
    }

    // Validate bookings
    const bookings = await prisma.booking.findMany({
      where: {
        id: { in: bookingIds },
        traveler_id: travelerId,
        status: "PENDING",
      },
    });

    if (bookings.length === 0) {
      throw new AppError(
        400,
        "Không tìm thấy booking hợp lệ",
        ERROR_CODES.BOOKING_NOT_FOUND?.code || "BOOKING_NOT_FOUND",
      );
    }

    if (bookings.length !== bookingIds.length) {
      throw new AppError(
        400,
        "Một số booking không hợp lệ hoặc đã được thanh toán",
        "INVALID_BOOKINGS",
      );
    }

    // Tính tổng tiền
    const total = bookings.reduce((sum, b) => sum + Number(b.final_amount), 0);

    // Tạo payment record
    const payment = await prisma.payment.create({
      data: {
        amount: total,
        method,
        status: "PENDING",
        bookings: { connect: bookings.map((b) => ({ id: b.id })) },
      },
      include: {
        bookings: {
          include: {
            provider: {
              include: { user: { select: { name: true } } },
            },
          },
        },
      },
    });

    // Cập nhật payment_id cho bookings
    await prisma.booking.updateMany({
      where: { id: { in: bookingIds } },
      data: { payment_id: payment.id },
    });

    // Gọi strategy tương ứng để tạo payment URL
    const strategy = PaymentFactory.getStrategy(method);
    const result = await strategy.createPayment({
      payment,
      bookings,
      returnUrl: `${process.env.BACKEND_URL}/api/payments/vnpay/return`,
    });

    // Attach paymentUrl vào payment object để DTO xử lý
    payment.paymentUrl = result.paymentUrl;

    return payment;
  },

  async handlePaymentReturn(query, method) {
    const strategy = PaymentFactory.getStrategy(method);
    return await strategy.handleReturn(query);
  },

  async handlePaymentWebhook(body, method) {
    const strategy = PaymentFactory.getStrategy(method);
    return await strategy.handleWebhook(body);
  },

  async getPaymentById(paymentId, travelerId) {
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        bookings: {
          some: { traveler_id: travelerId },
        },
      },
      include: {
        bookings: {
          include: {
            items: true,
            provider: {
              include: {
                user: {
                  select: { name: true, email: true },
                },
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new AppError(
        404,
        "Không tìm thấy payment",
        ERROR_CODES.PAYMENT_NOT_FOUND?.code || "PAYMENT_NOT_FOUND",
      );
    }

    return payment;
  },

  async getPaymentsByTraveler(travelerId, { page = 1, limit = 10, status }) {
    const where = {
      bookings: {
        some: { traveler_id: travelerId },
      },
    };

    if (status) {
      where.status = status;
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          bookings: {
            select: {
              id: true,
              final_amount: true,
              status: true,
              provider: {
                select: {
                  user: { select: { name: true } },
                },
              },
            },
          },
        },
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ]);

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};

module.exports = PaymentService;
