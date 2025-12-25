import { ArrowBack, Favorite, FavoriteBorder, Share } from "@mui/icons-material";
import { Box, Button, Container, Grid, IconButton } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/app/store";
import LoadingState from "../components/LoadingState.jsx";
import EmptyState from "../components/service-detail/EmptyState";
import ProviderCard from "../components/service-detail/ProviderCard";
import ServiceHeader from "../components/service-detail/ServiceHeader.jsx";
import ServiceTabs from "../components/service-detail/ServiceTabs.jsx";
import MenuService from "../services/menu.service.js";
import ReviewService from "../services/review.service.js";
import RoomService from "../services/room.service.js";
import ServiceService from "../services/service.service.js";
import TicketService from "../services/ticket.service.js";
import TourService from "../services/tour.service.js";

const ServiceDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();

  const [service, setService] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [menus, setMenus] = useState([]);
  const [tours, setTours] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);

      const serviceRes = await ServiceService.getById(id);
      const serviceData = serviceRes.data;
      setService(serviceData);

      const typeName = serviceData.type?.name;

      const reviewsPromise = ReviewService.getByService(id);

      let roomsPromise = Promise.resolve({ data: [] });
      let menusPromise = Promise.resolve({ data: [] });
      let toursPromise = Promise.resolve({ data: [] });
      let ticketsPromise = Promise.resolve({ data: [] });

      switch (typeName) {
        case "stay":
          roomsPromise = RoomService.getByService(id);
          break;

        case "fnb":
          menusPromise = MenuService.getByService(id);
          break;

        case "tour":
          toursPromise = TourService.getByService(id);
          break;

        case "leisure":
          ticketsPromise = TicketService.getByService(id);
          break;
      }

      const [reviewsRes, roomsRes, menusRes, toursRes, ticketsRes] = await Promise.all([
        reviewsPromise,
        roomsPromise,
        menusPromise,
        toursPromise,
        ticketsPromise,
      ]);

      setReviews(reviewsRes.data || []);
      setRooms(roomsRes.data || []);
      setMenus(menusRes.data || []);
      setTours(toursRes.data || []);
      setTickets(ticketsRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!service) {
    return <EmptyState message="Không tìm thấy dịch vụ" />;
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 1 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ color: "text.primary" }}>
            Quay lại
          </Button>
          {user?.role === "TRAVELER" && (
            <Box>
              <IconButton
                onClick={() => setIsFavorite(!isFavorite)}
                sx={{ color: isFavorite ? "error.main" : "text.secondary" }}
              >
                {isFavorite ? <Favorite /> : <FavoriteBorder />}
              </IconButton>

              <IconButton sx={{ color: "text.secondary" }}>
                <Share />
              </IconButton>
            </Box>
          )}
        </Box>

        <Grid>
          <Grid>
            <ServiceHeader service={service} reviews={reviews} />
            <ServiceTabs
              rooms={rooms}
              menus={menus}
              tours={tours}
              tickets={tickets}
              reviews={reviews}
            />
            <Box sx={{ mt: 3 }}>
              <ProviderCard provider={service.provider} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ServiceDetailPage;
