import { Alert, Box, CircularProgress, Container, Grid } from "@mui/material";
import ImageGallery from "@traveler/components/ServiceDetail/ImageGallery";
import ServiceInfo from "@traveler/components/ServiceDetail/ServiceInfo";
import TourBookingCard from "@traveler/components/ServiceDetail/TourBookingCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CartService } from "@/shared/services/cart.service";
import toast from "@/shared/utils/toast";
import TourService from "../../../../shared/services/tour.service";

const TourDetail = () => {
  const { tourId } = useParams();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        setLoading(true);
        const result = await TourService.getById(tourId);
        setTour(result.data);
      } catch (err) {
        setError(err.message || "Không thể tải thông tin tour");
      } finally {
        setLoading(false);
      }
    };

    fetchTourDetail();
  }, [tourId]);

  const handleAddToCart = async (bookingData) => {
    try {
      await CartService.addToCart({
        itemType: "TOUR",
        itemId: tour.id,
        quantity: bookingData.quantity,
      });

      toast.success("Đã thêm tour vào giỏ hàng!");

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      toast.error(err.message || "Lỗi khi thêm tour vào giỏ hàng");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!tour) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {alert && (
        <Alert severity={alert.type} onClose={() => setAlert(null)} sx={{ mb: 4 }}>
          {alert.message}
        </Alert>
      )}

      <Grid container spacing={5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <ImageGallery images={tour.images} />
          <ServiceInfo service={tour} type="TOUR" />
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ position: "sticky", top: 100, zIndex: 10 }}>
            <TourBookingCard tour={tour} onAddToCart={handleAddToCart} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TourDetail;
