import { useTheme } from "@mui/material";
import DateInput from "./input/DateInput";
import SelectInput from "./input/SelectInput";
import TextInput from "./input/TextInput";

const inputComponents = {
  text: TextInput,
  date: DateInput,
  select: SelectInput,
};

const FormInput = ({
  type = "text",
  name,
  placeholder,
  label,
  value,
  onChange,
  error,
  helperText,
  sx,
  ...props
}) => {
  const theme = useTheme();

  const InputComponent = inputComponents[type] || TextInput;

  return (
    <InputComponent
      type={type}
      name={name}
      placeholder={placeholder}
      label={label || placeholder}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
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
