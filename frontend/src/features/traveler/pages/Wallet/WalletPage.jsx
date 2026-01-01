import {
  AccountBalanceWallet,
  Add,
  CallReceived,
  ContentCopy,
  History,
  Refresh,
  Send,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";

const TRAVELPAY_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

const WalletPage = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [tptBalance, setTptBalance] = useState("0");
  const [maticBalance, setMaticBalance] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactions, _setTransactions] = useState([]);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sendTo, setSendTo] = useState("");
  const [sendAmount, setSendAmount] = useState("");

  // const CONTRACT_ADDRESS = process.env.REACT_APP_TRAVELPAY_TOKEN_ADDRESS || '';
  const CONTRACT_ADDRESS = "hihihihihi" || "";
  const EXCHANGE_RATE = 1000; // 1 TPT = 1000 VND

  const updateBalances = useCallback(async (address) => {
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("Please install MetaMask to continue");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      // Get MATIC balance
      const maticBal = await provider.getBalance(address);
      setMaticBalance(ethers.formatEther(maticBal));

      // Get TPT balance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, TRAVELPAY_ABI, provider);
      const tptBal = await contract.balanceOf(address);
      setTptBalance(ethers.formatEther(tptBal));
    } catch (err) {
      console.error("Update balance error:", err);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window.ethereum === "undefined") {
        throw new Error("Please install MetaMask to continue");
      }

      // Request accounts
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const address = accounts[0];
      setWalletAddress(address);

      // Cập nhật balance bằng hàm bạn đã viết
      await updateBalances(address);
    } catch (err) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  }, [updateBalances]);

  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (err) {
          console.error("Check wallet error:", err);
        }
      }
    };

    checkWallet();
  }, [connectWallet]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    alert("Address copied to clipboard!");
  };

  const handleSendTokens = async () => {
    try {
      if (!sendTo || !sendAmount) {
        setError("Please fill in all fields");
        return;
      }

      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, TRAVELPAY_ABI, signer);

      const tx = await contract.transfer(sendTo, ethers.parseEther(sendAmount));
      await tx.wait();

      alert("Transfer successful!");
      setSendDialogOpen(false);
      setSendTo("");
      setSendAmount("");

      await updateBalances(walletAddress);
    } catch (err) {
      setError(err.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const tptToVND = (tpt) => {
    return (parseFloat(tpt) * EXCHANGE_RATE).toLocaleString("vi-VN");
  };

  if (!walletAddress) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 8, textAlign: "center" }}>
          <AccountBalanceWallet sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Connect Your Wallet
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Connect MetaMask to manage your TravelPay tokens
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={connectWallet}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Wallet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your TravelPay tokens
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Balance Card */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Balance</Typography>
                <IconButton onClick={() => updateBalances(walletAddress)}>
                  <Refresh />
                </IconButton>
              </Box>

              {/* Wallet Address */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f5f5f5",
                  borderRadius: 1,
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Wallet Address
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {formatAddress(walletAddress)}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={handleCopyAddress}>
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Box>

              {/* TPT Balance */}
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  TravelPay Token (TPT)
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {parseFloat(tptBalance).toFixed(2)} TPT
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ≈ {tptToVND(tptBalance)} VND
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* MATIC Balance */}
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  MATIC (Gas Fee)
                </Typography>
                <Typography variant="h6">{parseFloat(maticBalance).toFixed(4)} MATIC</Typography>
              </Box>

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} mt={3}>
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  onClick={() => setSendDialogOpen(true)}
                  fullWidth
                >
                  Send
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
                <Typography variant="h6">Recent Transactions</Typography>
              </Box>

              {transactions.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                  No transactions yet
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {transactions.map((tx) => (
                    <Box
                      key={tx}
                      sx={{
                        p: 2,
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                      }}
                    >
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">{tx.type}</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {tx.amount} TPT
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {tx.date}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Info Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About TravelPay Token
              </Typography>

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
                    Network
                  </Typography>
                  <Typography variant="body2">Polygon (Mumbai Testnet)</Typography>
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  href="https://mumbai.polygonscan.com/"
                  target="_blank"
                >
                  View on Explorer
                </Button>
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
              <Button variant="contained" fullWidth startIcon={<Add />}>
                Request Airdrop
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Send Dialog */}
      <Dialog
        open={sendDialogOpen}
        onClose={() => setSendDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Send TPT</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Recipient Address"
              value={sendTo}
              onChange={(e) => setSendTo(e.target.value)}
              placeholder="0x..."
            />
            <TextField
              fullWidth
              label="Amount (TPT)"
              type="number"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              helperText={`Available: ${parseFloat(tptBalance).toFixed(2)} TPT`}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSendTokens} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WalletPage;
