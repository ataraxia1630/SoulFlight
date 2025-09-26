import { Outlet } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const MainLayout = () => {
  return (
    <Box>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Header
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;