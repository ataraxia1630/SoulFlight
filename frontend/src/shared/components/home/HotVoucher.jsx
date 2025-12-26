import { Box, Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import useCarouselPagination from "@/shared/hooks/useCarouselPagination";
import CarouselDots from "../CarouselDots";
import InfoCard from "./cards/InfoCard";
import VoucherCard from "./cards/VoucherCard";
import SectionHeader from "./SectionHeader";

const HotVouchers = () => {
  const vouchers = [
    {
      title: "Seoul tour",
      code: "SK3462",
      discount: "30",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    },
    {
      title: "Tokyo adventure",
      code: "SK3462",
      discount: "30",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
    },
    {
      title: "Seoul tour",
      code: "SK3462",
      discount: "30",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    },
  ];

  const itemsPerPage = 2;
  const cardWidth = 320;
  const gap = 3;

  const { scrollContainerRef, currentIndex, totalDots, scrollToIndex } = useCarouselPagination({
    itemsLength: vouchers.length,
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
    <Container sx={{ py: 0.5 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <InfoCard
            title="Your dream trip awaits"
            description="Get exclusive travel deals for flights, hotels, and tours. Limited-time vouchers available — grab yours before they're gone!"
            onClick={() => console.log("Clicked InfoCard")}
          />
        </Grid>

        <Grid item xs={12} md={9}>
          <SectionHeader title="HOT VOUCHERS" />
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
                py: 1.5,
                maxWidth: "100%",
                "::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
              }}
            >
              {vouchers.map((vou, i) => (
                <Box key={`${vou.id}-${i}`} sx={{ scrollSnapAlign: "start" }}>
                  <VoucherCard {...vou} />
                </Box>
              ))}
            </Box>

            <CarouselDots
              totalDots={totalDots}
              currentIndex={currentIndex}
              onDotClick={scrollToIndex}
              categories={vouchers}
              itemsPerPage={itemsPerPage}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HotVouchers;
