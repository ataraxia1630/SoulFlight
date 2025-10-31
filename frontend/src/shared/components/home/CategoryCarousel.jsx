import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Card, CardMedia, Container, IconButton, Typography } from "@mui/material";
import { useId } from "react";
import CategoryCard from "./cards/CategoryCard";

const CategoryCarousel = () => {
  const categories = [
    {
      id: "tours-1",
      name: "TOURS",
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&h=300&fit=crop",
    },
    {
      id: "restaurants-1",
      name: "RESTAURANTS",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=300&fit=crop",
    },
    {
      id: "tours-2",
      name: "TOURS",
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&h=300&fit=crop",
    },
    {
      id: "restaurants-2",
      name: "RESTAURANTS",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=300&fit=crop",
    },
  ];

  const baseId = useId();

  return (
    <Box sx={{ py: 8, bgcolor: "grey.50" }}>
      <Container>
        <Typography variant="h5" sx={{ textAlign: "center", color: "text.secondary", mb: 6 }}>
          We have everything you need for your journey.
        </Typography>

        <Box sx={{ position: "relative" }}>
          <IconButton
            sx={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              bgcolor: "rgba(255,255,255,0.8)",
              "&:hover": { bgcolor: "white" },
            }}
          >
            <ChevronLeft />
          </IconButton>

          {/* ✅ FIXED: key unique + stable */}
          <Box sx={{ display: "flex", gap: 3, overflowX: "auto", px: 6 }}>
            {[...categories, ...categories].map((cat, i) => (
              <CategoryCard key={`${baseId}-${cat.id}-${i}`} {...cat} />
            ))}
          </Box>

          <IconButton
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              bgcolor: "rgba(255,255,255,0.8)",
              "&:hover": { bgcolor: "white" },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Large Hotels Card */}
        <Card
          sx={{
            position: "relative",
            mt: 6,
            height: 384,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            image="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=600&fit=crop"
            alt="Hotels"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ textAlign: "center", color: "white" }}>
              <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
                Hotels
              </Typography>
              <Typography variant="h6">
                Search hotels & Places Hire to our most popular destinations
              </Typography>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default CategoryCarousel;
