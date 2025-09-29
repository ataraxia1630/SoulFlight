import { useState } from "react";
import { Box, Typography, Stack, Link } from "@mui/material";
import OTPInput from "./OTPInput";
import SocialLoginButtons from "./SocialLoginButtons";
import BackLogin from "./BackLoginLink";
import PrimaryButton from "../PrimaryButton";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const VerifyOTPForm = ({
  userType,
  onSubmit,
  loading = false,
  onGoogleLogin,
  onFacebookLogin,
  onXLogin,
}) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleOTPComplete = (otpValue) => {
    setOtp(otpValue);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otp.length !== 5) {
      setError("Please enter complete OTP");
      return;
    }

    onSubmit?.({ otp, email });
  };

  const handleResendOTP = () => {
    console.log("Resending OTP to:", email);
    setOtp("");
    setError("");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Typography
        variant="h4"
        component="h1"
        align="center"
        sx={{
          mb: 1,
          fontWeight: 600,
          color: "text.primary",
        }}
      >
        {t("auth.enter otp")}
      </Typography>

      <Typography
        variant="body2"
        align="center"
        sx={{
          mb: 4,
          color: "gray",
        }}
      >
        {t("auth.sent otp")} {email || t("auth.your email")}
      </Typography>

      <Stack spacing={3}>
        <OTPInput length={5} onComplete={handleOTPComplete} error={!!error} />

        {error && (
          <Typography
            variant="body2"
            color="error"
            align="center"
            sx={{ mt: -1 }}
          >
            {error}
          </Typography>
        )}

        <Typography
          variant="body2"
          align="center"
          sx={{
            mt: 2,
            color: "#6b7280",
            display: "flex",
            justifyContent: "center",
            gap: 0.5,
          }}
        >
          <Box component="span">{t("auth.didn't receive otp")}</Box>
          <Link
            component="button"
            type="button"
            onClick={handleResendOTP}
            variant="body2"
            sx={{
              color: "#1E9BCD",
              fontWeight: 500,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {t("auth.resend")}
          </Link>
        </Typography>

        <PrimaryButton type="submit" disabled={loading || otp.length !== 5}>
          {loading ? t("auth.verifying") : t("auth.next")}
        </PrimaryButton>

        {userType === "traveler" && (
          <SocialLoginButtons
            onGoogleLogin={onGoogleLogin}
            onFacebookLogin={onFacebookLogin}
            onXLogin={onXLogin}
          />
        )}

        <BackLogin />
      </Stack>
    </Box>
  );
};

export default VerifyOTPForm;
