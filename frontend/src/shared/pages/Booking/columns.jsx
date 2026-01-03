import { Box, Chip, Typography } from "@mui/material";
import dayjs from "dayjs";
import BookingStatusChip from "./components/BookingStatusChip";

export const columns = [
  {
    id: "index",
    label: "STT",
    width: "8%",
    header_align: "center",
    cell_align: "center",
    render: (_, __, index) => index + 1,
  },
  {
    id: "id",
    label: "BOOKING",
    width: "10%",
    header_align: "left",
    cell_align: "left",
    render: (value) => (
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {value.toString().slice(-6).toUpperCase()}
      </Typography>
    ),
  },
  {
    id: "bookingDate",
    label: "NGÀY ĐẶT",
    width: "12%",
    header_align: "center",
    cell_align: "center",
    render: (value) => (
      <Typography variant="body2">
        {dayjs(value).format("DD/MM/YYYY")}
        <br />
        <Typography variant="caption" color="text.secondary">
          {dayjs(value).format("HH:mm")}
        </Typography>
      </Typography>
    ),
  },
  {
    id: "serviceName",
    label: "DỊCH VỤ",
    width: "18%",
    header_align: "left",
    cell_align: "left",
    render: (value, row) => (
      <Box>
        <Typography variant="body2" fontWeight={600} color="primary.main">
          {value}
        </Typography>
        {row.items?.[0] && (
          <Typography variant="caption" color="text.secondary">
            {row.items[0].name} × {row.items[0].quantity}
          </Typography>
        )}
      </Box>
    ),
  },
  {
    id: "items",
    label: "NGÀY SỬ DỤNG",
    width: "14%",
    header_align: "center",
    cell_align: "center",
    render: (_, row) => {
      const item = row.items?.[0];
      if (!item) return "-";

      if (item.type === "ROOM") {
        return (
          <Box textAlign="center">
            <Typography variant="body2">{dayjs(item.checkinDate).format("DD/MM")}</Typography>
            <Typography variant="caption">→</Typography>
            <Typography variant="body2">{dayjs(item.checkoutDate).format("DD/MM/YYYY")}</Typography>
          </Box>
        );
      }
      return dayjs(item.visitDate || item.checkinDate).format("DD/MM/YYYY");
    },
  },
  {
    id: "finalAmount",
    label: "THỰC THU",
    width: "12%",
    header_align: "center",
    cell_align: "right",
    render: (value) => (
      <Typography variant="body2" fontWeight={700} color="error.main">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(value)}
      </Typography>
    ),
  },
  {
    id: "paymentStatus",
    label: "THANH TOÁN",
    width: "10%",
    header_align: "center",
    cell_align: "center",
    render: (value) => (
      <Chip
        label={value === "SUCCESS" ? "Thành công" : "Chưa thanh toán"}
        color={value === "SUCCESS" ? "success" : "warning"}
        size="small"
        variant="outlined"
      />
    ),
  },
  {
    id: "status",
    label: "TRẠNG THÁI",
    width: "12%",
    header_align: "center",
    cell_align: "center",
    render: (value) => <BookingStatusChip status={value} />,
  },
  {
    id: "actions",
    label: "HÀNH ĐỘNG",
    width: "10%",
    header_align: "center",
    cell_align: "center",
  },
];
