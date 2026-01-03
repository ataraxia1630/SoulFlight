import { Chip } from "@mui/material";
import { styled } from "@mui/material/styles";

const statusConfig = {
  PENDING: {
    bg: "#FFF7ED", // Cam nhạt
    text: "#C2410C", // Cam đậm
    label: "Chờ thanh toán",
  },
  PAID: {
    bg: "#EFF6FF", // Xanh dương nhạt
    text: "#1D4ED8", // Xanh dương đậm
    label: "Đã thanh toán",
  },
  IN_PROGRESS: {
    bg: "#F0FDF4", // Xanh lá nhạt
    text: "#15803D", // Xanh lá đậm
    label: "Đang diễn ra",
  },
  COMPLETED: {
    bg: "#ECFDF5", // Ngọc bích nhạt
    text: "#047857", // Ngọc bích đậm
    label: "Hoàn thành",
  },
  CANCELLED: {
    bg: "#FEF2F2", // Đỏ nhạt
    text: "#B91C1C", // Đỏ đậm
    label: "Đã hủy",
  },
  REFUNDED: {
    bg: "#F3F4F6", // Xám
    text: "#374151", // Xám đậm
    label: "Hoàn tiền",
  },
};

const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "status",
})(({ status }) => {
  const { bg, text } = statusConfig[status] || {
    bg: "#F3F4F6",
    text: "#6B7280",
  };

  return {
    backgroundColor: bg,
    color: text,
    fontWeight: 600,
    fontSize: "13px",
    height: 28,
    borderRadius: "6px",
    border: `1px solid ${bg}`,
  };
});

export default function BookingStatusChip({ status }) {
  const config = statusConfig[status] || { label: status };
  return <StyledChip label={config.label} status={status} size="small" />;
}
