import { ethers } from "ethers";
import api from "@/shared/utils/axiosInstance";

const API_BASE_URL = "/api/payment";

const TRAVELPAY_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function payBooking(bytes32 bookingId, address provider, uint256 amount) returns (bool)",
  "function getBookingPayment(bytes32 bookingId) view returns (address customer, uint256 amount, uint256 timestamp, bool completed, bool refunded)",
  "function vndToTPT(uint256 vndAmount) pure returns (uint256)",
  "function tptToVND(uint256 tptAmount) pure returns (uint256)",
  "event BookingPaid(bytes32 indexed bookingId, address indexed customer, uint256 amount)",
  "event BookingRefunded(bytes32 indexed bookingId, address indexed customer, uint256 amount)",
  "event CashbackPaid(address indexed customer, uint256 amount)",
];

class BlockchainService {
  constructor() {
    this.contractAddress = import.meta.env.VITE_TRAVELPAY_CONTRACT_ADDRESS;
    this.rpcUrl = import.meta.env.VITE_BLOCKCHAIN_RPC_URL;
    this.chainId = Number(import.meta.env.VITE_BLOCKCHAIN_CHAIN_ID || "31337");
    this.networkName = import.meta.env.VITE_BLOCKCHAIN_NETWORK_NAME || "Localhost";

    this.provider = null;
    this.signer = null;
    this.contract = null;

    console.log("🔧 Blockchain Service Config:");
    console.log("├─ Contract:", this.contractAddress);
    console.log("├─ RPC URL:", this.rpcUrl);
    console.log("├─ Chain ID:", this.chainId);
    console.log("└─ Network:", this.networkName);
  }

  async init() {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(this.contractAddress, TRAVELPAY_ABI, this.signer);

      console.log("✅ Blockchain service initialized");
      return true;
    } catch (error) {
      console.error("❌ Failed to initialize:", error);
      throw error;
    }
  }

  async connectWallet() {
    try {
      console.log("🔌 Connecting wallet...");

      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask is not installed. Please install MetaMask extension.");
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("No accounts found. Please unlock MetaMask.");
      }

      const address = accounts[0];
      console.log("👤 Connected account:", address);

      // Switch to correct network
      await this.switchNetwork();

      // Initialize after network switch
      await this.init();

      // Get balance
      const balance = await this.getBalance(address);
      console.log("💰 Balance:", balance.tpt, "TPT");

      // Connect wallet in backend
      try {
        await api.post(`${API_BASE_URL}/blockchain/connect`, {
          walletAddress: address,
        });
        console.log("✅ Wallet connected in backend");
      } catch (backendError) {
        console.warn("⚠️  Failed to connect wallet in backend:", backendError);
        // Continue anyway since blockchain connection is working
      }

      return {
        address,
        balance,
      };
    } catch (error) {
      console.error("❌ Connect wallet error:", error);
      throw new Error(error.message || "Failed to connect wallet");
    }
  }

  async disconnectWallet() {
    try {
      await api.post(`${API_BASE_URL}/blockchain/disconnect`);
      this.provider = null;
      this.signer = null;
      this.contract = null;
      console.log("👋 Wallet disconnected");
    } catch (error) {
      console.error("Disconnect error:", error);
      throw new Error(error.message || "Failed to disconnect wallet");
    }
  }

  async getBalance(address) {
    try {
      if (!this.contract) await this.init();

      const balance = await this.contract.balanceOf(address);
      const tptBalance = ethers.formatEther(balance);

      return {
        tpt: parseFloat(tptBalance),
        vnd: parseFloat(tptBalance) * 1000,
      };
    } catch (error) {
      console.error("Get balance error:", error);
      throw new Error("Failed to get balance");
    }
  }

  async payBooking(paymentData) {
    try {
      console.log("\n💳 Processing blockchain payment...");
      console.log("📦 Payment Data:", paymentData);

      if (!this.contract) {
        await this.init();
      }

      const { blockchainBookingId, providerAddress, totalTPT, paymentId } = paymentData;

      // Validate inputs
      if (!blockchainBookingId || !providerAddress || !totalTPT || !paymentId) {
        throw new Error("Missing required payment data");
      }

      console.log("├─ Booking ID:", blockchainBookingId);
      console.log("├─ Provider:", providerAddress);
      console.log("├─ Amount:", totalTPT, "TPT");
      console.log("└─ Payment ID:", paymentId);

      // Convert TPT to wei
      const amountInWei = ethers.parseEther(totalTPT.toString());
      console.log("💱 Amount in Wei:", amountInWei.toString());

      // Call smart contract
      console.log("📝 Calling payBooking on smart contract...");
      const tx = await this.contract.payBooking(blockchainBookingId, providerAddress, amountInWei, {
        gasLimit: 500000, // Set explicit gas limit
      });

      console.log("⏳ Transaction sent:", tx.hash);
      console.log("⏳ Waiting for confirmation...");

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      console.log("✅ Transaction confirmed!");
      console.log("├─ Block:", receipt.blockNumber);
      console.log("├─ Gas Used:", receipt.gasUsed.toString());
      console.log("└─ Status:", receipt.status === 1 ? "Success" : "Failed");

      if (receipt.status === 0) {
        throw new Error("Transaction failed on blockchain");
      }

      // Send transaction hash to backend for verification
      console.log("📤 Sending transaction to backend for verification...");
      const result = await api.post(`${API_BASE_URL}/blockchain/execute`, {
        paymentId,
        transactionHash: receipt.hash,
      });

      console.log("✅ Backend verification complete");
      console.log("🎉 Payment successful!\n");

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        ...result.data,
      };
    } catch (error) {
      console.error("\n❌ Payment error:", error);

      // Parse error message
      let errorMessage = "Payment failed";

      if (error.code === "ACTION_REJECTED") {
        errorMessage = "Transaction was rejected by user";
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        errorMessage = "Insufficient funds for transaction";
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
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
      console.error("Get transactions error:", error);
      throw new Error("Failed to get transactions");
    }
  }

  // Verify transaction
  async verifyTransaction(txHash) {
    try {
      const response = await api.get(`${API_BASE_URL}/blockchain/verify/${txHash}`);
      return response.data.data;
    } catch (error) {
      console.error("Verify transaction error:", error);
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
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${this.chainId.toString(16)}` }],
      });
      console.log("✅ Network switched to Chain ID:", this.chainId);
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
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${this.chainId.toString(16)}`,
            chainName: this.networkName,
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: [this.rpcUrl],
            blockExplorerUrls: null,
          },
        ],
      });
      console.log("✅ Network added:", this.networkName);
    } catch (error) {
      console.error("Add network error:", error);
      throw new Error("Failed to add network to MetaMask");
    }
  }

  // Check if wallet is connected
  async checkConnection() {
    try {
      if (typeof window.ethereum === "undefined") {
        return { connected: false, reason: "MetaMask not installed" };
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length === 0) {
        return { connected: false, reason: "No accounts connected" };
      }

      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const currentChainId = parseInt(chainId, 16);

      if (currentChainId !== this.chainId) {
        return {
          connected: false,
          reason: `Wrong network. Expected Chain ID: ${this.chainId}, Current: ${currentChainId}`,
        };
      }

      return {
        connected: true,
        address: accounts[0],
        chainId: currentChainId,
      };
    } catch (error) {
      return { connected: false, reason: error.message };
    }
  }
}

export default new BlockchainService();
