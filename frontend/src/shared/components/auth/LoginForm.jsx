import { useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  Stack,
  Alert,
  useTheme,
} from "@mui/material";
import SocialLoginButtons from "./SocialLoginButtons";
import FormInput from "../FormInput";
import PrimaryButton from "../PrimaryButton";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LoginForm = ({
  onSubmit,
  alert,
  loading = false,
  onGoogleLogin,
  onFacebookLogin,
  onXLogin,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

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
          severity={alert.severity}
          onClose={() => setAlertOpen(false)}
        >
          {alert.message}
        </Alert>
      )}

      <Typography
        variant="h4"
        component="h1"
        align="center"
        sx={{
          mb: 4,
          fontWeight: 600,
          color: theme.palette.text.primary,
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
                  color: theme.palette.text.secondary,
                  "&.Mui-checked": {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" color={theme.palette.text.secondary}>
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
              color: theme.palette.text.tertiary,
              "&:hover": {
                color: theme.palette.primary.main,
                textDecoration: "underline",
              },
            }}
          >
            {t("auth.forgot")}
          </Link>
        </Box>

        <PrimaryButton type="submit" loading={loading}>
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
          sx={{ mt: 2, color: theme.palette.text.secondary }}
        >
          {t("auth.don't have account")}{" "}
          <Link
            component={RouterLink}
            to="/traveler/signup"
            variant="body2"
            sx={{
              color: theme.palette.primary.main,
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
