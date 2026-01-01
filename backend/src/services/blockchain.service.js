const { ethers } = require("ethers");
const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const crypto = require("crypto");

// ABI của TravelPayToken contract
const TRAVELPAY_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function payBooking(bytes32 bookingId, address provider, uint256 amount) returns (bool)",
  "function refundBooking(bytes32 bookingId, address provider) returns (bool)",
  "function getBookingPayment(bytes32 bookingId) view returns (address customer, uint256 amount, uint256 timestamp, bool completed, bool refunded)",
  "function vndToTPT(uint256 vndAmount) pure returns (uint256)",
  "function tptToVND(uint256 tptAmount) pure returns (uint256)",
  "event BookingPaid(bytes32 indexed bookingId, address indexed customer, uint256 amount)",
  "event BookingRefunded(bytes32 indexed bookingId, address indexed customer, uint256 amount)",
  "event CashbackPaid(address indexed customer, uint256 amount)",
];

class BlockchainService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    this.contractAddress = process.env.TRAVELPAY_CONTRACT_ADDRESS;

    // Admin wallet để gọi refund
    if (process.env.ADMIN_PRIVATE_KEY) {
      this.adminWallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, this.provider);
    }
  }

  getContract(signerOrProvider) {
    return new ethers.Contract(
      this.contractAddress,
      TRAVELPAY_ABI,
      signerOrProvider || this.provider,
    );
  }

  // Tạo bookingId dạng bytes32 từ array booking IDs
  generateBlockchainBookingId(bookingIds) {
    const combined = bookingIds.sort().join("-");
    const hash = crypto.createHash("sha256").update(combined).digest("hex");
    return `0x${hash}`;
  }

  // Convert VND to TPT (1000 VND = 1 TPT)
  vndToTPT(vndAmount) {
    return Math.floor(Number(vndAmount) / 1000);
  }

  // Tạo payment data cho frontend
  async createPayment(bookingIds, customerWallet) {
    try {
      // Lấy thông tin bookings
      const bookings = await prisma.booking.findMany({
        where: { id: { in: bookingIds } },
        include: {
          provider: true,
        },
      });

      if (bookings.length === 0) {
        throw new AppError(404, "Bookings not found");
      }

      // Tính tổng tiền VND
      const totalVND = bookings.reduce((sum, b) => sum + Number(b.final_amount), 0);

      // Convert sang TPT
      const totalTPT = this.vndToTPT(totalVND);

      // Kiểm tra balance của customer
      const contract = this.getContract();
      const balance = await contract.balanceOf(customerWallet);
      const balanceTPT = Number(ethers.formatEther(balance));

      if (balanceTPT < totalTPT) {
        throw new AppError(
          400,
          `Insufficient TPT balance. Required: ${totalTPT} TPT, Available: ${balanceTPT.toFixed(
            2,
          )} TPT`,
        );
      }

      // Lấy provider wallet (giả sử tất cả booking cùng provider)
      const provider = bookings[0].provider;
      if (!provider.blockchain_wallet) {
        throw new AppError(400, "Provider has not set up blockchain wallet");
      }

      // Generate blockchain booking ID
      const blockchainBookingId = this.generateBlockchainBookingId(bookingIds);

      return {
        totalVND,
        totalTPT,
        bookings: bookings.map((b) => ({
          id: b.id,
          amount: Number(b.final_amount),
        })),
        providerWallet: provider.blockchain_wallet,
        blockchainBookingId,
        customerBalance: balanceTPT,
      };
    } catch (error) {
      throw new AppError(500, error.message || "Failed to create blockchain payment");
    }
  }

  // Execute payment sau khi user đã ký transaction
  async executePayment(paymentId, transactionHash) {
    try {
      // Đợi transaction được confirm
      const receipt = await this.provider.waitForTransaction(transactionHash, 1);

      if (!receipt) {
        throw new AppError(400, "Transaction not found");
      }

      if (receipt.status === 0) {
        throw new AppError(400, "Transaction failed on blockchain");
      }

      // Lấy payment info
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { bookings: true },
      });

      if (!payment) {
        throw new AppError(404, "Payment not found");
      }

      // Parse transaction logs để lấy BookingPaid event
      const contract = this.getContract();
      const logs = receipt.logs
        .map((log) => {
          try {
            return contract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .filter((log) => log !== null);

      const bookingPaidEvent = logs.find((log) => log.name === "BookingPaid");

      if (!bookingPaidEvent) {
        throw new AppError(400, "BookingPaid event not found in transaction");
      }

      // Lấy thông tin từ event
      const eventBookingId = bookingPaidEvent.args.bookingId;
      const eventCustomer = bookingPaidEvent.args.customer;
      const eventAmount = ethers.formatEther(bookingPaidEvent.args.amount);

      // Lưu blockchain transaction
      const blockchainTx = await prisma.blockchainTransaction.create({
        data: {
          tx_hash: transactionHash,
          from_address: eventCustomer,
          to_address: payment.bookings[0]?.provider?.blockchain_wallet || "",
          amount_tpt: eventAmount,
          amount_vnd: payment.amount,
          tx_type: "PAYMENT",
          status: "CONFIRMED",
          block_number: receipt.blockNumber,
          gas_used: receipt.gasUsed.toString(),
          gas_price: receipt.gasPrice?.toString() || "0",
          payment_id: paymentId,
          traveler_id: payment.bookings[0]?.traveler_id,
          provider_id: payment.bookings[0]?.provider_id,
        },
      });

      // Update payment
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "SUCCESS",
          transaction_id: transactionHash,
          blockchain_tx_hash: transactionHash,
          blockchain_booking_id: eventBookingId,
          paid_at: new Date(),
        },
      });

      // Update bookings
      await prisma.booking.updateMany({
        where: { payment_id: paymentId },
        data: { status: "PAID" },
      });

      return {
        success: true,
        transactionHash,
        blockchainTx,
      };
    } catch (error) {
      // Lưu failed transaction
      await prisma.blockchainTransaction.create({
        data: {
          tx_hash: transactionHash,
          from_address: "",
          to_address: "",
          amount_tpt: 0,
          amount_vnd: 0,
          tx_type: "PAYMENT",
          status: "FAILED",
          error_message: error.message,
          payment_id: paymentId,
        },
      });

      throw new AppError(500, error.message || "Failed to execute blockchain payment");
    }
  }

  // Refund booking (chỉ admin mới gọi được)
  async refundPayment(paymentId) {
    try {
      if (!this.adminWallet) {
        throw new AppError(500, "Admin wallet not configured");
      }

      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          bookings: {
            include: { provider: true },
          },
        },
      });

      if (!payment || !payment.blockchain_booking_id) {
        throw new AppError(404, "Blockchain payment not found");
      }

      if (payment.status === "REFUNDED") {
        throw new AppError(400, "Payment already refunded");
      }

      const provider = payment.bookings[0].provider;
      if (!provider.blockchain_wallet) {
        throw new AppError(400, "Provider wallet not found");
      }

      // Gọi smart contract refund
      const contract = this.getContract(this.adminWallet);
      const tx = await contract.refundBooking(
        payment.blockchain_booking_id,
        provider.blockchain_wallet,
      );

      const receipt = await tx.wait();

      // Lưu refund transaction
      await prisma.blockchainTransaction.create({
        data: {
          tx_hash: receipt.hash,
          from_address: provider.blockchain_wallet,
          to_address: payment.bookings[0].traveler.blockchain_wallet,
          amount_tpt: this.vndToTPT(payment.amount),
          amount_vnd: payment.amount,
          tx_type: "REFUND",
          status: "CONFIRMED",
          block_number: receipt.blockNumber,
          payment_id: paymentId,
          traveler_id: payment.bookings[0].traveler_id,
          provider_id: payment.bookings[0].provider_id,
        },
      });

      // Update payment và bookings
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: "REFUNDED" },
      });

      await prisma.booking.updateMany({
        where: { payment_id: paymentId },
        data: { status: "REFUNDED" },
      });

      return { success: true, transactionHash: receipt.hash };
    } catch (error) {
      throw new AppError(500, error.message || "Failed to refund blockchain payment");
    }
  }

  // Lấy balance của user
  async getBalance(walletAddress) {
    try {
      const contract = this.getContract();
      const balance = await contract.balanceOf(walletAddress);
      return {
        tpt: ethers.formatEther(balance),
        vnd: Number(ethers.formatEther(balance)) * 1000,
      };
    } catch (_error) {
      throw new AppError(500, "Failed to get balance");
    }
  }

  // Verify transaction trên blockchain
  async verifyTransaction(txHash) {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      if (!receipt) {
        return { exists: false };
      }

      return {
        exists: true,
        status: receipt.status === 1 ? "SUCCESS" : "FAILED",
        blockNumber: receipt.blockNumber,
        confirmations: await receipt.confirmations(),
      };
    } catch (error) {
      return { exists: false, error: error.message };
    }
  }
}

module.exports = new BlockchainService();
