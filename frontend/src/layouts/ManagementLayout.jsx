import ProviderSidebar, {
  DRAWER_WIDTH_CLOSE,
  DRAWER_WIDTH_OPEN,
} from "@business/components/ProviderSidebar";
import { Box, Container, Toolbar } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const ManagementLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const drawerWidth = sidebarOpen ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSE;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <ProviderSidebar open={sidebarOpen} onToggle={toggleSidebar} />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header drawerWidth={drawerWidth} onToggleSidebar={toggleSidebar} showMenuIcon />

        <Box
          component="main"
          sx={{
            flex: 1,
            pt: { xs: 3, lg: 5 },
            // px: { md: 19 },
            overflowY: "auto",
            overflowX: "hidden",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          <Toolbar />
          <Container maxWidth={false} sx={{ wordBreak: "break-word" }}>
            <Outlet />
          </Container>
        </Box>

        <Footer />
      </Box>
    </Box>
  );
};

export default ManagementLayout;
