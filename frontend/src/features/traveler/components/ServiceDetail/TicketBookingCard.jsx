import { AccessTime, ConfirmationNumber, LocationOn } from "@mui/icons-material";
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
import TicketService from "@/shared/services/ticket.service";
import { voucherAPI } from "@/shared/services/voucher.service";
import { formatCurrency } from "@/shared/utils/formatters";
import toast from "@/shared/utils/toast";
import VoucherInput from "../Cart/VoucherInput";

const TicketBookingCard = ({ ticket, onAddToCart }) => {
  const [visitDate, setVisitDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [availability, setAvailability] = useState({
    available_count: 0,
  });
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [_voucherLoading, setVoucherLoading] = useState(false);
  const navigate = useNavigate();

  const totalPrice = ticket.price * quantity;
  const isValidDate = !!visitDate;
  const isQuantityValid = availability ? availability.available_count >= quantity : true;

  useCallback(() => {
    const checkAvailability = async (date, qty) => {
      try {
        setCheckingAvailability(true);
        setError(null);
        const result = await TicketService.checkAvailability(ticket.id, date, qty);
        setAvailability(
          result.data.availability || {
            available_count: 0,
            reason: result.data.reason,
          },
        );

        if (result.data.available_count < qty) {
          setError(`Chỉ còn ${result.data.available_count} vé`);
        }
      } catch (err) {
        setError(err.message || "Không thể kiểm tra vé");
        setAvailability(null);
      } finally {
        setCheckingAvailability(false);
      }
    };

    if (isValidDate && quantity > 0) {
      checkAvailability(visitDate, quantity);
    }
  }, [visitDate, quantity, isValidDate, ticket.id]);

  const handleApplyVoucher = async (code) => {
    setVoucherLoading(true);
    try {
      const result = await voucherAPI.checkVoucher(code, ticket.serviceId, totalPrice);
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
    setAppliedVoucher(null);
    toast.info("Đã hủy mã giảm giá");
  };

  const finalTotal = appliedVoucher ? totalPrice - appliedVoucher.discount_amount : totalPrice;

  const handleAddToCartClick = async () => {
    setActionLoading(true);
    try {
      await onAddToCart({ visitDate, quantity });
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
      const result = await TicketService.bookTicket({
        ticketId: ticket.id,
        visitDate,
        quantity,
        voucherCode: appliedVoucher?.code || null,
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
          <ConfirmationNumber color="primary" />
          <Typography variant="h6" noWrap>
            {ticket.name}
          </Typography>
        </Box>

        <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
          {formatCurrency(ticket.price)}
          <Typography component="span" variant="body2" color="text.secondary">
            {" "}
            /vé
          </Typography>
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={2.5}>
          <TextField
            fullWidth
            label="Ngày tham quan"
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: new Date().toISOString().split("T")[0] }}
          />

          <TextField
            fullWidth
            label={`Số lượng vé (tối đa ${availability.available_count})`}
            type="number"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10) || 1;
              setQuantity(Math.max(1, Math.min(availability.available_count, val)));
            }}
            inputProps={{ min: 1, max: availability.available_count }}
            disabled={availability.available_count === 0}
          />

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <LocationOn fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {ticket.place?.name}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <AccessTime fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {ticket.duration} giờ
              </Typography>
            </Box>
          </Box>
        </Stack>

        {checkingAvailability && <LinearProgress sx={{ mt: 2 }} />}

        {availability && !error && !checkingAvailability && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Còn {availability.available_count} vé
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {isValidDate && (
          <>
            <Divider sx={{ my: 3 }} />

            <VoucherInput
              appliedVoucher={appliedVoucher}
              onApply={handleApplyVoucher}
              onRemove={handleRemoveVoucher}
            />

            <Box sx={{ mt: 3 }}>
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Giá mỗi vé</Typography>
                  <Typography variant="body2">{formatCurrency(ticket.price)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Số lượng</Typography>
                  <Typography variant="body2">{quantity} vé</Typography>
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
          </>
        )}

        <Stack spacing={2} sx={{ mt: 3 }}>
          <LoadingButton
            variant="contained"
            fullWidth
            size="large"
            onClick={handleBookNowClick}
            disabled={!isValidDate || !isQuantityValid || checkingAvailability || actionLoading}
            loading={actionLoading}
          >
            Đặt ngay
          </LoadingButton>

          <LoadingButton
            variant="outlined"
            fullWidth
            onClick={handleAddToCartClick}
            disabled={!isValidDate || !isQuantityValid || checkingAvailability || actionLoading}
            loading={actionLoading}
          >
            Thêm vào giỏ hàng
          </LoadingButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TicketBookingCard;
