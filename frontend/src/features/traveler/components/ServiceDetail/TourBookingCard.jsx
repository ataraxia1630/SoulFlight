import { DirectionsBus, Person, Schedule } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import TourService from "@/shared/services/tour.service";
import { voucherAPI } from "@/shared/services/voucher.service";
import { formatCurrency } from "@/shared/utils/formatters";
import toast from "@/shared/utils/toast";
import VoucherInput from "../Cart/VoucherInput";

const TourBookingCard = ({ tour, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState("");
  const [_voucherLoading, setVoucherLoading] = useState(false);
  const navigate = useNavigate();

  const totalPrice = tour.total_price * quantity;
  const isQuantityValid = availability ? availability.available_count >= quantity : true;

  useCallback(() => {
    const checkAvailability = async (qty) => {
      try {
        setCheckingAvailability(true);
        setError(null);
        const result = await TourService.checkAvailability(tour.id, qty);
        setAvailability(result.data.availability);

        if (result.data.available_count < qty) {
          setError(`Chỉ còn ${result.data.available_count} chỗ`);
        }
      } catch (err) {
        setError(err.message || "Không thể kiểm tra chỗ");
        setAvailability(null);
      } finally {
        setCheckingAvailability(false);
      }
    };
    if (quantity > 0) {
      checkAvailability(quantity);
    }
  }, [quantity, tour.id]);

  const handleApplyVoucher = async (code) => {
    setVoucherLoading(true);
    try {
      const result = await voucherAPI.checkVoucher(code, tour.serviceId, totalPrice);
      const discountAmount = totalPrice * (result.discountPercent / 100);
      setAppliedVoucher({
        code,
        discount_percent: result.discountPercent,
        discount_amount: discountAmount,
      });
      toast.success(`Áp dụng thành công! Giảm ${result.discountPercent}%`);
    } catch (err) {
      throw new Error(err.message || "Mã không hợp lệ");
    } finally {
      setVoucherLoading(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher("");
    toast.info("Đã hủy mã giảm giá");
  };

  const finalTotal = appliedVoucher ? totalPrice - appliedVoucher.discount_amount : totalPrice;

  const handleBookNowClick = async () => {
    setActionLoading(true);
    try {
      const result = await TourService.bookTour({
        tourId: tour.id,
        quantity,
        voucherCode: appliedVoucher?.code?.trim() || "",
      });
      toast.success("Tạo booking thành công!");
      navigate(`/checkout?bookingIds=${result.data.id}`);
    } catch (err) {
      toast.error(err.message || "Lỗi khi tạo booking");
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Card sx={{ position: "sticky", top: 100, alignSelf: "start" }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <DirectionsBus color="primary" />
          <Typography variant="h6" noWrap>
            {tour.name}
          </Typography>
        </Box>

        <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
          {formatCurrency(tour.total_price)}
          <Typography component="span" variant="body2" color="text.secondary">
            {" "}
            /người
          </Typography>
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={2.5}>
          <TextField
            fullWidth
            label="Số lượng người"
            type="number"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10) || 1;
              setQuantity(Math.max(1, Math.min(tour.max_participants, val)));
            }}
            inputProps={{ min: 1, max: tour.max_participants }}
          />

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Person fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {tour.max_participants} người tối đa
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Schedule fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {tour.duration_hours} giờ
              </Typography>
            </Box>
          </Box>
        </Stack>

        {checkingAvailability && <LinearProgress sx={{ mt: 2 }} />}

        {availability && !error && !checkingAvailability && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Còn {availability.available_count} chỗ
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {quantity > 0 && (
          <Box>
            <Divider sx={{ my: 3 }} />

            <VoucherInput
              appliedVoucher={appliedVoucher}
              onApply={handleApplyVoucher}
              onRemove={handleRemoveVoucher}
            />

            <Box sx={{ mt: 3 }}>
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Giá mỗi người</Typography>
                  <Typography variant="body2">{formatCurrency(tour.total_price)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Số lượng</Typography>
                  <Typography variant="body2">{quantity} người</Typography>
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
                    Tổng cộng
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatCurrency(finalTotal)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        )}

        <Stack spacing={2} sx={{ mt: 3 }}>
          <LoadingButton
            variant="contained"
            fullWidth
            size="large"
            onClick={handleBookNowClick}
            disabled={!isQuantityValid || checkingAvailability || actionLoading}
            loading={actionLoading}
          >
            Đặt ngay
          </LoadingButton>

          <LoadingButton
            variant="outlined"
            fullWidth
            onClick={() => onAddToCart({ quantity })}
            disabled={!isQuantityValid || checkingAvailability || actionLoading}
          >
            Thêm vào giỏ hàng
          </LoadingButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TourBookingCard;
