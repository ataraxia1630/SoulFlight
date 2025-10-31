import { Chip } from "@mui/material";
import { styled } from "@mui/material/styles";

const chipConfig = {
  Pending: {
    bg: "#FFF3CD",
    text: "#EAB308",
  },
  Approved: {
    bg: "#D1F2F3",
    text: "#1ABFC3",
  },
  Rejected: {
    bg: "#FCEEEE",
    text: "#EB4335",
  },
  Info_Required: {
    bg: "#F3EFFF",
    text: "#4F46E5",
  },
  Default: {
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
  const displayStatus = status === "Info_Required" ? "Info Required" : status;
  return <StyledChip label={displayStatus} status={status} />;
}

export default StatusChip;
