import { Link } from "react-router-dom";
import { Typography, Stack } from "@mui/material";

const SignupBusinessPage = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Sign Up (Business)
      </Typography>
      <Stack spacing={2} mb={2}>
        <TextField label="Email" type="email" />
        <Button>Sign up</Button>
      </Stack>
      <Typography variant="body2">
        Already have an account? <Link to="/login">Login</Link>
      </Typography>
    </div>
  );
};

export default SignupBusinessPage;