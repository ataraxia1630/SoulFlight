import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FormInput from "../FormInput";
import PrimaryButton from "../PrimaryButton";
import BackLogin from "./BackLoginLink";
import SocialLoginButtons from "./SocialLoginButtons";

const CreateAccountForm = ({
  userType,
  onSubmit,
  loading = false,
  onGoogleLogin,
  onFacebookLogin,
  onXLogin,
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
          color: "#black",
        }}
      >
        {t("auth.create account")}
      </Typography>

      <Stack spacing={3}>
        <FormInput
          name="username"
          label={t("auth.username")}
          type="text"
          value={formData.username}
          onChange={handleChange}
        />

        <FormInput
          name="password"
          label={t("auth.password")}
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <PrimaryButton
          type="submit"
          loading={loading}
          // loadingText="Signing up..."
        >
          {t("auth.next")}
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

export default CreateAccountForm;
