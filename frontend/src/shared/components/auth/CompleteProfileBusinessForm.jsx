import { useState } from "react";
import { Box, Typography, Stack, Link } from "@mui/material";
import SocialLoginButtons from "./SocialLoginButtons";
import FormInput from "../FormInput";
import PrimaryButton from "../PrimaryButton";
import BackLogin from "./BackLoginLink";
import { useTranslation } from "react-i18next";

const CompleteProfileTravelerForm = ({ onSubmit, loading = false }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    website: "",
    phone: "",
    address: "",
    country: "",
    identityCard: "",
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
          name="website"
          label="Website"
          type="url"
          value={formData.website}
          onChange={handleChange}
        />

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
          name="address"
          label={t("info.address")}
          type="text"
          value={formData.address}
          onChange={handleChange}
        />

        <FormInput
          name="country"
          label={t("info.country")}
          type="text"
          value={formData.country}
          onChange={handleChange}
        />

        <FormInput
          name="identityCard"
          label={t("info.id card")}
          type="text"
          value={formData.identityCard}
          onChange={handleChange}
        />

        <PrimaryButton
          type="submit"
          loading={loading}
          // loadingText="Signing up..."
        >
          {t("auth.finish")}
        </PrimaryButton>

        <BackLogin />
      </Stack>
    </Box>
  );
};

export default CompleteProfileTravelerForm;
