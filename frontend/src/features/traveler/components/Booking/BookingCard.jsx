import { Payment, Timer } from "@mui/icons-material";
import { Box, Button, Chip, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate } from "@/shared/utils/formatters";

const BookingCard = ({ booking, getStatusColor }) => {
  const navigate = useNavigate();

  const renderer = ({ minutes, seconds, completed }) => {
    if (completed)
      return (
        <Typography variant="caption" color="error">
          Hết hạn
        </Typography>
      );
    return (
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "error.main" }}>
        <Timer sx={{ fontSize: 14 }} />
        <Typography variant="caption" fontWeight="bold">
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </Typography>
      </Stack>
    );
  };

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        transition: "0.2s",
        "&:hover": { boxShadow: 2, borderColor: "primary.main" },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="subtitle2" color="text.secondary">
            Mã đơn: #{booking.id.slice(-8).toUpperCase()}
          </Typography>
          <Chip
            label={booking.status}
            size="small"
            color={getStatusColor(booking.status)}
            variant="tonal"
          />
          {booking.status === "PENDING" && booking.expiryTime && (
            <Countdown date={new Date(booking.expiryTime)} renderer={renderer} />
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Ngày đặt: {formatDate(booking.createdAt)}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2, borderStyle: "dashed" }} />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h6" color="primary.main" gutterBottom>
            {booking.serviceName}
          </Typography>
          {booking.items.map((item) => (
            <Typography key={item} variant="body2" color="text.secondary">
              • {item.name} x {item.quantity}
            </Typography>
          ))}
        </Grid>
      </Grid>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="grey.50"
        p={1.5}
        borderRadius={1}
      >
        <Box>
          <Typography variant="caption" display="block" color="text.secondary">
            Tổng thanh toán
          </Typography>
          <Typography variant="h6" color="error.main" fontWeight="bold">
            {formatCurrency(booking.finalAmount)}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          {booking.status !== "PENDING" && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/booking/${booking.id}`)}
            >
              Chi tiết
            </Button>
          )}

          {booking.status === "PENDING" && (
            <Button
              variant="contained"
              size="small"
              startIcon={<Payment />}
              onClick={() => navigate(`/checkout?bookingIds=${booking.id}`)}
            >
              Thanh toán ngay
            </Button>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};

export default BookingCard;
