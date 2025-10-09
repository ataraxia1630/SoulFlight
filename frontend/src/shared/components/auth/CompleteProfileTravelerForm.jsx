import { Box, MenuItem, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FormInput from "../FormInput";
import PrimaryButton from "../PrimaryButton";
import BackLogin from "./BackLoginLink";
import SocialLoginButtons from "./SocialLoginButtons";

const CompleteProfileTravelerForm = ({
  onSubmit,
  loading = false,
  onGoogleLogin,
  onFacebookLogin,
  onXLogin,
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    phone: "",
    gender: "",
    dob: "",
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
        {t("auth.complete profile")}
      </Typography>

      <Stack spacing={3}>
        <FormInput
          name="phone"
          label={t("info.phone")}
          type="tel"
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
          value={formData.phone}
          onChange={handleChange}
        />

        <FormInput
          select
          name="gender"
          label={t("info.gender")}
          value={formData.gender}
          onChange={handleChange}
        >
          <MenuItem value="MALE">{t("male")}</MenuItem>
          <MenuItem value="FEMALE">{t("female")}</MenuItem>
          <MenuItem value="OTHER">{t("other")}</MenuItem>
        </FormInput>

        <FormInput
          name="dob"
          label={t("info.dob")}
          type="date"
          value={formData.dob}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <PrimaryButton
          type="submit"
          loading={loading}
          // loadingText="Signing up..."
        >
          {t("auth.finish")}
        </PrimaryButton>

        <SocialLoginButtons
          onGoogleLogin={onGoogleLogin}
          onFacebookLogin={onFacebookLogin}
          onXLogin={onXLogin}
        />

        <BackLogin />
      </Stack>
    </Box>
  );
};

export default CompleteProfileTravelerForm;
