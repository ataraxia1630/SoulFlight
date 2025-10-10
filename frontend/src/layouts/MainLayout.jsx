import { Box, Container } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import ProviderSidebar, { DRAWER_WIDTH_CLOSE, DRAWER_WIDTH_OPEN } from "./ProviderSidebar";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const drawerWidth = sidebarOpen ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSE;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <ProviderSidebar open={sidebarOpen} onToggle={handleSidebarToggle} />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header drawerWidth={drawerWidth} />

        <Box
          component="main"
          sx={{
            flex: 1,
            pt: { xs: 10, lg: 12 },
            px: { xs: 1, sm: 6, md: 19 },
            overflowY: "auto",
            overflowX: "hidden",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          <Container maxWidth={false} sx={{ wordBreak: "break-word" }}>
            <Outlet />
          </Container>
        </Box>

        <Footer />
      </Box>
    </Box>
  );
};

export default MainLayout;
