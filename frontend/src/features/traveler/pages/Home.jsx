import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const TravelerHome = () => (
  <div>
    <Typography variant="h3" gutterBottom>
      Traveler Home
    </Typography>
    <Button component={Link} to="/login" variant="outlined">
      Logout
    </Button>
  </div>
);

export default TravelerHome;