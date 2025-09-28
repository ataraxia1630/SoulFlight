import React from "react";
import { Button, CircularProgress } from "@mui/material";

const PrimaryButton = ({
  children,
  loading = false,
  loadingText,
  variant = "contained",
  sx,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      disabled={loading || props.disabled}
      sx={{
        py: 1.5,
        borderRadius: "30px",
        backgroundColor: "#1E9BCD",
        fontSize: "16px",
        fontWeight: 600,
        textTransform: "none",
        color: "black",
        "&:hover": {
          backgroundColor: "#0284c7",
        },
        "&:disabled": {
          backgroundColor: "#94a3b8",
        },
        ...sx,
      }}
      {...props}
    >
      {loading ? loadingText || children : children}
    </Button>
  );
};

export default PrimaryButton;
