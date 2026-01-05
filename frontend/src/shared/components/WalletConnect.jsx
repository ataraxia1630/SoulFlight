import { AccountBalanceWallet, ContentCopy, PowerSettingsNew, Refresh } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

const WalletConnect = ({
  walletConnected,
  walletAddress,
  walletBalance,
  loading,
  error,
  onConnect,
  onDisconnect,
  onRefresh,
  showDisconnect = true,
  showRefresh = true,
  compact = false,
}) => {
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    alert("Address copied to clipboard!");
  };

  if (!walletConnected) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: compact ? 2 : 4,
          textAlign: "center",
          bgcolor: "background.default",
        }}
      >
        <AccountBalanceWallet
          sx={{
            fontSize: compact ? 60 : 80,
            color: "primary.main",
            mb: 2,
          }}
        />
        <Typography variant={compact ? "h6" : "h5"} gutterBottom>
          Connect Your Wallet
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Connect MetaMask to manage your TravelPay tokens
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, textAlign: "left" }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          size={compact ? "medium" : "large"}
          onClick={onConnect}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Connecting..." : "Connect MetaMask"}
        </Button>

        <Typography variant="caption" color="text.secondary" display="block" mt={2}>
          Make sure you're on Localhost network (Chain ID: 31337)
        </Typography>
      </Paper>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Wallet Connected</Typography>
          <Box display="flex" gap={1}>
            {showRefresh && (
              <IconButton
                onClick={onRefresh}
                disabled={loading}
                size="small"
                title="Refresh Balance"
              >
                <Refresh />
              </IconButton>
            )}
            {showDisconnect && (
              <IconButton
                onClick={onDisconnect}
                disabled={loading}
                size="small"
                color="error"
                title="Disconnect Wallet"
              >
                <PowerSettingsNew />
              </IconButton>
            )}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            p: 2,
            bgcolor: "background.default",
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
            <Typography variant="body2" fontFamily="monospace" fontWeight="500">
              {formatAddress(walletAddress)}
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleCopyAddress}>
            <ContentCopy fontSize="small" />
          </IconButton>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            TravelPay Token (TPT)
          </Typography>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            {walletBalance.tpt.toFixed(2)} TPT
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ≈ {walletBalance.vnd.toLocaleString("vi-VN")} VND
          </Typography>

          <Box mt={2}>
            <Chip
              label={`Exchange Rate: 1 TPT = 1,000 VND`}
              size="small"
              color="default"
              variant="outlined"
            />
          </Box>
        </Box>

        {loading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={24} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

WalletConnect.propTypes = {
  walletConnected: PropTypes.bool.isRequired,
  walletAddress: PropTypes.string,
  walletBalance: PropTypes.shape({
    tpt: PropTypes.number,
    vnd: PropTypes.number,
  }),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onConnect: PropTypes.func.isRequired,
  onDisconnect: PropTypes.func,
  onRefresh: PropTypes.func,
  showDisconnect: PropTypes.bool,
  showRefresh: PropTypes.bool,
  compact: PropTypes.bool,
};

WalletConnect.defaultProps = {
  walletAddress: "",
  walletBalance: { tpt: 0, vnd: 0 },
  loading: false,
  error: null,
  onDisconnect: () => {},
  onRefresh: () => {},
  showDisconnect: true,
  showRefresh: true,
  compact: false,
};

export default WalletConnect;
