import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import {
  alpha,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingState from "@/shared/components/LoadingState";
import PlaceService from "@/shared/services/place.service";
import formatPrice from "@/shared/utils/FormatPrice";
import toast from "@/shared/utils/toast";

const DAYS_VI = {
  monday: "Thứ 2",
  tuesday: "Thứ 3",
  wednesday: "Thứ 4",
  thursday: "Thứ 5",
  friday: "Thứ 6",
  saturday: "Thứ 7",
  sunday: "Chủ nhật",
};

const DAYS_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const PlaceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await PlaceService.getById(id);
        setPlace(res.data);
        setActiveImage(res.data.main_image || res.data.images?.[0]?.url);
      } catch {
        toast.error("Lỗi tải chi tiết địa điểm");
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id]);

  const handleOpenMap = () => {
    if (!place?.address && !place?.name) return;
    const query = encodeURIComponent(place.address || place.name);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <LoadingState />;

  if (!place) return <Container sx={{ py: 5 }}>Không tìm thấy địa điểm</Container>;

  return (
    <Box sx={{ pb: 8 }}>
      <Container maxWidth="lg">
        <Box mb={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              color: "text.primary",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            Quay lại
          </Button>
        </Box>

        <Box
          sx={{
            height: { xs: 300, md: 500 },
            width: "100%",
            borderRadius: 3,
            overflow: "hidden",
            backgroundImage: `url(${activeImage || "https://via.placeholder.com/800x500"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            mb: 4,
            boxShadow: theme.shadows[3],
            "&::before": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "70%",
              background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              bottom: 30,
              left: 0,
              px: { xs: 2, md: 4 },
              width: "100%",
            }}
          >
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                color: "white",
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                fontSize: { xs: "1.8rem", md: "3rem" },
                mb: 1,
              }}
            >
              {place.name}
            </Typography>
            <Stack direction="row" alignItems="center" gap={1}>
              <LocationOnIcon sx={{ color: "rgba(255,255,255,0.9)", fontSize: 20 }} />
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: { xs: "0.9rem", md: "1.2rem" },
                }}
              >
                {place.address}
              </Typography>
            </Stack>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          <Box sx={{ flex: 2, width: "100%" }}>
            {place.images && place.images.length > 0 && (
              <Stack direction="row" spacing={1.5} sx={{ overflowX: "auto", pb: 2, mb: 2 }}>
                {place.images.map((img) => (
                  <Box
                    key={img.id}
                    component="img"
                    src={img.thumbnail_url || img.url}
                    onClick={() => setActiveImage(img.url)}
                    sx={{
                      width: 100,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 2,
                      cursor: "pointer",
                      border:
                        activeImage === img.url
                          ? `3px solid ${theme.palette.primary.main}`
                          : "1px solid #eee",
                      transition: "all 0.2s",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  />
                ))}
              </Stack>
            )}

            <Box mb={4}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Giới thiệu
              </Typography>
              <Typography
                variant="body1"
                sx={{ lineHeight: 1.8, color: "text.secondary", whiteSpace: "pre-wrap" }}
              >
                {place.description || "Chưa có mô tả cho địa điểm này."}
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Box mb={4}>
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                display="flex"
                alignItems="center"
                gap={1}
              >
                <CalendarMonthIcon color="primary" /> Thời gian hoạt động
              </Typography>

              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden", mt: 2 }}>
                {DAYS_ORDER.map((dayKey, index) => {
                  const slots = place.opening_hours?.[dayKey] || [];
                  const isClosed = slots.length === 0;
                  const todayIndexInArray = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
                  const isToday = index === todayIndexInArray;

                  return (
                    <Box
                      key={dayKey}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        bgcolor: isToday ? alpha(theme.palette.primary.main, 0.08) : "inherit",
                        borderLeft: isToday
                          ? `4px solid ${theme.palette.primary.main}`
                          : "4px solid transparent",
                        borderBottom: index !== DAYS_ORDER.length - 1 ? "1px dashed #eee" : "none",
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          fontWeight={isToday ? "bold" : "normal"}
                          color={isToday ? "primary.main" : "text.primary"}
                        >
                          {DAYS_VI[dayKey]}
                        </Typography>
                        {isToday && (
                          <Chip
                            label="Hôm nay"
                            size="small"
                            color="primary"
                            sx={{ height: 20, fontSize: "0.65rem" }}
                          />
                        )}
                      </Box>

                      <Box>
                        {isClosed ? (
                          <Typography
                            variant="body2"
                            color="error.main"
                            fontWeight="medium"
                            sx={{ fontStyle: "italic" }}
                          >
                            Đóng cửa
                          </Typography>
                        ) : (
                          slots.map((s, i) => (
                            <Typography
                              key={`${s.open}-${s.close}-${i}`}
                              variant="body2"
                              fontWeight={500}
                              textAlign="right"
                            >
                              {s.open} - {s.close}
                            </Typography>
                          ))
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Paper>
            </Box>
          </Box>

          <Box sx={{ flex: 1, width: "100%", minWidth: 300 }}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3, position: "sticky", top: 100 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Giá vé tham quan
                  </Typography>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {place.entry_fee ? `${formatPrice(place.entry_fee)}` : "Miễn phí"}
                  </Typography>
                </Box>

                <Divider />

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<MapIcon />}
                  fullWidth
                  onClick={handleOpenMap}
                  sx={{
                    borderRadius: 2,
                    borderWidth: 2,
                    "&:hover": { borderWidth: 2 },
                    textTransform: "none",
                  }}
                >
                  Xem bản đồ
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PlaceDetailsPage;
