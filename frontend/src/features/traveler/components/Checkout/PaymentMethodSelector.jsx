import { CurrencyBitcoin } from "@mui/icons-material";
import { Box, FormControlLabel, Paper, Radio, RadioGroup, Stack, Typography } from "@mui/material";

const PaymentMethodSelector = ({ selectedMethod, onChange }) => {
  const paymentMethods = [
    {
      id: "VNPAY",
      name: "VNPay",
      description: "Thanh toán qua VNPay QR, Thẻ ATM, Visa/Master",
      logo: "https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png",
      enabled: true,
    },
    {
      id: "MOMO",
      name: "Momo",
      description: "Thanh toán qua ví Momo",
      logo: "https://developers.momo.vn/v3/img/logo.svg",
      enabled: false,
    },
    {
      id: "BLOCKCHAIN",
      name: "Cryptocurrency",
      description: "Thanh toán bằng tiền điện tử",
      icon: <CurrencyBitcoin sx={{ fontSize: 30, color: "#f7931a" }} />,
      enabled: false,
    },
  ];

  return (
    <Stack spacing={3}>
      <Typography variant="h6">Phương thức thanh toán</Typography>

      <RadioGroup value={selectedMethod} onChange={(e) => onChange(e.target.value)}>
        {paymentMethods.map((method) => (
          <Paper
            key={method.id}
            sx={{
              p: 2,
              mb: 2,
              border: selectedMethod === method.id ? "2px solid" : "1px solid #ddd",
              borderColor: selectedMethod === method.id ? "primary.main" : "#ddd",
              opacity: method.enabled ? 1 : 0.6,
              cursor: method.enabled ? "pointer" : "not-allowed",
            }}
          >
            <FormControlLabel
              value={method.id}
              control={<Radio />}
              disabled={!method.enabled}
              label={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  {method.logo ? (
                    <img
                      src={method.logo}
                      alt={method.name}
                      style={{ height: 30, objectFit: "contain" }}
                    />
                  ) : (
                    method.icon
                  )}
                  <Box flex={1}>
                    <Typography variant="body1" fontWeight="medium">
                      {method.name}
                      {!method.enabled && " (Coming soon)"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {method.description}
                    </Typography>
                  </Box>
                </Box>
              }
              sx={{ width: "100%", m: 0 }}
            />
          </Paper>
        ))}
      </RadioGroup>

      <Box
        sx={{
          p: 2,
          bgcolor: "#e3f2fd",
          borderRadius: 1,
          border: "1px solid #90caf9",
        }}
      >
        <Typography variant="caption" color="primary.dark">
          🔒 Giao dịch được bảo mật với SSL 256-bit encryption
        </Typography>
      </Box>
    </Stack>
  );
};

export default PaymentMethodSelector;
