import { Button } from "@mui/material";

const CustomButton = ({ children, ...props }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      fullWidth
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;