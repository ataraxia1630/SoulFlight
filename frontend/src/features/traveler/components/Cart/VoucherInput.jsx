import { LocalOffer } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

const VoucherInput = ({ appliedVoucher, onApply, onRemove }) => {
  const [voucherCode, setVoucherCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleApply = async () => {
    if (!voucherCode.trim()) {
      setError("Vui lòng nhập mã voucher");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onApply(voucherCode.trim().toUpperCase());
      setVoucherCode("");
    } catch (err) {
      setError(err.message || "Mã voucher không hợp lệ");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onRemove();
    setVoucherCode("");
    setError(null);
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        <LocalOffer fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
        Mã giảm giá
      </Typography>

      {appliedVoucher ? (
        <Box
          sx={{
            p: 2,
            bgcolor: "success.light",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="body2" fontWeight="medium" color="white">
              ✓ {appliedVoucher.code}
            </Typography>
            <Typography variant="caption" color="white">
              Giảm {appliedVoucher.discount_percent}%
            </Typography>
          </Box>
          <Button variant="outlined" size="small" color="white" onClick={handleRemove}>
            Hủy
          </Button>
        </Box>
      ) : (
        <>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              size="small"
              placeholder="Nhập mã voucher"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === "Enter" && handleApply()}
              disabled={loading}
            />
            <Button
              variant="contained"
              onClick={handleApply}
              disabled={loading || !voucherCode.trim()}
              sx={{ minWidth: 100 }}
            >
              {loading ? <CircularProgress size={20} /> : "Áp dụng"}
            </Button>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mt: 1 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
        </>
      )}
    </Box>
  );
};

export default VoucherInput;
