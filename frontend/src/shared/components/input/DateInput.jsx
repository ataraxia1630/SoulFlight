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
  const handleDateChange = (newValue) => {
    onChange(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={handleDateChange}
        format="dd/mm/yyyy"
        slotProps={{
          textField: {
            fullWidth: true,
            name,
            placeholder,
            error,
            helperText,
            variant: "outlined",
            sx,
            InputLabelProps: { shrink: true, ...InputLabelProps },
            ...props,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DateInput;
