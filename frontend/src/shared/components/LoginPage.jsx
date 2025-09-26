import { Link } from "react-router-dom";
import { Typography, Stack } from "@mui/material";
import CustomTextField from "@/shared/components/CustomTextField";
import CustomButton from "@/shared/components/CustomButton";

const LoginPage = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>

      <Stack spacing={2} mb={2}>
        <CustomTextField label="Email" type="email" />
        <CustomTextField label="Password" type="password" />
        <CustomButton>Login</CustomButton>
      </Stack>

      <Typography variant="body2">
        Don’t have an account?{" "}
        <Link to="/signup/traveler">Sign Up</Link>
      </Typography>
    </div>
  );
};

export default LoginPage;