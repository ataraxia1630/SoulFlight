const PaymentService = require("../services/payment/payment.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");
const { PaymentDTO } = require("../dtos/payment.dto");
const AppError = require("../utils/AppError");

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

  executeBlockchainPayment: catchAsync(async (req, res) => {
    const { paymentId, transactionHash } = req.body;

    if (!paymentId || !transactionHash) {
      throw new AppError(400, "Payment ID and transaction hash are required");
    }

    const strategy = PaymentFactory.getStrategy("BLOCKCHAIN");
    const result = await strategy.executePayment(paymentId, transactionHash);

    res.json({
      success: true,
      message: "Payment executed successfully",
      data: result,
    });
  }),

  getWalletBalance: catchAsync(async (req, res) => {
    const { walletAddress } = req.params;

    if (!walletAddress) {
      throw new AppError(400, "Wallet address is required");
    }

    const strategy = PaymentFactory.getStrategy("BLOCKCHAIN");
    const balance = await strategy.getBalance(walletAddress);

    res.json({
      success: true,
      data: balance,
    });
  }),

  connectWallet: catchAsync(async (req, res) => {
    const travelerId = req.user.traveler.id;
    const { walletAddress } = req.body;

    if (!walletAddress) {
      throw new AppError(400, "Wallet address is required");
    }

    // Validate địa chỉ Ethereum
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      throw new AppError(400, "Invalid Ethereum address");
    }

    // Check xem địa chỉ đã được dùng chưa
    const existingWallet = await prisma.traveler.findFirst({
      where: {
        blockchain_wallet: walletAddress,
        id: { not: travelerId },
      },
    });

    if (existingWallet) {
      throw new AppError(400, "This wallet is already connected to another account");
    }

    // Update traveler
    const updatedTraveler = await prisma.traveler.update({
      where: { id: travelerId },
      data: { blockchain_wallet: walletAddress },
    });

    res.json({
      success: true,
      message: "Wallet connected successfully",
      data: {
        walletAddress: updatedTraveler.blockchain_wallet,
      },
    });
  }),

  disconnectWallet: catchAsync(async (req, res) => {
    const travelerId = req.user.traveler.id;

    await prisma.traveler.update({
      where: { id: travelerId },
      data: { blockchain_wallet: null },
    });

    res.json({
      success: true,
      message: "Wallet disconnected successfully",
    });
  }),

  getBlockchainTransactions: catchAsync(async (req, res) => {
    const travelerId = req.user.traveler.id;
    const { page = 1, limit = 10, type } = req.query;

    const where = { traveler_id: travelerId };
    if (type) where.tx_type = type;

    const [transactions, total] = await Promise.all([
      prisma.blockchainTransaction.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: Number(limit),
        include: {
          payment: {
            include: {
              bookings: {
                select: {
                  id: true,
                  final_amount: true,
                },
              },
            },
          },
        },
      }),
      prisma.blockchainTransaction.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  }),

  verifyTransaction: catchAsync(async (req, res) => {
    const { txHash } = req.params;

    const blockchainService = require("../services/blockchain/blockchain.service");
    const verification = await blockchainService.verifyTransaction(txHash);

    res.json({
      success: true,
      data: verification,
    });
  }),
};

module.exports = PaymentController;
