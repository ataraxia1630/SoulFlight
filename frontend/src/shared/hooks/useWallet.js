import { useCallback, useEffect, useState } from "react";
import blockchainService from "../services/blockchain.service";

export const useWallet = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState({ tpt: 0, vnd: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkConnection = useCallback(async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        const balance = await blockchainService.getBalance(address);

        setWalletAddress(address);
        setWalletBalance(balance);
        setWalletConnected(true);
      }
    } catch (err) {
      console.error("Check connection error:", err);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await blockchainService.connectWallet();

      setWalletAddress(result.address);
      setWalletBalance(result.balance);
      setWalletConnected(true);

      return result;
    } catch (err) {
      const errorMessage = err.message || "Failed to connect wallet";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await blockchainService.disconnectWallet();

      setWalletAddress("");
      setWalletBalance({ tpt: 0, vnd: 0 });
      setWalletConnected(false);
    } catch (err) {
      const errorMessage = err.message || "Failed to disconnect wallet";
      setError(errorMessage);
      console.error("Disconnect error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!walletAddress) return;

    try {
      setLoading(true);
      setError(null);

      const balance = await blockchainService.getBalance(walletAddress);
      setWalletBalance(balance);
    } catch (err) {
      const errorMessage = err.message || "Failed to refresh balance";
      setError(errorMessage);
      console.error("Refresh balance error:", err);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setWalletConnected(false);
        setWalletAddress("");
        setWalletBalance({ tpt: 0, vnd: 0 });
      } else {
        checkConnection();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    checkConnection();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [checkConnection]);

  return {
    walletConnected,
    walletAddress,
    walletBalance,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    setError,
  };
};

export default useWallet;
