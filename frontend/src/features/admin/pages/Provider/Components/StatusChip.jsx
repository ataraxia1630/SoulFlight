import { Chip } from "@mui/material";
import { styled } from "@mui/material/styles";

const chipConfig = {
  UNVERIFIED: {
    bg: "#FFF3CD",
    text: "#EAB308",
  },
  ACTIVE: {
    bg: "#D1F2F3",
    text: "#1ABFC3",
  },
  LOCKED: {
    bg: "#FCEEEE",
    text: "#EB4335",
  },
  DEFAULT: {
    bg: "#F0F0F0",
    text: "#555555",
  },
};

const CHIP_WIDTH = 120;

const StyledChip = styled(Chip)(({ status }) => {
  const { bg, text } = chipConfig[status] || { bg: "#E5E7EB", text: "#374151" };

  return {
    backgroundColor: bg,
    color: text,
    fontWeight: 600,
    fontSize: "14px",
    letterSpacing: "0.5px",
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
  const displayStatus = status[0].toUpperCase() + status.substring(1).toLowerCase();
  return <StyledChip label={displayStatus} status={status} />;
}

export default StatusChip;
