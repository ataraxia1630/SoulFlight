import { useState } from "react";
import { Box, Typography, Stack, MenuItem } from "@mui/material";
import SocialLoginButtons from "./SocialLoginButtons";
import FormInput from "../FormInput";
import PrimaryButton from "../PrimaryButton";
import BackLogin from "./BackLoginLink";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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
    dateOfBirth: "",
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
          <MenuItem value="male">{t("male")}</MenuItem>
          <MenuItem value="female">{t("female")}</MenuItem>
          <MenuItem value="other">{t("other")}</MenuItem>
        </FormInput>

        <FormInput
          name="dateOfBirth"
          label={t("info.dob")}
          type="date"
          value={formData.dateOfBirth}
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
