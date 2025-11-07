import { Box, Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function CheckoutForm({ cart, setCart, goBack }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
  });

  const total = cart.reduce((s, i) => s + i.salePrice * i.quantity, 0);

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.date) {
      alert("Vui lòng điền đầy đủ!");
      return;
    }
    alert("Đặt dịch vụ thành công! Cảm ơn bạn!");
    setCart([]);
    localStorage.removeItem("travelCart");
  };

  return (
    <Box>
      <Button onClick={goBack} sx={{ mb: 2 }}>
        ← Quay lại giỏ hàng
      </Button>

      <Typography variant="h5" gutterBottom>
        Xác nhận đặt dịch vụ
      </Typography>

      <Stack spacing={3} mt={3}>
        <TextField
          label="Họ và tên"
          fullWidth
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          label="Số điện thoại"
          fullWidth
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <TextField
          label="Email"
          fullWidth
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <TextField
          label="Ngày khởi hành"
          type="date"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          inputProps={{ min: new Date().toISOString().split("T")[0] }}
        />
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Chi tiết đơn hàng
      </Typography>
      {cart.map((item) => (
        <Stack key={item} direction="row" justifyContent="space-between" py={1}>
          <Typography variant="body2">
            {item.name} x{item.quantity}
          </Typography>
          <Typography fontWeight={600}>
            {(item.salePrice * item.quantity).toLocaleString()}đ
          </Typography>
        </Stack>
      ))}

      <Stack direction="row" justifyContent="space-between" mt={2} fontWeight={600}>
        <Typography variant="h6">Tổng cộng:</Typography>
        <Typography variant="h6" color="error">
          {total.toLocaleString()}đ
        </Typography>
      </Stack>

      <Button
        variant="contained"
        color="success"
        fullWidth
        size="large"
        sx={{ mt: 3 }}
        onClick={handleSubmit}
      >
        Xác nhận đặt dịch vụ
      </Button>
    </Box>
  );
}
