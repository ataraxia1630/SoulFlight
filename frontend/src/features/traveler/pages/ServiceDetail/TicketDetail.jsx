import { Alert, Box, CircularProgress, Container, Grid } from "@mui/material";
import ImageGallery from "@traveler/components/ServiceDetail/ImageGallery";
import ServiceInfo from "@traveler/components/ServiceDetail/ServiceInfo";
import TicketBookingCard from "@traveler/components/ServiceDetail/TicketBookingCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CartService } from "@/shared/services/cart.service";
import TicketService from "../../../../shared/services/ticket.service";

const TicketDetail = () => {
  const { ticketId } = useParams();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchTicketDetail = async () => {
      try {
        setLoading(true);
        const result = await TicketService.getById(ticketId);
        setTicket(result.data);
      } catch (err) {
        setError(err.message || "Không thể tải thông tin vé");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetail();
  }, [ticketId]);

  const handleAddToCart = async (bookingData) => {
    try {
      await CartService.addToCart({
        item_type: "TICKET",
        item_id: ticket.id,
        quantity: bookingData.quantity,
        visit_date: bookingData.visitDate,
        note: "",
      });

      setAlert({ type: "success", message: "Đã thêm vào giỏ hàng!" });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.message });
      setTimeout(() => setAlert(null), 3000);
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

  if (!ticket) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {alert && (
        <Alert severity={alert.type} onClose={() => setAlert(null)} sx={{ mb: 4 }}>
          {alert.message}
        </Alert>
      )}

      <Grid container spacing={5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <ImageGallery images={[ticket.place.main_image]} />
          <ServiceInfo service={ticket} type="TICKET" />
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ position: "sticky", top: 100, zIndex: 10 }}>
            <TicketBookingCard ticket={ticket} onAddToCart={handleAddToCart} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TicketDetail;
