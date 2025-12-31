import {
  Add,
  DeleteOutline,
  Explore,
  Remove,
  ShoppingBagOutlined,
  ShoppingCartCheckout,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingState from "@/shared/components/LoadingState";
import { CartService } from "../../../../shared/services/cart.service";
import { voucherAPI } from "../../../../shared/services/voucher.service";
import VoucherInput from "../../components/Cart/VoucherInput";

const CartPage = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appliedVouchers, setAppliedVouchers] = useState({}); // { serviceId: voucherObject }
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await CartService.getCart();
        setCartData(res.data);
      } catch (error) {
        console.error("Lỗi tải giỏ hàng", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    await CartService.updateCartItem(itemId, { quantity: newQty });
    fetchCart();
  };

  const handleRemoveItem = async (itemId) => {
    await CartService.removeFromCart(itemId);
    fetchCart();
  };

  const handleApplyVoucher = async (serviceId, code, totalAmount) => {
    const voucher = await voucherAPI.checkVoucher(code, serviceId, totalAmount);
    setAppliedVouchers((prev) => ({ ...prev, [serviceId]: voucher }));
  };

  const handleRemoveVoucher = (serviceId) => {
    setAppliedVouchers((prev) => {
      const newState = { ...prev };
      delete newState[serviceId];
      return newState;
    });
  };

  const checkoutSummary = useMemo(() => {
    if (!cartData) return { subTotal: 0, discount: 0, finalTotal: 0 };

    let subTotal = 0;
    let totalDiscount = 0;

    cartData.services.forEach((service) => {
      subTotal += service.serviceTotal;
      const voucher = appliedVouchers[service.serviceId];
      if (voucher) {
        totalDiscount += (service.serviceTotal * voucher.discount_percent) / 100;
      }
    });

    return {
      subTotal,
      totalDiscount,
      finalTotal: subTotal - totalDiscount,
    };
  }, [cartData, appliedVouchers]);

  if (loading) return <LoadingState />;
  if (!cartData || cartData.services.length === 0) {
    return (
      <Container sx={{ py: 10 }}>
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            bgcolor: "transparent",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              bgcolor: "grey.100",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <ShoppingBagOutlined sx={{ fontSize: 60, color: "text.secondary", opacity: 0.5 }} />
          </Box>

          <Typography variant="h5" fontWeight="bold">
            Giỏ hàng của bạn đang rỗng
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mb: 2 }}>
            Có vẻ như bạn chưa chọn được dịch vụ nào cho chuyến đi sắp tới. Hãy khám phá các khách
            sạn, tour du lịch và vé tham quan hấp dẫn của chúng tôi!
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<Explore />}
            onClick={() => navigate("/explore")}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 10,
              textTransform: "none",
              fontSize: "1.1rem",
              boxShadow: 3,
            }}
          >
            Khám phá dịch vụ ngay
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Giỏ hàng của bạn
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {cartData.services.map((service) => (
              <Paper key={service.serviceId} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {service.serviceName}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {service.items.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      mb: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {item.itemName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Đơn giá: {item.price.toLocaleString()}đ | Loại: {item.itemType}
                      </Typography>
                    </Box>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography>{item.quantity}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                      <Typography
                        sx={{
                          minWidth: 80,
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        {item.total.toLocaleString()}đ
                      </Typography>
                      <IconButton color="error" onClick={() => handleRemoveItem(item.id)}>
                        <DeleteOutline />
                      </IconButton>
                    </Stack>
                  </Box>
                ))}

                <Box sx={{ mt: 2, bgcolor: "grey.50", p: 2, borderRadius: 1 }}>
                  <VoucherInput
                    appliedVoucher={appliedVouchers[service.serviceId]}
                    onApply={(code) =>
                      handleApplyVoucher(service.serviceId, code, service.serviceTotal)
                    }
                    onRemove={() => handleRemoveVoucher(service.serviceId)}
                  />
                </Box>
              </Paper>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Tóm tắt thanh toán
            </Typography>
            <Stack spacing={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography>Tạm tính:</Typography>
                <Typography>{checkoutSummary.subTotal.toLocaleString()}đ</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" color="success.main">
                <Typography>Giảm giá:</Typography>
                <Typography>-{checkoutSummary.totalDiscount.toLocaleString()}đ</Typography>
              </Box>
              <Divider />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Tổng cộng:</Typography>
                <Typography variant="h6" color="error">
                  {checkoutSummary.finalTotal.toLocaleString()}đ
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<ShoppingCartCheckout />}
                sx={{ mt: 2 }}
              >
                Thanh toán ngay
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
