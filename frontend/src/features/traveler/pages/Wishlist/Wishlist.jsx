import { Explore, FavoriteTwoTone } from "@mui/icons-material";
import { Box, Button, Container, Fade, Typography, useTheme } from "@mui/material";
import WishlistService from "@traveler/services/wishlist.service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/app/store";
import ServiceCard from "@/shared/components/explore/cards/ServiceCard";
import ResultSection from "@/shared/components/explore/ResultSection";
import LoadingState from "@/shared/components/LoadingState";
import toast from "@/shared/utils/toast";

const Wishlist = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const res = await WishlistService.getWishlist();
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setWishlist(data);
      } catch (error) {
        console.error("Lỗi tải wishlist:", error);
        toast.error("Không thể tải danh sách yêu thích");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  if (!user) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h6">Vui lòng đăng nhập để xem danh sách yêu thích</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/login")}>
          Đăng nhập
        </Button>
      </Box>
    );
  }

  if (loading) return <LoadingState />;

  if (wishlist.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 7 }}>
        <Fade in timeout={800}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 6,
              bgcolor: "background.paper",
              borderRadius: 4,
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              textAlign: "center",
              border: "1px dashed",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: "error.lighter",
                color: "error.main",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <FavoriteTwoTone sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Danh sách yêu thích trống
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
              Bạn chưa lưu dịch vụ nào. Hãy khám phá và lưu lại những địa điểm thú vị cho chuyến đi
              sắp tới nhé!
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Explore />}
              onClick={() => navigate("/explore")}
              sx={{ borderRadius: "30px", px: 4, py: 1.2, boxShadow: theme.shadows[4] }}
            >
              Khám phá ngay
            </Button>
          </Box>
        </Fade>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 1 }}>
      <Container maxWidth="xl">
        <Fade in timeout={600}>
          <Box>
            <ResultSection title="Dịch vụ đã yêu thích" count={wishlist.length}>
              {wishlist.map((item) => (
                <ServiceCard key={item.id} data={{ ...item, is_wishlisted: true }} />
              ))}
            </ResultSection>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Wishlist;
