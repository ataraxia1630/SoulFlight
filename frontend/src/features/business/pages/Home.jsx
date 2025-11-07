import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import AuthService from "@/shared/services/auth.service";

const BusinessHome = () => {
  const handleLogout = async () => {
    await AuthService.logout();
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Business Dashboard
      </Typography>
      <Button component={Link} to="/login" variant="outlined" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default BusinessHome;
