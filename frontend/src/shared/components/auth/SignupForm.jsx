import { useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  Stack,
} from "@mui/material";
import SocialLoginButtons from "./SocialLoginButtons";
import FormInput from "../FormInput";
import PrimaryButton from "../PrimaryButton";
import { Link as RouterLink } from "react-router-dom";

const SignupForm = ({ userType, onSubmit, loading = false }) => {
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
          color: "#black",
        }}
      >
        Let's join with us!
      </Typography>

      <Stack spacing={3}>
        <FormInput
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <PrimaryButton
          type="submit"
          fullWidth
          loading={loading}
          loadingText="Signup in..."
        >
          Sign up
        </PrimaryButton>

        {userType === "traveler" && (
          <SocialLoginButtons />
        )}

        <PrimaryButton
          component={RouterLink}
          to={userType === "traveler" ? "/signup/business" : "/signup/traveler"}
          fullWidth
          sx={{
            backgroundColor: "#136687",
            color: "white",
            "&:hover": { backgroundColor: "#1d556bff" },
          }}
        >
          {userType === "traveler"
            ? "Sign up for business"
            : "Sign up for traveler"}
        </PrimaryButton>

        <Typography
          variant="body2"
          align="center"
          sx={{
            mt: 2,
            color: "#6b7280",
            textDecoration: "none",
            "&:hover": { fontWeight: 600 },
          }}
          component={RouterLink}
          to="/login"
        >
          Back to login
        </Typography>
      </Stack>
    </Box>
  );
};

export default SignupForm;
