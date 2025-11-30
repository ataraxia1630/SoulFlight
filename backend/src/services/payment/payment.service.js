const prisma = require("../../configs/prisma");
const PaymentFactory = require("./payment.factory");

const PaymentService = {
  async createPayment(travelerId, { bookingIds, method }) {
    const bookings = await prisma.booking.findMany({
      where: {
        id: { in: bookingIds },
        traveler_id: travelerId,
        status: "PENDING",
      },
    });

    if (bookings.length === 0) throw new AppError(400, "No valid bookings");

    const total = bookings.reduce((sum, b) => sum + Number(b.final_amount), 0);

    const payment = await prisma.payment.create({
      data: {
        amount: total,
        method,
        status: "PENDING",
        bookings: { connect: bookings.map((b) => ({ id: b.id })) },
      },
    });

    await prisma.booking.updateMany({
      where: { id: { in: bookingIds } },
      data: { payment_id: payment.id },
    });

    const strategy = PaymentFactory.getStrategy(method);
    const result = await strategy.createPayment({
      payment,
      bookings,
      returnUrl: `${process.env.FRONTEND_URL}/payment/return`,
    });

    return { paymentId: payment.id, ...result };
  },
};

module.exports = PaymentService;
