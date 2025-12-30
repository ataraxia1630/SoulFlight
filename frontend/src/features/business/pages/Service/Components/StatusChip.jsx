import { Chip } from "@mui/material";
import { styled } from "@mui/material/styles";

const chipConfig = {
  AVAILABLE: {
    bg: "#E6F7F7",
    text: "#0EA5A8",
    label: "Hoạt động",
  },
  UNAVAILABLE: {
    bg: "#FFF4E5",
    text: "#F59E0B",
    label: "Tạm ngưng",
  },
  NO_LONGER_PROVIDED: {
    bg: "#F3F4F6",
    text: "#6B7280",
    label: "Ngưng",
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
