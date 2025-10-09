import { Button, useTheme } from "@mui/material";

const PrimaryButton = ({
  children,
  loading = false,
  loadingText,
  variant = "contained",
  sx,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Button
      variant={variant}
      disabled={loading || props.disabled}
      sx={{
        py: 1.5,
        borderRadius: "30px",
        backgroundColor: theme.palette.primary.main,
        fontSize: "16px",
        fontWeight: 600,
        textTransform: "none",
        color: theme.palette.text.primary,
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
        "&:disabled": {
          backgroundColor: theme.palette.disabled.main,
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
