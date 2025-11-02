import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

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
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <TextField
      {...register(name)}
      fullWidth
      name={name}
      type={type}
      placeholder={placeholder}
      label={label}
      value={value}
      onChange={onChange}
      error={!!errors[name] || error}
      helperText={errors[name]?.message || helperText}
      variant="outlined"
      sx={sx}
      {...props}
    />
  );
};

export default TextInput;
