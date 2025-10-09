import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const MainLayout = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      <Box sx={{ pt: { xs: 12, lg: 10 }, px: { xs: 2, lg: 2 } }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
