import { TextField } from "@mui/material";

const CustomTextField = ({ ...props }) => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      {...props}
    />
  );
};

export default CustomTextField;