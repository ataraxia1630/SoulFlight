import { Chip } from "@mui/material";
import { styled } from "@mui/material/styles";

const chipConfig = {
  UNVERIFIED: {
    bg: "#FFF3CD",
    text: "#EAB308",
    label: "Chưa xác minh",
  },
  ACTIVE: {
    bg: "#D1F2F3",
    text: "#1ABFC3",
    label: "Hoạt động",
  },
  LOCKED: {
    bg: "#FCEEEE",
    text: "#EB4335",
    label: "Đã khóa",
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
  const { label } = chipConfig[status] || chipConfig.DEFAULT;

  return <StyledChip label={label} status={status} />;
}

export default StatusChip;
