import { ethers } from "ethers";
import api from "@/shared/utils/axiosInstance";

const API_BASE_URL = "/api/payment";

const TRAVELPAY_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function payBooking(bytes32 bookingId, address provider, uint256 amount) returns (bool)",
  "function getBookingPayment(bytes32 bookingId) view returns (address customer, uint256 amount, uint256 timestamp, bool completed, bool refunded)",
  "function vndToTPT(uint256 vndAmount) pure returns (uint256)",
  "function tptToVND(uint256 tptAmount) pure returns (uint256)",
  "event BookingPaid(bytes32 indexed bookingId, address indexed customer, uint256 amount)",
  "event CashbackPaid(address indexed customer, uint256 amount)",
];

class BlockchainService {
  constructor() {
    this.contractAddress = import.meta.env.VITE_TRAVELPAY_CONTRACT_ADDRESS;
    this.provider = null;
    this.signer = null;
    this.contract = null;
  }

  async init() {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask is not installed");
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    this.contract = new ethers.Contract(this.contractAddress, TRAVELPAY_ABI, this.signer);
  }

  async connectWallet() {
    try {
      await this.init();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const address = accounts[0];
      await this.switchNetwork();
      await this.init();
      const balance = await this.getBalance(address);

      await api.post(`${API_BASE_URL}/blockchain/connect`, {
        walletAddress: address,
      });

      return {
        address,
        balance,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to connect wallet");
    }
  }

  async disconnectWallet() {
    try {
      await api.post(`${API_BASE_URL}/blockchain/disconnect`);
      this.provider = null;
      this.signer = null;
      this.contract = null;
    } catch (error) {
      throw new Error(error.message || "Failed to disconnect wallet");
    }
  }

  async getBalance(address) {
    try {
      if (!this.contract) await this.init();
      console.log(this.contract);

      const balance = await this.contract.balanceOf(address);
      const tptBalance = ethers.formatEther(balance);

      return {
        tpt: parseFloat(tptBalance),
        vnd: parseFloat(tptBalance) * 1000,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get balance");
    }
  }

  async payBooking(paymentData) {
    try {
      if (!this.contract) await this.init();

      const { blockchainBookingId, providerAddress, totalTPT, paymentId } = paymentData;

      // Convert TPT to wei
      const amountInWei = ethers.parseEther(totalTPT.toString());

      // Gọi smart contract
      const tx = await this.contract.payBooking(blockchainBookingId, providerAddress, amountInWei);

      // Đợi transaction được mine
      const receipt = await tx.wait();

      // Gửi transaction hash về backend để verify
      const result = await api.post(`${API_BASE_URL}/blockchain/execute`, {
        paymentId,
        transactionHash: receipt.hash,
      });

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        ...result.data,
      };
    } catch (error) {
      console.error("Payment error:", error);
      throw new Error(error.message || "Payment failed");
    }
  }

  // Get transaction history
  async getTransactions(params = {}) {
    try {
      const response = await api.get(`${API_BASE_URL}/blockchain/transactions`, {
        params,
      });
      return response.data.data;
    } catch (error) {
      console.log(error.message);
      throw new Error("Failed to get transactions");
    }
  }

  // Verify transaction
  async verifyTransaction(txHash) {
    try {
      const response = await api.get(`${API_BASE_URL}/blockchain/verify/${txHash}`);
      return response.data.data;
    } catch (error) {
      console.log(error.message);
      throw new Error("Failed to verify transaction");
    }
  }

  // Listen for account changes
  onAccountChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", callback);
    }
  }

  // Listen for network changes
  onNetworkChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", callback);
    }
  }

  // Switch to correct network
  async switchNetwork() {
    const chainId = import.meta.env.VITE_BLOCKCHAIN_CHAIN_ID;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${parseInt(chainId, 10).toString(16)}` }],
      });
    } catch (error) {
      // If network not added, add it
      if (error.code === 4902) {
        await this.addNetwork();
      } else {
        throw error;
      }
    }
  }

  // Add network to MetaMask
  async addNetwork() {
    const chainId = import.meta.env.VITE_BLOCKCHAIN_CHAIN_ID;
    const rpcUrl = import.meta.env.VITE_BLOCKCHAIN_RPC_URL;
    const networkName = import.meta.env.VITE_BLOCKCHAIN_NETWORK_NAME || "Polygon Mumbai";

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: `0x${parseInt(chainId, 10).toString(16)}`,
          chainName: networkName,
          nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18,
          },
          rpcUrls: [rpcUrl],
          blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
        },
      ],
    });
  }
}

export default new BlockchainService();
