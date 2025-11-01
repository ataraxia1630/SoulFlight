import { Box, Button, Container, Grid, Typography, useTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import TestimonialCard from "./cards/TestimonialCard";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Zack William",
      rating: 5,
      text: "L",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "Sophia Turner",
      rating: 5,
      text: "Lorem Ipsum has been the industry's standard dummy text. It survived five centuries.",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 3,
      name: "James Carter",
      rating: 5,
      text: "Popularised in the 1960s with Letraset sheets containing Lorem Ipsum passages.",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  ];

  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        py: 6,
        mt: 4.5,
        mx: 3,
        backgroundImage:
          "url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(255,255,255,0.90)",
        },
      }}
    >
      <Container sx={{ position: "relative" }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              color: "text.secondary",
              fontWeight: "400",
              fontSize: { xs: "24px", md: "32px" },
              mb: 1,
            }}
          >
            We are honored to be your
          </Typography>
          <Typography
            variant="h1"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.third.main} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2.3,
            }}
          >
            trusted companion
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: "500px",
              mx: "auto",
            }}
          >
            Join thousands of satisfied customers who've transformed their experience with us
          </Typography>
        </Box>

        <Grid
          container
          spacing={3}
          sx={{
            mb: 3,
            px: 3,
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {testimonials.map((testimonial, index) => (
            <Grid
              item
              xs={12}
              md={4}
              key={testimonial.id}
              sx={{
                display: "grid",
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                "@keyframes fadeInUp": {
                  from: {
                    opacity: 0,
                    transform: "translateY(20px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              <TestimonialCard {...testimonial} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h1"
            sx={{
              color: "text.secondary",
            }}
          >
            OR
          </Typography>
        </Box>

        <Box
          sx={{
            textAlign: "center",
            p: 4,
            mx: 3,
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(30, 155, 205, 0.05) 0%, rgba(26, 191, 195, 0.05) 100%)",
            border: "1px solid rgba(30, 155, 205, 0.1)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 2,
            }}
          >
            Are you a service provider?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              color: "text.secondary",
            }}
          >
            Join SoulFlight today and grow your business with our platform
          </Typography>
          <Button
            component={RouterLink}
            to="/business/signup"
            variant="contained"
            size="large"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "text.contrast",
              px: 5,
              py: 1.2,
              borderRadius: 2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(30, 155, 205, 0.3)",
              },
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
