import { useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  Stack,
  Alert,
  Snackbar,
} from "@mui/material";
import SocialLoginButtons from "./SocialLoginButtons";
import FormInput from "../FormInput";
import PrimaryButton from "../PrimaryButton";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LoginForm = ({
  onSubmit,
  alert,
  severity,
  loading = false,
  onGoogleLogin,
  onFacebookLogin,
  onXLogin,
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [alertOpen, setAlertOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
    setAlertOpen(true);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      {alertOpen && (
        <Alert
          sx={{ mb: 3 }}
          severity={severity}
          onClose={() => setAlertOpen(false)}
        >
          {alert}
        </Alert>
      )}

      <Typography
        variant="h4"
        component="h1"
        align="center"
        sx={{
          mb: 4,
          fontWeight: 600,
          color: "#black",
        }}
      >
        {t("auth.welcome")}
      </Typography>

      <Stack spacing={3}>
        <FormInput
          name="email"
          label={t("auth.email_username")}
          value={formData.email}
          onChange={handleChange}
        />

        <FormInput
          name="password"
          label={t("auth.password")}
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                size="small"
                sx={{
                  color: "#6b7280",
                  "&.Mui-checked": {
                    color: "#1E9BCD",
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" color="#6b7280">
                {t("auth.remember")}
              </Typography>
            }
          />
          <Link
            component={RouterLink}
            to="/forgot-password"
            variant="body2"
            underline="none"
            sx={{
              color: "#3f4145ff",
              "&:hover": {
                color: "#1E9BCD",
                textDecoration: "underline",
              },
            }}
          >
            {t("auth.forgot")}
          </Link>
        </Box>

        <PrimaryButton
          type="submit"
          loading={loading}
          // loadingText="Logging in..."
        >
          {t("auth.login")}
        </PrimaryButton>

        <SocialLoginButtons
          onGoogleLogin={onGoogleLogin}
          onFacebookLogin={onFacebookLogin}
          onXLogin={onXLogin}
        />

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2, color: "#6b7280" }}
        >
          {t("auth.don't have account")}{" "}
          <Link
            component={RouterLink}
            to="/traveler/signup"
            variant="body2"
            sx={{
              color: "#1E9BCD",
              fontWeight: 500,
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {t("auth.signup")}
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
};

export default LoginForm;
