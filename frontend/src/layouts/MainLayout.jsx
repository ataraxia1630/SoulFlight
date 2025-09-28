import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "@/shared/components/Header";

const MainLayout = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "white" }}>
      <Header />
      <Box sx={{ p: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
