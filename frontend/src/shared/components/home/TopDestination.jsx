import { ChevronRight } from "@mui/icons-material";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DestinationCard from "./cards/DestinationCard";

const TopDestination = () => {
  const theme = useTheme();

  const destinations = [
    {
      title: "Seoul",
      description: "200 hotels, 345 local flights and 234 bus providers",
      image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=500&h=400&fit=crop",
    },
    {
      title: "Tokyo",
      description: "180 hotels, 420 local flights and 215 bus providers",
      image: "https://images.unsplash.com/photo-1505440484611-23c171ad6e96?w=500&h=400&fit=crop",
    },
    {
      title: "Bangkok",
      description: "220 hotels, 380 local flights and 250 bus providers",
      image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=500&h=400&fit=crop",
    },
    {
      title: "Paris",
      description: "220 hotels, 380 local flights and 250 bus providers",
      image:
        "https://media.tbvsc.com/3z73vs69pqez/6WOez8xgquhZiDtyTKnMMA/de3cb04d31925f2d81fa44fbe59121e0/a_HEADER_insider_a_romantics_guide_to_paris_3_1200x1920.jpg?w=2500&q=100",
    },
    {
      title: "Sweden",
      description: "220 hotels, 380 local flights and 250 bus providers",
      image:
        "https://scandification.com/wp-content/uploads/2020/09/What-Is-Sweden-Known-For-1-scaled.jpg",
    },
  ];

  return (
    <Container sx={{ mt: 15 }}>
      <Grid container spacing={4}>
        <Grid>
          <Paper
            sx={{
              border: "1px solid",
              borderColor: theme.palette.border.light,
              p: 2,
              borderRadius: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Box sx={{ pt: 2 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "15px",
                  mb: 1,
                }}
              >
                Plan your perfect trip with us
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "13px",
                  lineHeight: 1.7,
                }}
              >
                Book flights, find hotels, and explore the most popular destinations around the
                world. Discover where your next adventure begins!
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                mt: 2,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateX(4px)",
                },
              }}
            >
              <Typography
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                See details
              </Typography>
              <ChevronRight sx={{ fontSize: 20, color: theme.palette.primary.main }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  lineHeight: 1.2,
                }}
              >
                Top Destinations
              </Typography>
              <Box
                sx={{
                  width: 100,
                  height: 4,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.third.main})`,
                  borderRadius: 3,
                  mt: 1.7,
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              {destinations.map((dest) => (
                <Box key={dest.title} sx={{ flex: "1 1 calc(50% - 12px)" }}>
                  <DestinationCard {...dest} />
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TopDestination;
