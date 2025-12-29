import { Add, CalendarMonth, Remove, Restaurant } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { formatCurrency } from "@/shared/utils/formatters";
import MenuService from "../../../../shared/services/menu.service";
import { voucherAPI } from "../../../../shared/services/voucher.service";
import toast from "../../../../shared/utils/toast";
import VoucherInput from "../Cart/VoucherInput";

const MenuBookingCard = ({ menu, onAddToCart }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [visitDate, setVisitDate] = useState("");
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [_voucherLoading, setVoucherLoading] = useState(false);
  const navigate = useNavigate();

  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const finalTotal = appliedVoucher ? totalPrice - appliedVoucher.discount_amount : totalPrice;

  const handleUpdateQuantity = (menuItem, delta) => {
    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.id === menuItem.id);

      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) {
          return prev.filter((item) => item.id !== menuItem.id);
        }
        return prev.map((item) =>
          item.id === menuItem.id ? { ...item, quantity: newQuantity } : item,
        );
      }

      if (delta > 0) {
        return [...prev, { ...menuItem, quantity: 1 }];
      }
      return prev;
    });
  };

  const formatDataForBE = () => ({
    serviceId: menu.service_id,
    items: selectedItems.map((item) => ({
      menuItemId: item.id,
      quantity: item.quantity,
    })),
    visitDate: visitDate || undefined,
    voucherCode: appliedVoucher?.code || undefined,
  });

  const handleAddToCartClick = async () => {
    setActionLoading(true);
    try {
      await onAddToCart(formatDataForBE());
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (err) {
      toast.error(err.message || "Lỗi khi thêm vào giỏ");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBookNowClick = async () => {
    setActionLoading(true);
    try {
      const result = await MenuService.bookMenu(formatDataForBE());
      toast.success("Tạo booking thành công!");
      navigate(`/checkout?bookingIds=${result.data.booking.id}`);
    } catch (err) {
      toast.error(err.message || "Lỗi khi tạo booking");
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    toast.info("Đã hủy mã giảm giá");
  };

  const handleApplyVoucher = async (code) => {
    setVoucherLoading(true);
    try {
      const voucher = await voucherAPI.checkVoucher(code, menu.service_id, totalPrice);
      const discountAmount = totalPrice * (voucher.discountPercent / 100);
      setAppliedVoucher({
        code,
        discount_percent: voucher.discountPercent,
        discount_amount: discountAmount,
      });
      toast.success(`Áp dụng thành công! Giảm ${voucher.discountPercent}%`);
    } catch (err) {
      throw new Error(err.message || "Mã không hợp lệ hoặc không áp dụng được");
    } finally {
      setVoucherLoading(false);
    }
  };

  return (
    <Card sx={{ position: "sticky", top: 100, borderRadius: 3, boxShadow: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={1.5} mb={2}>
          <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
            <Restaurant fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Thực đơn
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
              {menu.name}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" fontWeight="bold" mb={1}>
          Chọn món ăn
        </Typography>
        <List disablePadding sx={{ mb: 2 }}>
          {menu.items.map((item) => {
            const selected = selectedItems.find((i) => i.id === item.id);
            return (
              <ListItem
                key={item.id}
                disableGutters
                sx={{
                  py: 1,
                  px: 1.5,
                  mb: 1,
                  borderRadius: 2,
                  bgcolor: selected ? "primary.50" : "transparent",
                  border: "1px solid",
                  borderColor: selected ? "primary.light" : "grey.100",
                  transition: "0.2s",
                }}
              >
                <Box flex={1}>
                  <Typography variant="body2" fontWeight="medium">
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="primary.main" fontWeight="bold">
                    {formatCurrency(item.price)}
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.300",
                    p: 0.5,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleUpdateQuantity(item, -1)}
                    disabled={!selected}
                    sx={{ p: 0.5 }}
                  >
                    <Remove fontSize="small" />
                  </IconButton>

                  <Typography
                    variant="body2"
                    sx={{
                      minWidth: 20,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {selected?.quantity || 0}
                  </Typography>

                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleUpdateQuantity(item, 1)}
                    sx={{ p: 0.5 }}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </Stack>
              </ListItem>
            );
          })}
        </List>
        <TextField
          fullWidth
          label="Ngày đến"
          type="date"
          size="small"
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <CalendarMonth fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
          sx={{ mb: 2 }}
        />
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Divider sx={{ my: 3 }} />
        <VoucherInput
          appliedVoucher={appliedVoucher}
          onApply={handleApplyVoucher}
          onRemove={handleRemoveVoucher}
        />
        <Stack spacing={1} sx={{ mt: 2 }}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle" fontWeight="bold">
              Tổng cộng
            </Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {formatCurrency(totalPrice)}
            </Typography>
          </Box>
          {appliedVoucher && (
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="success.main">
                Giảm giá ({appliedVoucher.code})
              </Typography>
              <Typography variant="body2" color="success.main">
                -{formatCurrency(appliedVoucher.discount_amount)}
              </Typography>
            </Box>
          )}
          <Divider />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6" fontWeight="bold">
              Cần thanh toán
            </Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {formatCurrency(finalTotal)}
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={2} sx={{ mt: 3 }}>
          <LoadingButton
            variant="contained"
            fullWidth
            size="large"
            onClick={handleBookNowClick}
            disabled={selectedItems.length === 0 || !visitDate}
            loading={actionLoading}
          >
            Đặt ngay
          </LoadingButton>

          <LoadingButton
            variant="outlined"
            fullWidth
            onClick={handleAddToCartClick}
            disabled={selectedItems.length === 0 || !visitDate}
            loading={actionLoading}
          >
            Thêm vào giỏ hàng
          </LoadingButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MenuBookingCard;
