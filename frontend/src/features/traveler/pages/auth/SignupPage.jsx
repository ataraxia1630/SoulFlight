import { Link } from "react-router-dom";
import { Typography, Stack } from "@mui/material";
import CustomTextField from "@/shared/components/CustomTextField";
import CustomButton from "@/shared/components/CustomButton";

const SignupTravelerPage = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Sign Up (Traveler)
      </Typography>
      <Stack spacing={2} mb={2}>
        <CustomTextField label="Email" type="email"  />
        <CustomButton>Sign up</CustomButton>
      </Stack>
      <Typography variant="body2">
        Already have an account? <Link to="/login">Login</Link>
      </Typography>
    </div>
  );
};

export default SignupTravelerPage;