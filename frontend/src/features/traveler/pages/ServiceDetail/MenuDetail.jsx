import { Alert, Box, CircularProgress, Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CartService } from "@/shared/services/cart.service";
import MenuService from "@/shared/services/menu.service";
import ImageGallery from "../../components/ServiceDetail/ImageGallery";
import MenuBookingCard from "../../components/ServiceDetail/MenuBookingCard";
import ServiceInfo from "../../components/ServiceDetail/ServiceInfo";

const MenuDetail = () => {
  const { menuId } = useParams();

  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchMenuDetail = async () => {
      try {
        setLoading(true);
        const result = await MenuService.getById(menuId);
        setMenu(result.data);
      } catch (err) {
        setError(err.message || "Không thể tải thông tin menu");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuDetail();
  }, [menuId]);

  const handleAddToCart = async (bookingData) => {
    try {
      await CartService.addToCart(bookingData);
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

  if (!menu) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {alert && (
        <Alert severity={alert.type} onClose={() => setAlert(null)} sx={{ mb: 4 }}>
          {alert.message}
        </Alert>
      )}

      <Grid container spacing={5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <ImageGallery images={menu.images || [menu.cover_url]} />
          <ServiceInfo service={menu} type="MENU_ITEM" />
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ position: "sticky", top: 100, zIndex: 10 }}>
            <MenuBookingCard menu={menu} onAddToCart={handleAddToCart} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MenuDetail;
