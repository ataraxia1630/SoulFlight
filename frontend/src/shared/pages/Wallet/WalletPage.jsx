import { Add, CallReceived, History, Send, TrendingUp } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import LoadingState from "../../components/LoadingState";
import WalletConnect from "../../components/WalletConnect";
import useWallet from "../../hooks/useWallet";
import blockchainService from "../../services/blockchain.service";

const WalletPage = () => {
  const {
    walletConnected,
    walletAddress,
    walletBalance,
    loading: walletLoading,
    error: walletError,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    setError: _setWalletError,
  } = useWallet();

  const [ethBalance, setEthBalance] = useState("0");
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sendTo, setSendTo] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [sendError, setSendError] = useState(null);

  const CONTRACT_ADDRESS = import.meta.env.VITE_TRAVELPAY_CONTRACT_ADDRESS;

  const fetchEthBalance = useCallback(async () => {
    if (!walletAddress) return;

    try {
      if (typeof window.ethereum === "undefined") {
        console.warn("MetaMask not detected");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(walletAddress);
      setEthBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error("Fetch ETH balance error:", err);
    }
  }, [walletAddress]);

  const fetchTransactions = useCallback(async () => {
    if (!walletConnected) return;

    try {
      setLoadingTransactions(true);
      const result = await blockchainService.getTransactions({
        page: 1,
        limit: 10,
      });
      setTransactions(result.transactions || []);
    } catch (err) {
      console.error("Fetch transactions error:", err);
    } finally {
      setLoadingTransactions(false);
    }
  }, [walletConnected]);

  const handleSendTokens = async () => {
    if (!sendTo || !sendAmount) {
      setSendError("Please fill in all fields");
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(sendTo)) {
      setSendError("Invalid Ethereum address");
      return;
    }

    const amount = parseFloat(sendAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      setSendError("Invalid amount");
      return;
    }

    if (amount > walletBalance.tpt) {
      setSendError("Insufficient balance");
      return;
    }

    try {
      setSendLoading(true);
      setSendError(null);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        [
          "function transfer(address to, uint256 amount) returns (bool)",
          "function balanceOf(address) view returns (uint256)",
        ],
        signer,
      );

      const tx = await contract.transfer(sendTo, ethers.parseEther(sendAmount), {
        gasLimit: 100000,
      });

      await tx.wait();

      setSendDialogOpen(false);
      setSendTo("");
      setSendAmount("");

      await refreshBalance();
      await fetchTransactions();

      alert("Transfer successful!");
    } catch (err) {
      console.error("Send tokens error:", err);
      setSendError(err.message || "Transfer failed");
    } finally {
      setSendLoading(false);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    alert("Address copied to clipboard!");
  };

  const handleRefresh = async () => {
    await Promise.all([refreshBalance(), fetchEthBalance(), fetchTransactions()]);
  };

  useEffect(() => {
    if (walletConnected) {
      fetchEthBalance();
      fetchTransactions();
    }
  }, [walletConnected, fetchEthBalance, fetchTransactions]);

  const formatTxType = (type) => {
    const typeMap = {
      PAYMENT: "Payment",
      REFUND: "Refund",
      TRANSFER: "Transfer",
      CASHBACK: "Cashback",
      AIRDROP: "Airdrop",
    };
    return typeMap[type] || type;
  };

  const getTxStatusColor = (status) => {
    const statusMap = {
      CONFIRMED: "success",
      PENDING: "warning",
      FAILED: "error",
    };
    return statusMap[status] || "default";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!walletConnected) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Wallet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your TravelPay tokens
          </Typography>
        </Box>

        <WalletConnect
          walletConnected={walletConnected}
          walletAddress={walletAddress}
          walletBalance={walletBalance}
          loading={walletLoading}
          error={walletError}
          onConnect={connectWallet}
          showDisconnect={false}
          showRefresh={false}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Wallet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your TravelPay tokens
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <WalletConnect
            walletConnected={walletConnected}
            walletAddress={walletAddress}
            walletBalance={walletBalance}
            loading={walletLoading}
            error={walletError}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
            onRefresh={handleRefresh}
          />

          {/* ETH Balance */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                ETH Balance (for gas fees)
              </Typography>
              <Typography variant="h6" fontWeight="500">
                {parseFloat(ethBalance).toFixed(4)} ETH
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Used for transaction gas fees
              </Typography>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  onClick={() => setSendDialogOpen(true)}
                  fullWidth
                >
                  Send TPT
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CallReceived />}
                  onClick={handleCopyAddress}
                  fullWidth
                >
                  Receive
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <History />
                <Typography variant="h6">Transaction History</Typography>
              </Box>

              {loadingTransactions ? (
                <Box textAlign="center" py={4}>
                  <LoadingState message="Loading transactions..." />
                </Box>
              ) : transactions.length === 0 ? (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 4,
                    textAlign: "center",
                    bgcolor: "background.default",
                  }}
                >
                  <History sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No transactions yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your transaction history will appear here
                  </Typography>
                </Paper>
              ) : (
                <Stack spacing={2}>
                  {transactions.map((tx) => (
                    <Paper
                      key={tx.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                        <Box>
                          <Typography variant="body2" fontWeight="500">
                            {formatTxType(tx.tx_type)}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontFamily="monospace"
                          >
                            {tx.tx_hash.slice(0, 10)}...{tx.tx_hash.slice(-8)}
                          </Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography
                            variant="body2"
                            fontWeight="500"
                            color={tx.tx_type === "PAYMENT" ? "error.main" : "success.main"}
                          >
                            {tx.tx_type === "PAYMENT" ? "-" : "+"}
                            {parseFloat(tx.amount_tpt).toFixed(2)} TPT
                          </Typography>
                          <Chip
                            label={tx.status}
                            size="small"
                            color={getTxStatusColor(tx.status)}
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(tx.created_at)}
                        </Typography>
                        {tx.block_number && (
                          <Typography variant="caption" color="text.secondary">
                            Block: {tx.block_number}
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* About TPT */}
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <TrendingUp color="primary" />
                <Typography variant="h6">About TravelPay Token</Typography>
              </Box>

              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Exchange Rate
                  </Typography>
                  <Chip label="1 TPT = 1,000 VND" color="primary" />
                </Box>

                <Divider />

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Benefits
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">✓ 2% cashback on every booking</Typography>
                    <Typography variant="body2">✓ Lower transaction fees</Typography>
                    <Typography variant="body2">✓ Instant payments</Typography>
                    <Typography variant="body2">✓ Secure blockchain technology</Typography>
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Network Information
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="body2">Network: Localhost</Typography>
                    <Typography variant="body2">Chain ID: 31337</Typography>
                    <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                      Contract: {CONTRACT_ADDRESS?.slice(0, 10)}...
                      {CONTRACT_ADDRESS?.slice(-8)}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Get Test Tokens */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Get Test Tokens
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Need some test TPT for development?
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Contact admin or use the airdrop feature to get test tokens
              </Alert>
              <Button variant="outlined" fullWidth startIcon={<Add />} disabled>
                Request Airdrop (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          {/* Help */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Need Help?
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Check out our documentation or contact support
              </Typography>
              <Stack spacing={1}>
                <Button variant="text" size="small" fullWidth>
                  View Documentation
                </Button>
                <Button variant="text" size="small" fullWidth>
                  Contact Support
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Send Dialog */}
      <Dialog
        open={sendDialogOpen}
        onClose={() => {
          setSendDialogOpen(false);
          setSendError(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Send TPT</DialogTitle>
        <DialogContent>
          {sendError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {sendError}
            </Alert>
          )}

          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Recipient Address"
              value={sendTo}
              onChange={(e) => {
                setSendTo(e.target.value);
                setSendError(null);
              }}
              placeholder="0x..."
              helperText="Enter the recipient's Ethereum address"
            />
            <TextField
              fullWidth
              label="Amount (TPT)"
              type="number"
              value={sendAmount}
              onChange={(e) => {
                setSendAmount(e.target.value);
                setSendError(null);
              }}
              helperText={`Available: ${walletBalance.tpt.toFixed(2)} TPT`}
              inputProps={{
                min: 0,
                step: 0.01,
              }}
            />

            {sendAmount && (
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "background.default" }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Transaction Summary
                </Typography>
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Amount:</Typography>
                    <Typography variant="body2" fontWeight="500">
                      {sendAmount} TPT
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">≈ VND:</Typography>
                    <Typography variant="body2" fontWeight="500">
                      {(parseFloat(sendAmount) * 1000).toLocaleString("vi-VN")} VND
                    </Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">New Balance:</Typography>
                    <Typography variant="body2" fontWeight="500">
                      {(walletBalance.tpt - parseFloat(sendAmount || 0)).toFixed(2)} TPT
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSendDialogOpen(false);
              setSendError(null);
            }}
            disabled={sendLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSendTokens}
            disabled={sendLoading || !sendTo || !sendAmount}
          >
            {sendLoading ? "Sending..." : "Send"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WalletPage;
