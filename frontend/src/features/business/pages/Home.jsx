import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const BusinessHome = () => (
  <div>
    <Typography variant="h3" gutterBottom>
      Business Dashboard
    </Typography>
    <Button component={Link} to="/login" variant="outlined">
      Logout
    </Button>
  </div>
);

export default BusinessHome;
