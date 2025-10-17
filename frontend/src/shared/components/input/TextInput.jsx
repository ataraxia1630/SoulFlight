import { TextField } from "@mui/material";

const TextInput = ({
  name,
  placeholder,
  label,
  type,
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
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      variant="outlined"
      sx={sx}
      {...props}
    />
  );
};

export default TextInput;
