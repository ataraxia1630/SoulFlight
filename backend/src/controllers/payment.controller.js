const PaymentService = require("../services/payment/payment.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");
const { PaymentDTO } = require("../dtos/payment.dto");

const PaymentController = {
  createPayment: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    const { bookingIds, method } = req.body;

    const result = await PaymentService.createPayment(travelerId, {
      bookingIds,
      method,
    });

    res.status(201).json(
      ApiResponse.success({
        message: "Payment created successfully",
        payment: PaymentDTO.fromModel(result),
      }),
    );
  }),

  handleVNPayReturn: catchAsync(async (req, res) => {
    const result = await PaymentService.handlePaymentReturn(req.query, "VNPAY");

    const frontendUrl = `${process.env.FRONTEND_URL}/payment/result?success=${
      result.success
    }&paymentId=${result.paymentId}&message=${encodeURIComponent(result.message)}`;

    res.redirect(frontendUrl);
  }),

  handleVNPayIPN: catchAsync(async (req, res) => {
    const result = await PaymentService.handlePaymentWebhook(req.query, "VNPAY");

    // Trả về format mà VNPay yêu cầu (không dùng ApiResponse)
    res.json(result);
  }),

  getPayment: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    const { id } = req.params;

    const payment = await PaymentService.getPaymentById(id, travelerId);

    res.json(
      ApiResponse.success({
        payment: PaymentDTO.fromModel(payment),
      }),
    );
  }),

  getPayments: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const result = await PaymentService.getPaymentsByTraveler(travelerId, {
      page: Number(page),
      limit: Number(limit),
      status,
    });

    res.json(
      ApiResponse.success({
        payments: PaymentDTO.fromList(result.payments),
        pagination: result.pagination,
      }),
    );
  }),
};

module.exports = PaymentController;
