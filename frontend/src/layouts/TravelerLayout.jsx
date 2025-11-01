import { Box, Container, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import LeftSidebar from "@traveler/components/LeftSidebar";
import RightSidebar from "@traveler/components/RightSidebar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const LEFT_SIDEBAR_WIDTH = 230;
const RIGHT_SIDEBAR_WIDTH = 230;

const TravelerLayout = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <Box sx={{ display: "flex", flex: 1, bgcolor: "background.default" }}>
        {isMdUp && (
          <Box
            sx={{
              width: LEFT_SIDEBAR_WIDTH,
              flexShrink: 0,
              px: 1.5,
              pt: 3,
            }}
          >
            <Toolbar />
            <LeftSidebar />
          </Box>
        )}

        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 2,
            pt: 3,
          }}
        >
          <Toolbar />
          <Container
            maxWidth={false}
            sx={{
              maxWidth: 900,
              mx: "auto",
            }}
          >
            <Outlet />
          </Container>
        </Box>

        {isLgUp && (
          <Box
            sx={{
              width: RIGHT_SIDEBAR_WIDTH,
              flexShrink: 0,
              px: 1.5,
              pt: 3,
            }}
          >
            <Toolbar />
            <RightSidebar />
          </Box>
        )}
      </Box>

      <Footer />
    </Box>
  );
};

export default TravelerLayout;
