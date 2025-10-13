import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FormInput from "../FormInput";
import PrimaryButton from "../PrimaryButton";
import BackLogin from "./BackLoginLink";

const CompleteProfileBusinessForm = ({ onSubmit, loading = false }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website_link: "",
    phone: "",
    address: "",
    country: "",
    province: "",
    id_card: "",
    establish_year: "",
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
          name="name"
          label={t("info.company_name")}
          type="text"
          value={formData.name}
          onChange={handleChange}
        />

        <FormInput
          name="description"
          label={t("info.description")}
          type="text"
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
        />

        <FormInput
          name="website_link"
          label="Website"
          type="url"
          value={formData.website_link}
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
          name="province"
          label={t("info.province")}
          type="text"
          value={formData.province}
          onChange={handleChange}
        />

        <FormInput
          name="id_card"
          label={t("info.id_card")}
          type="text"
          value={formData.id_card}
          onChange={handleChange}
        />

        <FormInput
          name="establish_year"
          label={t("info.establish_year")}
          type="number"
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
            min: 1900,
            max: new Date().getFullYear(),
          }}
          value={formData.establish_year}
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

export default CompleteProfileBusinessForm;
