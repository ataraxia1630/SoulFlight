import { Box, Container, Paper, Typography } from "@mui/material";
import Flight from "@/assets/flight";
import SearchBar from "./SearchBar";

const HeroSection = () => {
  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          position: "relative",
          height: "470px",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&h=900&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "visible",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(6, 182, 212, 0.4), rgba(59, 130, 246, 0.4))",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", pt: 8 }}>
          <Box sx={{ maxWidth: 550 }}>
            <Typography
              sx={{
                fontSize: "40px",
                fontWeight: "700",
                color: "text.contrast",
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              Unlock{" "}
              <Box component="span" sx={{ fontWeight: 270 }}>
                the gates
              </Box>
              <br />
              to timeless journeys.
            </Typography>

            <Typography
              sx={{
                color: "text.contrast",
                fontSize: "14px",
                lineHeight: 1.7,
                maxWidth: 460,
              }}
            >
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
              Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industring and
              typesetting industry. Lorem Ipsum
            </Typography>
          </Box>
        </Container>

        <Box
          sx={{
            position: "absolute",
            right: "5%",
            top: "260px",
            zIndex: 20,
            animation: "float 3s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": {
                transform: "translateY(0px)",
              },
              "50%": {
                transform: "translateY(-10px)",
              },
            },
          }}
        >
          <Flight />
        </Box>
      </Box>

      {/* Search */}
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Paper
          elevation={8}
          sx={{
            position: "absolute",
            top: -100,
            left: "50%",
            transform: "translateX(-50%)",
            width: "93%",
            maxWidth: 950,
            borderRadius: 4,
            px: 4,
            py: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            zIndex: 10,
          }}
        >
          <Typography
            sx={{
              fontSize: "26px",
              fontWeight: 700,
              color: "primary.main",
              mb: 0.5,
            }}
          >
            Good Morning!
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "14px",
              mb: 2.5,
            }}
          >
            Explore beautiful places in the world with SoulFlight.
          </Typography>

          <SearchBar />
        </Paper>
      </Container>
    </Box>
  );
};

export default HeroSection;
