import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import BookingStatusChip from "./BookingStatusChip";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Chờ thanh toán" },
  { value: "PAID", label: "Đã thanh toán" },
  { value: "IN_PROGRESS", label: "Đang sử dụng" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "REFUNDED", label: "Đã hoàn tiền" },
];

const TYPE_LABEL = {
  ROOM: "Phòng",
  TOUR: "Tour",
  TICKET: "Vé",
  MENU: "Ẩm thực",
};

export default function DetailDialog({ open, onClose, booking, onUpdateStatus, canEdit = false }) {
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (booking) {
      setStatus(booking.status);
      setNote("");
    }
  }, [booking]);

  const handleUpdate = () => {
    if (status === booking.status) return;
    onUpdateStatus(booking.id, status, note);
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">
              Chi tiết Booking #{booking.id.slice(-6).toUpperCase()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đặt lúc: {dayjs(booking.bookingDate).format("DD/MM/YYYY HH:mm")}
            </Typography>
          </Box>
          <BookingStatusChip status={booking.status} />
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              <Typography>
                <strong>Dịch vụ:</strong> {booking.serviceName}
              </Typography>
              <Typography>
                <strong>Nhà cung cấp:</strong> {booking.providerName}
              </Typography>
              {booking.voucherCode && (
                <Typography color="success.main">
                  <strong>Voucher:</strong> {booking.voucherCode} (-
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(booking.discountAmount)}
                  )
                </Typography>
              )}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              <Typography>
                <strong>Mã thanh toán:</strong>{" "}
                {booking.paymentId?.slice(-8).toUpperCase() || "N/A"}
              </Typography>
              <Typography>
                <Chip
                  label={booking.paymentStatus === "SUCCESS" ? "Đã thanh toán" : "Chưa thanh toán"}
                  color={booking.paymentStatus === "SUCCESS" ? "success" : "warning"}
                  size="small"
                />
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Chi tiết đặt chỗ
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="medium">
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell>
                      <strong>Hạng mục</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Loại</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Ngày sử dụng</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Số lượng</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Đơn giá</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Thành tiền</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {booking.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="center">
                        <Chip label={TYPE_LABEL[item.type] || item.type} size="small" />
                      </TableCell>
                      <TableCell align="center">
                        {item.type === "ROOM" ? (
                          <>
                            {dayjs(item.checkinDate).format("DD/MM")} →{" "}
                            {dayjs(item.checkoutDate).format("DD/MM/YYYY")}
                          </>
                        ) : (
                          dayjs(item.visitDate || item.checkinDate).format("DD/MM/YYYY")
                        )}
                      </TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.unitPrice)}
                      </TableCell>
                      <TableCell align="right">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.totalPrice)}
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow>
                    <TableCell colSpan={5} align="right">
                      <strong>Tổng cộng</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(booking.totalAmount)}
                      </strong>
                    </TableCell>
                  </TableRow>
                  {booking.discountAmount > 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="right" sx={{ color: "success.main" }}>
                        <strong>Giảm giá</strong>
                      </TableCell>
                      <TableCell align="right" sx={{ color: "success.main" }}>
                        <strong>
                          -
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(booking.discountAmount)}
                        </strong>
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell colSpan={5} align="right">
                      <Typography variant="h6" color="error.main">
                        Thực thu
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6" color="error.main" fontWeight={700}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(booking.finalAmount)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {canEdit && (
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Cập nhật trạng thái booking
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <TextField
                  select
                  label="Chọn trạng thái mới"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  size="medium"
                  sx={{ minWidth: 220 }}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Ghi chú (lý do thay đổi, hoàn tiền...)"
                  multiline
                  rows={2}
                  fullWidth
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Khách yêu cầu hủy, hoàn tiền 100%..."
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      {canEdit && (
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose}>Đóng</Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            color="primary"
            disabled={status === booking.status || !status}
          >
            Cập nhật trạng thái
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
