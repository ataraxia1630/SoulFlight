import { Box, Container, Grid } from "@mui/material";
import DestinationCard from "./cards/DestinationCard";
import InfoCard from "./cards/InfoCard";
import SectionHeader from "./SectionHeader";

const TopDestination = () => {
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
        <Grid item xs={12} md={3}>
          <InfoCard
            title="Plan your perfect trip with us"
            description="Book flights, find hotels, and explore the most popular destinations around the world. Discover where your next adventure begins!"
            onClick={() => console.log("Clicked InfoCard")}
          />
        </Grid>

        <Grid item xs={12} md={9}>
          <Box>
            <SectionHeader title="TOP DESTINATIONS" />
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
