import { Alert, Box, CircularProgress, Container, Grid } from "@mui/material";
import ImageGallery from "@traveler/components/ServiceDetail/ImageGallery";
import RoomBookingCard from "@traveler/components/ServiceDetail/RoomBookingCard";
import ServiceInfo from "@traveler/components/ServiceDetail/ServiceInfo";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CartService } from "@/shared/services/cart.service";
import toast from "@/shared/utils/toast";
import RoomService from "../../../../shared/services/room.service";

const RoomDetail = () => {
  const { roomId } = useParams();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        setLoading(true);
        const result = await RoomService.getById(roomId);
        setRoom(result.data);
      } catch (err) {
        setError(err.message || "Không thể tải thông tin phòng");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetail();
  }, [roomId]);

  const handleAddToCart = async (bookingData) => {
    try {
      await CartService.addToCart({
        itemType: "ROOM",
        itemId: room.id,
        quantity: bookingData.quantity,
        checkinDate: bookingData.checkinDate,
        checkoutDate: bookingData.checkoutDate,
      });

      toast.success("Đã thêm phòng vào giỏ hàng!");

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      toast.error(err.message || "Lỗi khi thêm phòng vào giỏ hàng");
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

  if (!room) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {alert && (
        <Alert severity={alert.type} onClose={() => setAlert(null)} sx={{ mb: 4 }}>
          {alert.message}
        </Alert>
      )}

      <Grid container spacing={5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <ImageGallery images={room.images} />
          <ServiceInfo service={room} type="ROOM" />
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ position: "sticky", top: 100, zIndex: 10 }}>
            <RoomBookingCard room={room} onAddToCart={handleAddToCart} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RoomDetail;
