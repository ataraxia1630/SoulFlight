import { Outlet } from "react-router-dom";
import { Box, Paper } from "@mui/material";

const AuthLayout = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f9fafb"
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: "100%", maxWidth: 400 }}>
        <Outlet />
      </Paper>
    </Box>
  );
};

export default AuthLayout;