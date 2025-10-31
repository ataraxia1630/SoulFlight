import { Chip } from "@mui/material";
import { styled } from "@mui/material/styles";

const chipColors = {
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
    text: "#8E4FFF",
  },
  Default: {
    bg: "#F0F0F0",
    text: "#555555",
  },
};

const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "statusType",
})(({ statusType }) => {
  const colors = chipColors[statusType] || chipColors.Default;
  return {
    backgroundColor: colors.bg,
    color: colors.text,
    fontWeight: "bold",
    borderRadius: "8px",
    padding: "2px 4px",
    height: "28px",
  };
});

function StatusChip({ status }) {
  return <StyledChip label={status} statusType={status} />;
}

export default StatusChip;
