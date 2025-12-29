import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { voucherAPI } from "@/shared/services/voucher.service";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";
import toast from "@/shared/utils/toast";
import VoucherInput from "../Cart/VoucherInput";

const OrderSummary = ({ bookings = [] }) => {
  const [appliedVouchers, setAppliedVouchers] = useState({}); // { serviceId: { code, discount_percent, discount_amount } }
  const [expandedGroups, setExpandedGroups] = useState({});

  // Group bookings by service_id (fallback to serviceName nếu không có id)
  const groupedBookings = bookings.reduce((acc, booking) => {
    const serviceId = booking.serviceId || "unknown";
    const serviceName = booking.serviceName || "Dịch vụ";

    if (!acc[serviceId]) {
      acc[serviceId] = {
        serviceId,
        serviceName,
        image: booking.items?.[0]?.image || null,
        bookings: [],
      };
    }
    acc[serviceId].bookings.push(booking);
    return acc;
  }, {});

  const groups = Object.values(groupedBookings);

  // Tính giá cho từng group
  const calculateGroupSubtotal = (groupBookings) => {
    return groupBookings.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
  };

  const calculateGroupDiscount = (groupBookings, serviceId) => {
    const voucher = appliedVouchers[serviceId];
    if (voucher) {
      const subtotal = calculateGroupSubtotal(groupBookings);
      return subtotal * (voucher.discount_percent / 100);
    }
    return groupBookings.reduce((sum, b) => sum + Number(b.discountAmount || 0), 0);
  };

  // Tổng toàn đơn
  const totalSubtotal = groups.reduce(
    (sum, group) => sum + calculateGroupSubtotal(group.bookings),
    0,
  );
  const totalDiscount = groups.reduce(
    (sum, group) => sum + calculateGroupDiscount(group.bookings, group.serviceId),
    0,
  );
  const finalTotal = totalSubtotal - totalDiscount;

  // Handle voucher apply/remove
  const handleApplyVoucher = async (code, serviceId) => {
    try {
      const group = groups.find((g) => g.serviceId === serviceId);
      if (!group) throw new Error("Không tìm thấy dịch vụ");

      const groupSubtotal = calculateGroupSubtotal(group.bookings);

      const result = await voucherAPI.checkVoucher(code, serviceId, groupSubtotal);

      const discountAmount = groupSubtotal * (result.data.discount_percent / 100);

      setAppliedVouchers((prev) => ({
        ...prev,
        [serviceId]: {
          code,
          discount_percent: result.data.discount_percent,
          discount_amount: discountAmount,
        },
      }));

      toast.success(`Áp dụng mã ${code} thành công cho ${group.serviceName}!`);
    } catch (err) {
      throw new Error(err.message || "Mã voucher không hợp lệ cho dịch vụ này");
    }
  };

  const handleRemoveVoucher = (serviceId) => {
    setAppliedVouchers((prev) => {
      const newState = { ...prev };
      delete newState[serviceId];
      return newState;
    });
    const group = groups.find((g) => g.serviceId === serviceId);
    toast.info(`Đã hủy mã giảm giá cho ${group?.serviceName || "dịch vụ"}`);
  };

  const toggleExpand = (serviceId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  return (
    <Card sx={{ position: "sticky", top: 20 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Chi tiết đơn hàng ({bookings.length} đặt chỗ)
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={3}>
          {groups.map((group) => {
            const groupSubtotal = calculateGroupSubtotal(group.bookings);
            const groupDiscount = calculateGroupDiscount(group.bookings, group.serviceId);
            const voucher = appliedVouchers[group.serviceId];

            return (
              <Paper variant="outlined" sx={{ p: 3 }} key={group.serviceId}>
                {/* Header group */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box display="flex" gap={2} alignItems="center">
                    <CardMedia
                      component="img"
                      image={group.image || "https://via.placeholder.com/60"}
                      alt={group.serviceName}
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        objectFit: "cover",
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {group.serviceName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {group.bookings.length} đặt chỗ
                      </Typography>
                    </Box>
                  </Box>

                  <IconButton onClick={() => toggleExpand(group.serviceId)}>
                    {expandedGroups[group.serviceId] ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>

                {/* Chi tiết các booking trong group */}
                <Collapse in={expandedGroups[group.serviceId] !== false}>
                  <Stack spacing={1.5} sx={{ ml: 8, mb: 2 }}>
                    {group.bookings.map((booking, idx) => {
                      const item = booking.items?.[0] || {};
                      return (
                        <Box key={booking.id}>
                          <Typography variant="body2" fontWeight="medium">
                            {idx + 1}. {item.name || "Dịch vụ"}
                          </Typography>
                          {item.checkinDate && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              {formatDate(item.checkinDate)} → {formatDate(item.checkoutDate)}
                            </Typography>
                          )}
                          {item.visitDate && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              Ngày sử dụng: {formatDate(item.visitDate)}
                            </Typography>
                          )}
                          <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                            {formatCurrency(booking.totalAmount || 0)}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                </Collapse>

                {/* Voucher cho service này */}
                <Box sx={{ mt: 2 }}>
                  {voucher ? (
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "success.light",
                        borderRadius: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" color="success.dark" fontWeight="medium">
                          ✓ Đã áp dụng: {voucher.code}
                        </Typography>
                        <Typography variant="caption" color="success.dark">
                          Giảm {voucher.discount_percent}% → -
                          {formatCurrency(voucher.discount_amount)}
                        </Typography>
                      </Box>
                      <Button size="small" onClick={() => handleRemoveVoucher(group.serviceId)}>
                        Hủy
                      </Button>
                    </Box>
                  ) : (
                    <VoucherInput
                      appliedVoucher={null}
                      onApply={(code) => handleApplyVoucher(code, group.serviceId)}
                      onRemove={() => handleRemoveVoucher(group.serviceId)}
                      placeholder={`Mã giảm giá cho ${group.serviceName}`}
                    />
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Tổng nhóm */}
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Tạm tính</Typography>
                    <Typography variant="body2">{formatCurrency(groupSubtotal)}</Typography>
                  </Box>
                  {groupDiscount > 0 && (
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="success.main">
                        Giảm giá
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        -{formatCurrency(groupDiscount)}
                      </Typography>
                    </Box>
                  )}
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle1" fontWeight="bold">
                      Tổng nhóm
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      {formatCurrency(groupSubtotal - groupDiscount)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            );
          })}
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Tổng cuối cùng */}
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Tạm tính</Typography>
            <Typography variant="h6">{formatCurrency(totalSubtotal)}</Typography>
          </Box>

          {totalDiscount > 0 && (
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6" color="success.main">
                Tổng giảm giá
              </Typography>
              <Typography variant="h6" color="success.main">
                -{formatCurrency(totalDiscount)}
              </Typography>
            </Box>
          )}

          <Divider sx={{ borderStyle: "dashed", borderWidth: 2 }} />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold">
              Thành tiền
            </Typography>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {formatCurrency(finalTotal)}
            </Typography>
          </Box>

          {totalDiscount > 0 && (
            <Box
              sx={{
                p: 2,
                bgcolor: "success.light",
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="body1" color="success.dark" fontWeight="medium">
                🎉 Bạn đã tiết kiệm {formatCurrency(totalDiscount)}!
              </Typography>
            </Box>
          )}
        </Stack>

        <Box sx={{ mt: 3, p: 2, bgcolor: "#f0f7ff", borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            ✓ Xác nhận ngay lập tức
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            ✓ Hỗ trợ 24/7
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            ✓ Đảm bảo giá tốt nhất
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
