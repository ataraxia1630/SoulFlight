import { Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import FormInput from "../FormInput";

const OTPInput = ({ length = 5, onComplete, error }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (Number.isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    const otpValue = newOtp.join("");
    if (otpValue.length === length) {
      onComplete(otpValue);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < length) newOtp[i] = char;
    });

    setOtp(newOtp);

    const lastFilledIndex = Math.min(pastedData.length - 1, length - 1);
    inputRefs.current[lastFilledIndex]?.focus();

    if (newOtp.join("").length === length) {
      onComplete(newOtp.join(""));
    }
  };

  return (
    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
      {otp.map((digit, index) => (
        <FormInput
          key={`otp-${index}-${digit}`}
          inputRef={(ref) => {
            inputRefs.current[index] = ref;
          }}
          type="text"
          inputMode="numeric"
          inputProps={{
            maxLength: 1,
            style: { textAlign: "center", fontSize: "20px", fontWeight: 400 },
          }}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          error={error}
          sx={{
            width: "56px",
          }}
        />
      ))}
    </Stack>
  );
};

export default OTPInput;
