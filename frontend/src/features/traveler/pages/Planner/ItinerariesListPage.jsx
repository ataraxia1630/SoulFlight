import {
  Add,
  AttachMoney,
  CalendarToday,
  Delete,
  Edit,
  Favorite,
  //   MoreVert,
  Visibility,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { itineraryAPI } from "../../services/itinerary.service";

const STATUS_LABELS = {
  DRAFT: { label: "Bản nháp", color: "default" },
  PUBLISHED: { label: "Đã xuất bản", color: "success" },
  ARCHIVED: { label: "Đã lưu trữ", color: "warning" },
};

export default function ItinerariesListPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const loadItineraries = useCallback(async () => {
    setLoading(true);
    try {
      const params = activeTab !== "all" ? { status: activeTab.toUpperCase() } : {};
      const data = await itineraryAPI.getAll(params);
      setItineraries(data.itineraries);
      console.log(data.itineraries);
    } catch (error) {
      console.error("Load itineraries error:", error);
      enqueueSnackbar("Không thể tải lịch trình", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [activeTab, enqueueSnackbar]);

  useEffect(() => {
    loadItineraries();
  }, [loadItineraries]);

  const handleDelete = async (id, event) => {
    event.stopPropagation(); // Prevent card click
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch trình này?")) {
      try {
        await itineraryAPI.delete(id);
        setItineraries((prev) => prev.filter((it) => it.id !== id));
        enqueueSnackbar("Đã xóa lịch trình", { variant: "success" });
      } catch (_error) {
        enqueueSnackbar("Xóa thất bại", { variant: "error" });
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getDaysCount = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Lịch trình của tôi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý các chuyến đi đã lên kế hoạch
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            size="large"
            onClick={() => navigate("/travel-planner")}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
              },
            }}
          >
            Tạo lịch trình mới
          </Button>
        </Stack>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={activeTab} onChange={(_e, value) => setActiveTab(value)}>
            <Tab label="Tất cả" value="all" />
            <Tab label="Bản nháp" value="draft" />
            <Tab label="Đã xuất bản" value="published" />
            <Tab label="Đã lưu trữ" value="archived" />
          </Tabs>
        </Box>

        {/* Loading */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <CircularProgress size={48} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Đang tải lịch trình...
            </Typography>
          </Box>
        ) : itineraries.length === 0 ? (
          <Alert severity="info">
            Chưa có lịch trình nào. Hãy tạo lịch trình đầu tiên của bạn!
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {itineraries.map((itinerary, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={itinerary.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      cursor: "pointer",
                      "&:hover": {
                        boxShadow: 6,
                        transform: "translateY(-4px)",
                        transition: "all 0.3s ease",
                      },
                    }}
                    onClick={() => navigate(`/itinerary/${itinerary.id}`)}
                  >
                    {/* Favorite Badge */}
                    {itinerary.is_favorite && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          zIndex: 1,
                          bgcolor: "rgba(255,255,255,0.9)",
                          borderRadius: "50%",
                          p: 0.5,
                        }}
                      >
                        <Favorite color="error" />
                      </Box>
                    )}

                    {/* Cover Image */}
                    <CardMedia
                      component="div"
                      sx={{
                        height: 200,
                        background: itinerary.cover_image_url
                          ? `url(${itinerary.cover_image_url}) center/cover`
                          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      {!itinerary.cover_image_url && (
                        <Typography variant="h4" fontWeight={700}>
                          {itinerary.destination}
                        </Typography>
                      )}
                    </CardMedia>

                    {/* Content */}
                    <CardContent sx={{ flex: 1 }}>
                      <Stack spacing={1.5}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Typography variant="h6" fontWeight={600}>
                            {itinerary.title || `${itinerary.destination} Trip`}
                          </Typography>
                          <Chip
                            label={STATUS_LABELS[itinerary.status].label}
                            color={STATUS_LABELS[itinerary.status].color}
                            size="small"
                          />
                        </Stack>

                        <Stack spacing={0.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CalendarToday fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {format(new Date(itinerary.start_date), "dd/MM/yyyy")} -{" "}
                              {format(new Date(itinerary.end_date), "dd/MM/yyyy")}
                            </Typography>
                          </Stack>

                          <Typography variant="body2" color="text.secondary">
                            📅 {getDaysCount(itinerary.start_date, itinerary.end_date)} ngày •{" "}
                            {itinerary.days?.length || 0} ngày có kế hoạch
                          </Typography>

                          {itinerary.budget && (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <AttachMoney fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {formatCurrency(itinerary.budget)}
                              </Typography>
                            </Stack>
                          )}
                        </Stack>

                        {itinerary.preferences && itinerary.preferences.length > 0 && (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap">
                            {itinerary.preferences.slice(0, 3).map((pref) => (
                              <Chip key={pref} label={pref} size="small" variant="outlined" />
                            ))}
                            {itinerary.preferences.length > 3 && (
                              <Chip
                                label={`+${itinerary.preferences.length - 3}`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Stack>
                        )}
                      </Stack>
                    </CardContent>

                    {/* Actions */}
                    <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/itinerary/${itinerary.id}`);
                        }}
                      >
                        Xem chi tiết
                      </Button>

                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/itinerary/${itinerary.id}`);
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleDelete(itinerary.id, e)}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
