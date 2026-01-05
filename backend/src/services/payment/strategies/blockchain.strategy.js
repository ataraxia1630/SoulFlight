const BasePaymentStrategy = require("./base.strategy");
const BlockchainService = require("../../blockchain.service");
const prisma = require("../../../configs/prisma");
const AppError = require("../../../utils/AppError");

class BlockchainStrategy extends BasePaymentStrategy {
  async createPayment({ payment, bookings }) {
    // Get traveler's wallet address
    const traveler = await prisma.traveler.findUnique({
      where: { id: bookings[0].traveler_id },
      include: { user: true },
    });

    if (!traveler.blockchain_wallet) {
      throw new AppError(
        400,
        "Bạn chưa kết nối ví blockchain. Vui lòng kết nối MetaMask trước.",
        "WALLET_NOT_CONNECTED",
      );
    }

    // Validate provider có ví không
    const provider = await prisma.provider.findUnique({
      where: { id: bookings[0].provider_id },
    });

    if (!provider.blockchain_wallet) {
      throw new AppError(
        400,
        "Nhà cung cấp chưa thiết lập ví blockchain",
        "PROVIDER_WALLET_NOT_SET",
      );
    }

    // Create blockchain payment data
    const paymentData = await BlockchainService.createPayment(
      bookings.map((b) => b.id),
      traveler.blockchain_wallet,
    );

    // Update payment với blockchain booking ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        blockchain_booking_id: paymentData.blockchainBookingId,
      },
    });

    return {
      paymentId: payment.id,
      method: payment.method,
      status: payment.status,
      amount: Number(payment.amount),

      paymentData: {
        paymentId: payment.id,
        customerAddress: traveler.blockchain_wallet,
        providerAddress: paymentData.providerWallet,
        totalTPT: paymentData.totalTPT,
        totalVND: paymentData.totalVND,
        bookings: paymentData.bookings,
        blockchainBookingId: paymentData.blockchainBookingId,
        customerBalance: paymentData.customerBalance,
        contractAddress: process.env.TRAVELPAY_CONTRACT_ADDRESS,
      },

      requiresUserAction: true, // Signal frontend cần user ký transaction
    };
  }

  async handleReturn(_query) {
    // Blockchain payments are handled by executePayment endpoint
    return {
      success: true,
      message: "Blockchain payment requires transaction confirmation",
    };
  }

  async handleWebhook(_payload) {
    // Not used for blockchain - payments are verified on-chain
    return { success: true };
  }

  // Execute payment sau khi user đã ký transaction trên frontend
  async executePayment(paymentId, transactionHash) {
    if (!transactionHash) {
      throw new AppError(400, "Transaction hash is required");
    }

    return await BlockchainService.executePayment(paymentId, transactionHash);
  }

  // Initiate refund
  async initiateRefund({ paymentId }) {
    return await BlockchainService.refundPayment(paymentId);
  }

  // Get balance của user
  async getBalance(walletAddress) {
    return await BlockchainService.getBalance(walletAddress);
  }
}

module.exports = BlockchainStrategy;
