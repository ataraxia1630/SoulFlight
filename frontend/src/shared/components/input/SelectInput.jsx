import { MenuItem, TextField } from "@mui/material";

const SelectInput = ({
  name,
  placeholder,
  label,
  value,
  onChange,
  error,
  helperText,
  sx,
  options = [],
  ...props
}) => {
  return (
    <TextField
      select
      fullWidth
      name={name}
      placeholder={placeholder}
      label={label}
      value={value || ""}
      onChange={onChange}
      error={error}
      helperText={helperText}
      variant="outlined"
      sx={sx}
      {...props}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectInput;
