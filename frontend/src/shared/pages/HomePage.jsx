import { Box } from "@mui/material";
import CategoryCarousel from "@/shared/components/home/CategoryCarousel";
import HeroSection from "@/shared/components/home/HeroSection";
import HotVouchers from "@/shared/components/home/HotVoucher";
import Testimonials from "@/shared/components/home/Testimonials";
import TopDestination from "@/shared/components/home/TopDestination";

export default function TravelWebsite() {
  return (
    <Box>
      <HeroSection />
      <TopDestination />
      <CategoryCarousel />
      <HotVouchers />
      <Testimonials />
    </Box>
  );
}
