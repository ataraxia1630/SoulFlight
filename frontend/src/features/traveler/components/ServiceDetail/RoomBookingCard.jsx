import { Bed, Hotel, Person } from "@mui/icons-material";
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
import { calculateNights, formatCurrency } from "@/shared/utils/formatters";
import RoomService from "../../../../shared/services/room.service";
import { voucherAPI } from "../../../../shared/services/voucher.service";
import toast from "../../../../shared/utils/toast";
import VoucherInput from "../Cart/VoucherInput";

const RoomBookingCard = ({ room, onAddToCart }) => {
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState("");
  const [_voucherLoading, setVoucherLoading] = useState(false);
  const navigate = useNavigate();

  const nights = checkinDate && checkoutDate ? calculateNights(checkinDate, checkoutDate) : 0;
  const totalPrice = room.price_per_night * nights * quantity;
  const isValidDates = checkinDate && checkoutDate && nights > 0;
  const isQuantityValid = availability ? availability.available_count >= quantity : true;

  const minCheckout = checkinDate
    ? new Date(new Date(checkinDate).getTime() + 86400000).toISOString().split("T")[0]
    : "";

  const handleRemoveVoucher = () => {
    setAppliedVoucher("");
    toast.info("Đã hủy mã giảm giá");
  };

  useCallback(() => {
    const checkAvailability = async (checkin, checkout) => {
      if (!checkin || !checkout) return;
      try {
        setCheckingAvailability(true);
        setError(null);
        const result = await RoomService.checkAvailability(room.id, checkin, checkout);
        setAvailability(result.data.availability);

        if (result.data.available_count < quantity) {
          setError(`Chỉ còn ${result.data.available_count} phòng trống`);
        }
      } catch (_err) {
        setError("Không thể kiểm tra tình trạng phòng. Vui lòng thử lại.");
        setAvailability(null);
      } finally {
        setCheckingAvailability(false);
      }
    };

    if (isValidDates) {
      checkAvailability(checkinDate, checkoutDate);
    } else {
      setAvailability(null);
      setError(null);
    }
  }, [checkinDate, checkoutDate, isValidDates, quantity, room.id]);

  const handleApplyVoucher = async (code) => {
    setVoucherLoading(true);
    try {
      const voucher = await voucherAPI.checkVoucher(code, room.service_id, totalPrice);
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

  const finalTotal = appliedVoucher ? totalPrice - appliedVoucher.discount_amount : totalPrice;

  const handleBookNowClick = async () => {
    setActionLoading(true);
    try {
      const result = await RoomService.bookRoom({
        roomId: room.id,
        checkinDate,
        checkoutDate,
        quantity,
        voucherCode: appliedVoucher?.code?.trim() || "",
      });
      toast.success("Tạo booking thành công!");
      navigate(`/checkout?bookingIds=${result.data.booking.id}`);
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
          <Hotel color="primary" />
          <Typography variant="h6" noWrap>
            {room.name}
          </Typography>
        </Box>

        <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
          {formatCurrency(room.price_per_night)}
          <Typography component="span" variant="body2" color="text.secondary">
            {" "}
            /đêm
          </Typography>
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={2.5}>
          <TextField
            fullWidth
            label="Ngày nhận phòng"
            type="date"
            value={checkinDate}
            onChange={(e) => {
              setCheckinDate(e.target.value);
              if (checkoutDate && e.target.value >= checkoutDate) {
                setCheckoutDate("");
              }
            }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: new Date().toISOString().split("T")[0] }}
          />

          <TextField
            fullWidth
            label="Ngày trả phòng"
            type="date"
            value={checkoutDate}
            onChange={(e) => setCheckoutDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: minCheckout }}
            disabled={!checkinDate}
          />

          <TextField
            fullWidth
            label={`Số lượng phòng (tối đa ${room.total_rooms})`}
            type="number"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10) || 1;
              setQuantity(Math.max(1, Math.min(room.total_rooms, val)));
            }}
            inputProps={{ min: 1, max: room.total_rooms }}
          />

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Person fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {room.max_adult_number} người lớn
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Person fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {room.max_children_number} trẻ em
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Bed fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {room.bed_number} giường
              </Typography>
            </Box>
          </Box>
        </Stack>

        {checkingAvailability && <LinearProgress sx={{ mt: 2 }} />}

        {availability && !error && !checkingAvailability && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Còn {availability.available_count} phòng trống
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Divider sx={{ my: 3 }} />

        <VoucherInput
          appliedVoucher={appliedVoucher}
          onApply={handleApplyVoucher}
          onRemove={handleRemoveVoucher}
        />

        {isValidDates && (
          <Box>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Giá mỗi đêm</Typography>
                  <Typography variant="body2">{formatCurrency(room.price_per_night)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Số đêm</Typography>
                  <Typography variant="body2">{nights} đêm</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Số phòng</Typography>
                  <Typography variant="body2">{quantity} phòng</Typography>
                </Box>
                <Divider sx={{ my: 1.5 }} />
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
            </Box>
          </Box>
        )}

        <Stack spacing={2} sx={{ mt: 3 }}>
          <LoadingButton
            variant="contained"
            fullWidth
            size="large"
            onClick={handleBookNowClick}
            disabled={!isValidDates || !isQuantityValid || checkingAvailability || actionLoading}
            loading={actionLoading}
          >
            Đặt ngay
          </LoadingButton>

          <LoadingButton
            variant="outlined"
            fullWidth
            onClick={() =>
              onAddToCart({
                checkinDate,
                checkoutDate,
                quantity,
              })
            }
            disabled={!isValidDates || !isQuantityValid || checkingAvailability || actionLoading}
          >
            Thêm vào giỏ hàng
          </LoadingButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RoomBookingCard;
