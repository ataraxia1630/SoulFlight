import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import FormInput from "../FormInput";
import PrimaryButton from "../PrimaryButton";
import BackLogin from "./BackLoginLink";
import SocialLoginButtons from "./SocialLoginButtons";

const SignupForm = ({
  userType,
  onSubmit,
  loading = false,
  onGoogleLogin,
  onFacebookLogin,
  onXLogin,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
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
        {t("auth.join")}
      </Typography>

      <Stack spacing={3}>
        <FormInput
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <PrimaryButton type="submit" loading={loading}>
          {t("auth.signup")}
        </PrimaryButton>

        {userType === "traveler" && (
          <SocialLoginButtons
            onGoogleLogin={onGoogleLogin}
            onFacebookLogin={onFacebookLogin}
            onXLogin={onXLogin}
          />
        )}

        <PrimaryButton
          component={RouterLink}
          to={userType === "traveler" ? "/business/signup" : "/traveler/signup"}
          sx={{
            backgroundColor: theme.palette.primary.darker,
            color: theme.palette.text.contrast,
            "&:hover": { backgroundColor: theme.palette.primary.darkest },
          }}
        >
          {userType === "traveler" ? t("auth.signup for business") : t("auth.signup for traveler")}
        </PrimaryButton>

        <BackLogin />
      </Stack>
    </Box>
  );
};

export default SignupForm;
