import { TextField } from "@mui/material";

const FormInput = ({
  name,
  placeholder,
  label,
  type = "text",
  value,
  onChange,
  error,
  helperText,
  sx,
  ...props
}) => {
  return (
    <TextField
      fullWidth
      name={name}
      type={type}
      placeholder={placeholder}
      label={label || placeholder}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-root": {
          backgroundColor: "#f8f9fa",
          "& fieldset": {
            border: "1px solid #e1e5e9",
          },
          "&:hover fieldset": {
            borderColor: "#2f9ecaff",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#1E9BCD",
          },
          "&.Mui-error fieldset": {
            borderColor: "#ef4444",
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default FormInput;
