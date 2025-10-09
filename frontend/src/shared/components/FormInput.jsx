import { TextField, useTheme } from "@mui/material";

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
  const theme = useTheme();

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
          backgroundColor: theme.palette.background.input,
          "& fieldset": {
            border: `1px solid ${theme.palette.border.light}`,
          },
          "&:hover fieldset": {
            borderColor: theme.palette.primary.light,
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.main,
          },
          "&.Mui-error fieldset": {
            borderColor: theme.palette.error.main,
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default FormInput;
