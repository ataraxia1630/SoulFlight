import { Box, Button, Container, Grid, Typography } from "@mui/material";
import TestimonialCard from "./cards/TestimonialCard";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Zack William",
      rating: 5,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Zack William",
      rating: 5,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      name: "Zack William",
      rating: 5,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        py: 6,
        mt: 5,
        m: 3,
        backgroundImage:
          "url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(255,255,255,0.85)",
        },
      }}
    >
      <Container sx={{ position: "relative" }}>
        <Typography variant="h3" sx={{ textAlign: "center", mb: 1 }}>
          We are
        </Typography>
        <Typography variant="h3" sx={{ textAlign: "center", fontWeight: "bold", mb: 6 }}>
          honored to be your{" "}
          <Box
            component="span"
            sx={{
              fontWeight: "normal",
              textDecoration: "underline",
              textDecorationStyle: "double",
            }}
          >
            companion
          </Box>
          .
        </Typography>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {testimonials.map((testimonial) => (
            <Grid item xs={12} md={4} key={testimonial.avatar}>
              <TestimonialCard {...testimonial} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: "normal" }}>
            <Box component="span" sx={{ fontSize: "3rem", fontWeight: "bold" }}>
              OR
            </Box>
          </Typography>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Are you a service provider? Sign up with SoulFlight now!
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: "grey.900",
              color: "white",
              px: 6,
              py: 1.5,
              borderRadius: 1,
              "&:hover": { bgcolor: "grey.800" },
            }}
          >
            Sign up now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Testimonials;
