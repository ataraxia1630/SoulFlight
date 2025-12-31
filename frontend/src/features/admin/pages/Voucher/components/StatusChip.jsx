import { Chip } from "@mui/material";
import { styled } from "@mui/material/styles";

const chipConfig = {
  active: {
    bg: "#E6F7F7",
    text: "#0EA5A8",
    label: "Hoạt động",
  },
  upcoming: {
    bg: "#FFF4E5",
    text: "#F59E0B",
    label: "Sắp tới",
  },
  expired: {
    bg: "#F3F4F6",
    text: "#6B7280",
    label: "Hết hạn",
  },
  exhausted: {
    bg: "#FEE2E2",
    text: "#DC2626",
    label: "Đã dùng hết",
  },
};

const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "status",
})(({ status }) => {
  const { bg, text } = chipConfig[status] || {
    bg: "#F3F4F6",
    text: "#6B7280",
  };

  return {
    backgroundColor: bg,
    color: text,
    fontWeight: 600,
    fontSize: "14px",
    letterSpacing: "0.3px",
    height: 32,

    width: "fit-content",

    borderRadius: "4px",

    "& .MuiChip-label": {
      paddingLeft: 12,
      paddingRight: 12,
      display: "block",
    },
  };
});

function StatusChip({ status }) {
  const { label } = chipConfig[status] || { label: "Không xác định" };
  return <StyledChip label={label} status={status} />;
}

export default StatusChip;
