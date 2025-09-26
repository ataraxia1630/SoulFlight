import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const AdminHome = () => (
  <div>
    <Typography variant="h3" gutterBottom>
      Admin Dashboard
    </Typography>
    <Button component={Link} to="/login" variant="outlined">
      Logout
    </Button>
  </div>
);

export default AdminHome;