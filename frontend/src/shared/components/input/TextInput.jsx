import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

const TextInput = ({
  name,
  placeholder,
  label,
  type = "text",
  value: propValue,
  onChange: propOnChange,
  error: propError,
  helperText: propHelperText,
  sx,
  disabled,
  ...props
}) => {
  const context = useFormContext();
  const isInForm = !!context;

  const register = isInForm ? context.register : null;
  const formState = isInForm ? context.formState : null;
  const setValue = isInForm ? context.setValue : null;
  const watch = isInForm ? context.watch : null;

  const errors = formState?.errors || {};
  const fieldError = name ? errors[name] : null;

  const formValue = isInForm && name && watch ? watch(name) : undefined;
  const [localValue, setLocalValue] = useState(propValue || "");

  useEffect(() => {
    if (!isInForm && propValue !== undefined) {
      setLocalValue(propValue);
    }
  }, [propValue, isInForm]);

  const handleChange = (e) => {
    const value = e.target.value;

    if (isInForm && name && setValue) {
      setValue(name, value, { shouldValidate: true });
    }

    if (propOnChange) {
      propOnChange(e);
    }

    if (!isInForm) {
      setLocalValue(value);
    }
  };

  const finalValue = isInForm ? (formValue ?? "") : localValue;

  const hasError = isInForm ? !!fieldError : !!propError;
  const helperText = isInForm ? fieldError?.message || propHelperText : propHelperText;

  return (
    <TextField
      {...(isInForm && name && register ? register(name) : {})}
      fullWidth
      name={name}
      type={type}
      placeholder={placeholder}
      label={label}
      value={finalValue}
      onChange={handleChange}
      error={hasError}
      helperText={helperText}
      variant="outlined"
      disabled={disabled}
      sx={sx}
      {...props}
    />
  );
};

export default TextInput;
