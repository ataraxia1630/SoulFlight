import { Chip } from "@mui/material";
import { styled } from "@mui/material/styles";

const chipConfig = {
  PENDING: {
    bg: "#FFF3CD",
    text: "#EAB308",
    label: "Chờ xử lý",
  },
  RESOLVED: {
    bg: "#D1F2F3",
    text: "#1ABFC3",
    label: "Đã xử lý",
  },
  REJECTED: {
    bg: "#FCEEEE",
    text: "#EB4335",
    label: "Đã từ chối",
  },

  DEFAULT: {
    bg: "#F0F0F0",
    text: "#555555",
    label: "Không xác định",
  },
};

const CHIP_WIDTH = 120;

const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "status",
})(({ status }) => {
  const { bg, text } = chipConfig[status] || chipConfig.DEFAULT;

  return {
    backgroundColor: bg,
    color: text,
    fontWeight: 600,
    fontSize: "14px",
    letterSpacing: "0.3px",
    height: 32,
    minWidth: CHIP_WIDTH,
    maxWidth: CHIP_WIDTH,
    borderRadius: "4px",
    "& .MuiChip-label": {
      paddingLeft: 8,
      paddingRight: 8,
    },
  };
});

function StatusChip({ status }) {
  const config = chipConfig[status] || chipConfig.DEFAULT;
  return <StyledChip label={config.label} status={status} />;
}

export default StatusChip;
