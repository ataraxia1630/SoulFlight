const PaymentService = require("../services/payment/payment.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");
const { PaymentDTO } = require("../dtos/payment.dto");
const AppError = require("../utils/AppError");
const PaymentFactory = require("../services/payment/payment.factory");
const prisma = require("../configs/prisma");

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
        strategyResult: result,
      }),
    );
  }),

  handleVNPayReturn: catchAsync(async (req, res) => {
    const result = await PaymentService.handlePaymentReturn(req.query, "VNPAY");
    console.log("🔥 Payment Result:", result);
    const frontendUrl = `${process.env.FRONTEND_URL}/payment/result?success=${
      result.success
    }&paymentId=${result.paymentId}&message=${encodeURIComponent(result.message)}`;

    res.redirect(frontendUrl);
  }),

  handleVNPayIPN: catchAsync(async (req, res) => {
    const result = await PaymentService.handlePaymentWebhook(req.query, "VNPAY");
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

  // ============ BLOCKCHAIN ENDPOINTS ============

  executeBlockchainPayment: catchAsync(async (req, res) => {
    const { paymentId, transactionHash } = req.body;

    console.log("\n📥 Execute Blockchain Payment Request:");
    console.log("├─ Payment ID:", paymentId);
    console.log("└─ Transaction Hash:", transactionHash);

    if (!paymentId || !transactionHash) {
      throw new AppError(400, "Payment ID and transaction hash are required");
    }

    const strategy = PaymentFactory.getStrategy("BLOCKCHAIN");
    const result = await strategy.executePayment(paymentId, transactionHash);

    res.json(
      ApiResponse.success({
        message: "Payment executed successfully",
        data: result,
      }),
    );
  }),

  getWalletBalance: catchAsync(async (req, res) => {
    const { walletAddress } = req.params;

    if (!walletAddress) {
      throw new AppError(400, "Wallet address is required");
    }

    const strategy = PaymentFactory.getStrategy("BLOCKCHAIN");
    const balance = await strategy.getBalance(walletAddress);

    res.json(
      ApiResponse.success({
        balance,
      }),
    );
  }),

  connectWallet: catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { walletAddress } = req.body;

    console.log("\n🔌 Connect Wallet Request:");
    console.log("├─ User ID:", userId);
    console.log("└─ Wallet Address:", walletAddress);

    if (!walletAddress) {
      throw new AppError(400, "Wallet address is required");
    }

    // Validate Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/i.test(walletAddress)) {
      throw new AppError(400, "Invalid Ethereum address");
    }

    // Determine if user is Traveler or Provider
    const traveler = await prisma.traveler.findUnique({
      where: { id: userId },
      include: { user: { select: { name: true, email: true } } },
    });

    const provider = await prisma.provider.findUnique({
      where: { id: userId },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!traveler && !provider) {
      throw new AppError(404, "User profile not found");
    }

    const userType = traveler ? "TRAVELER" : "PROVIDER";
    const currentWallet = traveler ? traveler.blockchain_wallet : provider.blockchain_wallet;

    console.log("├─ User Type:", userType);
    console.log("└─ Current Wallet:", currentWallet || "None");

    // Check if address is already used by another user
    const [existingTraveler, existingProvider] = await Promise.all([
      prisma.traveler.findFirst({
        where: {
          blockchain_wallet: walletAddress,
          id: { not: userId },
        },
      }),
      prisma.provider.findFirst({
        where: {
          blockchain_wallet: walletAddress,
          id: { not: userId },
        },
      }),
    ]);

    if (existingTraveler || existingProvider) {
      throw new AppError(400, "This wallet is already connected to another account");
    }

    // Update wallet address
    if (traveler) {
      await prisma.traveler.update({
        where: { id: userId },
        data: { blockchain_wallet: walletAddress },
      });
    } else {
      await prisma.provider.update({
        where: { id: userId },
        data: { blockchain_wallet: walletAddress },
      });
    }

    console.log("✅ Wallet connected successfully");

    res.json(
      ApiResponse.success({
        message: "Wallet connected successfully",
        data: {
          walletAddress,
          userType,
          user: traveler
            ? {
                id: traveler.id,
                name: traveler.user.name,
                email: traveler.user.email,
              }
            : {
                id: provider.id,
                name: provider.user.name,
                email: provider.user.email,
              },
        },
      }),
    );
  }),

  disconnectWallet: catchAsync(async (req, res) => {
    const userId = req.user.id;

    console.log("\n👋 Disconnect Wallet Request:");
    console.log("└─ User ID:", userId);

    // Check if user is Traveler or Provider
    const traveler = await prisma.traveler.findUnique({
      where: { id: userId },
    });

    const provider = await prisma.provider.findUnique({
      where: { id: userId },
    });

    if (!traveler && !provider) {
      throw new AppError(404, "User profile not found");
    }

    // Update wallet to null
    if (traveler) {
      await prisma.traveler.update({
        where: { id: userId },
        data: { blockchain_wallet: null },
      });
    } else {
      await prisma.provider.update({
        where: { id: userId },
        data: { blockchain_wallet: null },
      });
    }

    console.log("✅ Wallet disconnected successfully");

    res.json(
      ApiResponse.success({
        message: "Wallet disconnected successfully",
      }),
    );
  }),

  getBlockchainTransactions: catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 10, type } = req.query;

    console.log("\n📋 Get Transactions Request:");
    console.log("├─ User ID:", userId);
    console.log("├─ Page:", page);
    console.log("├─ Limit:", limit);
    console.log("└─ Type:", type || "All");

    // Check if user is Traveler or Provider
    const traveler = await prisma.traveler.findUnique({
      where: { id: userId },
    });

    const provider = await prisma.provider.findUnique({
      where: { id: userId },
    });

    if (!traveler && !provider) {
      throw new AppError(404, "User profile not found");
    }

    // Build where clause based on user type
    const where = {};
    if (traveler) {
      where.traveler_id = userId;
    } else {
      where.provider_id = userId;
    }

    if (type) {
      where.tx_type = type;
    }

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

    console.log("✅ Found", transactions.length, "transactions");

    res.json(
      ApiResponse.success({
        transactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      }),
    );
  }),

  verifyTransaction: catchAsync(async (req, res) => {
    const { txHash } = req.params;

    const blockchainService = require("../services/blockchain/blockchain.service");
    const verification = await blockchainService.verifyTransaction(txHash);

    res.json(
      ApiResponse.success({
        verification,
      }),
    );
  }),
};

module.exports = PaymentController;
