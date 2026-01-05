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
      include: {
        provider: true,
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

    const returnUrl =
      process.env.NODE_ENV === "production"
        ? process.env.VNP_RETURN_URL
        : "http://localhost:1601/api/payment/vnpay/return";

    // Gọi strategy tương ứng để tạo payment URL
    const strategy = PaymentFactory.getStrategy(method);
    const strategyResult = await strategy.createPayment({
      payment,
      bookings,
      returnUrl: returnUrl,
    });

    console.log("\n📤 Strategy Result:");
    console.log(strategyResult);

    // Attach paymentUrl vào payment object để DTO xử lý
    payment.paymentUrl = strategyResult.paymentUrl;
    console.log("Created payment:", payment);

    if (method === "BLOCKCHAIN") {
      return strategyResult;
    }
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

  async initiateRefund(paymentId, reason) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { bookings: true },
    });

    if (payment.status !== "SUCCESS") {
      throw new AppError(400, "Chỉ có thể refund payment đã thành công", "INVALID_PAYMENT");
    }

    const strategy = PaymentFactory.getStrategy(payment.method);
    const refundResult = await strategy.initiateRefund({
      transactionId: payment.transaction_id,
      amount: payment.amount,
      reason,
    });

    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "REFUNDED",
        payload: { ...payment.payload, refund: refundResult },
      },
    });

    await prisma.booking.updateMany({
      where: { payment_id: paymentId },
      data: { status: "REFUNDED" },
    });

    return refundResult;
  },
};

module.exports = PaymentService;
