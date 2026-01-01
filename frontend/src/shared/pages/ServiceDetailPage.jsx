import { ArrowBack, Favorite, FavoriteBorder, Share } from "@mui/icons-material";
import { Box, Button, Container, Grid, IconButton } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/app/store";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import WishlistService from "@traveler/services/wishlist.service";
import toast from "@/shared/utils/toast";
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
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchAllData = useCallback(
    async (isRefresh = false) => {
      try {
        if (!isRefresh) setLoading(true);

        const serviceRes = await ServiceService.getById(id);
        const serviceData = serviceRes.data;
        setService(serviceData);

        const reviewsRes = await ReviewService.getByService(id);
        setReviews(reviewsRes.data || []);

        const strategies = {
          stay: { api: RoomService.getByService, setter: setRooms },
          fnb: { api: MenuService.getByService, setter: setMenus },
          tour: { api: TourService.getByService, setter: setTours },
          leisure: { api: TicketService.getByService, setter: setTickets },
        };

        const typeName = serviceData.type?.name;
        const strategy = strategies[typeName];

        let subData = [];
        if (strategy) {
          const subRes = await strategy.api(id);
          subData = subRes.data || [];
          strategy.setter(subData);
        }

        const isWishlisted = subData[0]?.is_wishlisted ?? false;
        setIsFavorite(!!isWishlisted);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [id],
  );

  const handleToggleFavorite = async () => {
    if (toggleLoading) return;
    if (!user) return;

    try {
      setToggleLoading(true);

      const res = await WishlistService.toggle(parseInt(id, 10));
      const isLiked = res.data?.liked;
      const message = res.data.message;

      setIsFavorite(isLiked);

      if (isLiked) {
        toast.success(message || "Đã thêm vào yêu thích");
      } else {
        toast.info(message || "Đã xóa khỏi yêu thích");
      }
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setToggleLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  if (loading) return <LoadingState />;
  if (!service) return <EmptyState message="Không tìm thấy dịch vụ" />;

  // const typeName = service.type?.name;

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
                onClick={handleToggleFavorite}
                disabled={toggleLoading}
                sx={{
                  color: isFavorite ? "error.main" : "text.secondary",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.1)" },
                }}
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

            {/* {["stay", "tour", "leisure"].includes(typeName) && (
              <Paper
                elevation={0}
                sx={{
                  my: 3,
                  borderRadius: "5px",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "white",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                  transition: "box-shadow 0.25s ease",
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    borderBottom: "1px solid",
                    borderColor: "grey.300",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CalendarMonth color="primary" sx={{ fontSize: 30 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800}>
                        Lịch trình dự kiến
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Chọn ngày bạn dự kiến đi
                      </Typography>
                    </Box>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={3}
                    alignItems="center"
                    sx={{
                      bgcolor: "primary.main",
                      p: "16px 24px",
                      borderRadius: "12px",
                      color: "white",
                    }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="caption"
                        sx={{ opacity: 0.8, display: "block", mb: 0.5, fontWeight: 700 }}
                      >
                        NGÀY ĐI
                      </Typography>
                      <Typography variant="body1" fontWeight={800}>
                        {format(dateRange[0].startDate, "dd/MM/yyyy")}
                      </Typography>
                    </Box>
                    <East sx={{ opacity: 0.8 }} />
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="caption"
                        sx={{ opacity: 0.8, display: "block", mb: 0.5, fontWeight: 700 }}
                      >
                        NGÀY VỀ
                      </Typography>
                      <Typography variant="body1" fontWeight={800}>
                        {format(dateRange[0].endDate, "dd/MM/yyyy")}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    borderRadius: "12px",

                    // ẩn UI thừa & ngày của tháng khác
                    "& .rdrDefinedRangesWrapper": { display: "none" },
                    "& .rdrDateDisplayWrapper": { display: "none" },
                    "& .rdrDayPassive": {
                      visibility: "hidden",
                      pointerEvents: "none",
                    },

                    // tổng thể Calendar
                    "& .rdrCalendarWrapper": {
                      color: "text.primary",
                      fontFamily: "inherit",
                      width: "100%",
                    },

                    // month & year Selects
                    "& .rdrMonthAndYearWrapper": {
                      padding: "20px 0",
                      height: "auto",
                      alignItems: "center",
                      paddingTop: 0,
                    },
                    "& .rdrMonthAndYearPickers": {
                      fontWeight: 600,
                      gap: "12px",
                      "& select": {
                        appearance: "none",
                        backgroundColor: "#f5f5f5",
                        padding: "10px 36px 10px 16px",
                        borderRadius: "12px",
                        border: "2px solid transparent",
                        cursor: "pointer",
                        fontSize: "15px",
                        fontWeight: 600,
                        transition: "all 0.2s ease",
                        color: "text.primary",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                        backgroundSize: "12px",
                        minWidth: "80px",
                        textAlign: "left",

                        "&:hover": {
                          backgroundColor: "#ebebeb",
                          borderColor: "primary.light",
                        },
                        "&:focus": {
                          outline: "none",
                          backgroundColor: "#fff",
                          borderColor: "primary.main",
                          boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.1)",
                        },
                      },

                      // custom scrollbar
                      "& select::-webkit-scrollbar": {
                        width: "8px",
                      },
                      "& select::-webkit-scrollbar-track": {
                        background: "#f1f1f1",
                        borderRadius: "10px",
                      },
                      "& select::-webkit-scrollbar-thumb": {
                        background: "#c1c1c1",
                        borderRadius: "10px",
                        "&:hover": {
                          background: "#a8a8a8",
                        },
                      },
                    },

                    // nút qua lại
                    "& .rdrNextPrevButton": {
                      background: "#f5f5f5",
                      borderRadius: "12px",
                      width: "44px",
                      height: "44px",
                      margin: "0 8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "#e3e3e3",
                        transform: "scale(1.05)",
                      },
                      "& i": {
                        margin: "5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      },
                    },

                    // Thứ trong tuần
                    "& .rdrWeekDay": {
                      color: "grey.600",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      paddingBottom: "12px",
                    },

                    // Ô ngày
                    "& .rdrDay": {
                      height: "47px",
                    },

                    "& .rdrDayNumber": {
                      top: "5px",
                      bottom: "5px",
                      left: "5px",
                      right: "5px",
                      fontWeight: 500,
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    },

                    // Các ngày trong range
                    "& .rdrInRange, & .rdrStartEdge, & .rdrEndEdge": {
                      top: "5px !important",
                      bottom: "5px !important",
                      left: "5px !important",
                      right: "5px !important",
                      borderRadius: "100% !important",
                      border: "none !important",
                    },

                    "& .rdrInRange": {
                      background: (theme) => theme.palette.primary.main,
                      opacity: "0.6 !important",
                    },

                    "& .rdrStartEdge, & .rdrEndEdge": {
                      background: (theme) => theme.palette.primary.main,
                      opacity: "1 !important",
                    },

                    // Ngày đã qua
                    "& .rdrDayDisabled": {
                      backgroundColor: "transparent",
                      "& .rdrDayNumber span": {
                        color: "grey.300 !important",
                        opacity: 0.5,
                      },
                    },

                    // Hover ngày
                    "& .rdrDayHoverPreview": {
                      borderRadius: "100% !important",
                      top: "5px !important",
                      bottom: "5px !important",
                      left: "5px !important",
                      right: "5px !important",
                      border: "2px solid",
                      borderColor: "primary.light",
                      background: "rgba(25, 118, 210, 0.05)",
                      boxSizing: "border-box",
                    },

                    // Text cho ngày được chọn
                    "& .rdrStartEdge ~ .rdrDayNumber span, & .rdrEndEdge ~ .rdrDayNumber span": {
                      color: "#fff !important",
                      fontWeight: 600,
                    },

                    "& .rdrInRange ~ .rdrDayNumber span": {
                      color: "primary.main !important",
                      fontWeight: 600,
                    },

                    "& .rdrDayToday .rdrDayNumber span::after": {
                      display: "none",
                    },
                  }}
                >
                  <DateRangePicker
                    onChange={(item) => setDateRange([item.selection])}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={isMobile ? 1 : 2}
                    ranges={dateRange}
                    direction="horizontal"
                    locale={viLocale}
                    rangeColors={[theme.palette.primary.main]}
                    minDate={new Date()}
                    staticRanges={[]}
                    inputRanges={[]}
                    preventSnapToSelection={true}
                  />
                </Box>
              </Paper>
            )} */}

            <ServiceTabs
              serviceId={id}
              rooms={rooms}
              menus={menus}
              tours={tours}
              tickets={tickets}
              reviews={reviews}
              // bookingDates={dateRange[0]}
              onRefresh={() => fetchAllData(true)}
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
