import { AccountBalanceWallet, CheckCircle, SwapHoriz } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";

// TravelPay Token Contract ABI (simplified)
const TRAVELPAY_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function payBooking(bytes32 bookingId, address provider, uint256 amount) returns (bool)",
];

const BlockchainPayment = ({ open, onClose, paymentData, onSuccess, onError }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [_walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [tptBalance, setTptBalance] = useState("0");
  const [transactionHash, setTransactionHash] = useState("");

  const steps = ["Connect Wallet", "Confirm Payment", "Processing"];

  const CONTRACT_ADDRESS = process.env.REACT_APP_TRAVELPAY_TOKEN_ADDRESS;

  const connectWallet = useCallback(async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("Please install MetaMask to continue");
      }

      setLoading(true);
      setError(null);

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const address = accounts[0];
      setWalletAddress(address);

      // Check if connected address matches customer address
      if (address.toLowerCase() !== paymentData.customerAddress.toLowerCase()) {
        throw new Error(
          `Please connect with your registered wallet: ${paymentData.customerAddress}`,
        );
      }

      // Get TPT balance
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, TRAVELPAY_ABI, provider);
      const balance = await contract.balanceOf(address);
      const balanceFormatted = ethers.formatEther(balance);
      setTptBalance(balanceFormatted);

      // Check sufficient balance
      if (parseFloat(balanceFormatted) < paymentData.totalTPT) {
        throw new Error(
          `Insufficient TPT balance. Required: ${paymentData.totalTPT} TPT, Available: ${balanceFormatted} TPT`,
        );
      }

      setWalletConnected(true);
      setActiveStep(1);
    } catch (err) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  }, [paymentData, CONTRACT_ADDRESS]);

  useEffect(() => {
    const checkWalletConnection = async () => {
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

    if (open) {
      checkWalletConnection();
    }
  }, [open, connectWallet]);

  const processPayment = async () => {
    try {
      setLoading(true);
      setError(null);
      setActiveStep(2);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, TRAVELPAY_ABI, signer);

      // Process each booking payment
      for (const booking of paymentData.bookings) {
        const bookingIdBytes32 = ethers.id(booking.id);
        const amountTPT = Math.floor(booking.amount / 1000); // Convert VND to TPT
        const amountWei = ethers.parseEther(amountTPT.toString());

        // Get provider wallet (from backend or contract)
        const providerAddress = booking.providerWallet || paymentData.providerWallet;

        // Execute payment
        const tx = await contract.payBooking(bookingIdBytes32, providerAddress, amountWei);

        // Wait for confirmation
        const receipt = await tx.wait();
        setTransactionHash(receipt.hash);
      }

      // Notify backend of successful payment
      await onSuccess({
        paymentId: paymentData.paymentId,
        transactionHash,
      });

      setActiveStep(3);
    } catch (err) {
      setError(err.message || "Payment failed");
      onError(err);
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      // Reset state
      setActiveStep(0);
      setWalletConnected(false);
      setError(null);
      setTransactionHash("");
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <AccountBalanceWallet color="primary" />
          <Typography variant="h6">TravelPay Blockchain Payment</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Step 0: Connect Wallet */}
        {activeStep === 0 && (
          <Box textAlign="center" py={2}>
            <AccountBalanceWallet sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Connect Your Wallet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please connect MetaMask to continue with blockchain payment
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={connectWallet}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Connecting..." : "Connect MetaMask"}
            </Button>
          </Box>
        )}

        {/* Step 1: Confirm Payment */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm Payment Details
            </Typography>

            <Stack spacing={2} sx={{ mt: 2 }}>
              {/* Wallet Info */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f5f5f5",
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Your Wallet
                </Typography>
                <Typography variant="body2" fontFamily="monospace">
                  {formatAddress(walletAddress)}
                </Typography>
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography variant="caption" color="text.secondary">
                    TPT Balance
                  </Typography>
                  <Chip
                    label={`${parseFloat(tptBalance).toFixed(2)} TPT`}
                    size="small"
                    color="primary"
                  />
                </Box>
              </Box>

              {/* Payment Details */}
              <Divider />

              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Amount (VND)</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {paymentData.totalVND.toLocaleString("vi-VN")} ₫
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="center" my={1}>
                  <SwapHoriz color="action" />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Amount (TPT)</Typography>
                  <Typography variant="h6" color="primary">
                    {paymentData.totalTPT} TPT
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* Bookings */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Bookings ({paymentData.bookings.length})
                </Typography>
                {paymentData.bookings.map((booking) => (
                  <Box
                    key={booking.id}
                    sx={{
                      p: 1,
                      bgcolor: "#fafafa",
                      borderRadius: 1,
                      mt: 1,
                    }}
                  >
                    <Typography variant="caption">
                      #{booking.id} - {Math.floor(booking.amount / 1000)} TPT
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Alert severity="info" icon={false}>
                <Typography variant="caption">
                  💡 You will receive 2% cashback in TPT after successful payment
                </Typography>
              </Alert>
            </Stack>
          </Box>
        )}

        {/* Step 2: Processing */}
        {activeStep === 2 && (
          <Box textAlign="center" py={4}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Processing Payment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please confirm the transaction in MetaMask and wait for blockchain confirmation...
            </Typography>
          </Box>
        )}

        {/* Step 3: Success */}
        {activeStep === 3 && (
          <Box textAlign="center" py={2}>
            <CheckCircle sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Payment Successful!
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Your payment has been confirmed on the blockchain
            </Typography>
            {transactionHash && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f5f5f5",
                  borderRadius: 1,
                  mt: 2,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Transaction Hash
                </Typography>
                <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: "break-all" }}>
                  {transactionHash}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {activeStep === 1 && (
          <>
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="contained" onClick={processPayment} disabled={loading}>
              Confirm Payment
            </Button>
          </>
        )}
        {activeStep === 3 && (
          <Button variant="contained" onClick={handleClose}>
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BlockchainPayment;
