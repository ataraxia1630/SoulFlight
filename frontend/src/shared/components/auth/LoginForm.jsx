import { useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
  Stack,
} from "@mui/material";
import SocialLoginButtons from "./SocialLoginButtons";
import FormInput from "./FormInput";
import { Form } from "react-router-dom";
import PrimaryButton from "./PrimaryButton";
import { Link as RouterLink } from "react-router-dom";

const LoginForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

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
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", backgroundColor: "rgba(255,255,255,0.9)" }}>
      <Typography
        variant="h4"
        component="h1"
        align="center"
        sx={{
          mb: 4,
          fontWeight: 600,
          color: "#1a1a1a",
        }}
      >
        Welcome back!
      </Typography>

      <Stack spacing={3}>
        <FormInput
          name="email"
          label="Email or username"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <FormInput
          name="password"
          label="Password"
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
                Remember me
              </Typography>
            }
          />
          <Link
            component={RouterLink}
            to="/forgot-password"
            variant="body2"
            underline="none"
            sx={{
              color: "#6b7280",
              "&:hover": {
                color: "#1E9BCD",
                textDecoration: "underline",
              },
            }}
          >
            Forgot password?
          </Link>
        </Box>

        <PrimaryButton
          type="submit"
          fullWidth
          loading={loading}
          loadingText="Logging in..."
        >
          Login
        </PrimaryButton>

        <SocialLoginButtons />

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2, color: "#6b7280" }}
        >
          Don't have an account?{" "}
          <Link
            href="#"
            sx={{
              color: "#1E9BCD",
              textDecoration: "none",
              fontWeight: 500,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Sign up
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
};

export default LoginForm;
