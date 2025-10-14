import { useTheme } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const DateInput = ({
  name,
  placeholder,
  label,
  value,
  onChange,
  error,
  helperText,
  sx,
  InputLabelProps,
  ...props
}) => {
  const theme = useTheme();
  const handleDateChange = (newValue) => {
    onChange(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={handleDateChange}
        format="DD/MM/YYYY"
        sx={{
          "& .MuiPickersOutlinedInput-root": {
            backgroundColor: theme.palette.background.input,
            "& fieldset": {
              borderColor: `${theme.palette.border.light} !important`,
            },
            "&:hover fieldset": {
              borderColor: `${theme.palette.primary.light} !important`,
            },
            "&.Mui-focused fieldset": {
              borderColor: `${theme.palette.primary.main} !important`,
            },
            "&.Mui-error fieldset": {
              borderColor: `${theme.palette.error.main} !important`,
            },
          },
          ...sx,
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            name,
            placeholder,
            error,
            helperText,
            variant: "outlined",
            InputLabelProps: { ...InputLabelProps },
            ...props,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DateInput;
