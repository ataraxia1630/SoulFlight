import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useCarouselPagination from "@/shared/hooks/useCarouselPagination";
import CarouselDots from "../CarouselDots";
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
    {
      id: "tours-3",
      name: "TOURS",
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&h=300&fit=crop",
    },
    {
      id: "restaurants-3",
      name: "RESTAURANTS",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=300&fit=crop",
    },
  ];

  const itemsPerPage = 3;
  const cardWidth = 193;
  const gap = 5.5;

  const { scrollContainerRef, currentIndex, totalDots, scrollToIndex } = useCarouselPagination({
    itemsLength: categories.length,
    itemsPerPage,
    cardWidth,
    gap,
  });

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const step = cardWidth + gap * 8;

      const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;

      if (isAtEnd) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, scrollContainerRef]);

  return (
    <Box sx={{ py: { xs: 5, md: 7 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: { xs: 3, md: 4 } }}>
          <Typography variant="h3" sx={{ letterSpacing: "2px", mb: 1.5 }}>
            EXPLORE OUR CATEGORIES
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "15px" }}>
            We have everything you need for your journey.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            gap: 1.7,
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Box
            ref={scrollContainerRef}
            sx={{
              display: "flex",
              gap,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              py: 0.5,
              maxWidth: "100%",
              "::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            {categories.map((cat, i) => (
              <Box key={`${cat.id}-${i}`} sx={{ scrollSnapAlign: "start" }}>
                <CategoryCard {...cat} />
              </Box>
            ))}
          </Box>

          <CarouselDots
            totalDots={totalDots}
            currentIndex={currentIndex}
            onDotClick={scrollToIndex}
            categories={categories}
            itemsPerPage={itemsPerPage}
          />
        </Box>

        <Box
          sx={{
            position: "relative",
            height: { xs: "320px", md: "384px" },
            borderRadius: "24px",
            overflow: "hidden",
            mt: { xs: 3, md: 5 },
            cursor: "pointer",
            "&:hover img": {
              transform: "scale(1.05)",
            },
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=600&fit=crop"
            alt="Hotels"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ textAlign: "center", color: "text.contrast" }}>
              <Typography
                sx={{
                  fontSize: "45px",
                  fontWeight: "650",
                  mb: 1,
                  letterSpacing: "3px",
                }}
              >
                HOTELS
              </Typography>
              <Typography
                sx={{
                  color: "text.contrast",
                  fontSize: "17px",
                  maxWidth: "447px",
                }}
              >
                Search hotels & places to hire to our most popular destinations
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CategoryCarousel;
