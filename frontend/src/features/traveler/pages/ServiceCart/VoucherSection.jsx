import { Box, Button, Typography } from "@mui/material";

export default function VoucherSection() {
  return (
    <Box
      sx={{
        border: "1px dashed #ff6b35",
        borderRadius: 2,
        p: 2,
        backgroundColor: "#fff8f5",
      }}
    >
      <Typography variant="body2" color="error" fontWeight={500}>
        Voucher giảm đến 10k
      </Typography>
      <Button size="small" color="error" sx={{ mt: 1 }}>
        Xem thêm voucher
      </Button>
    </Box>
  );
}
