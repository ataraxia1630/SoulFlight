import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoIcon from "@mui/icons-material/Info";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Container,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingState from "@/shared/components/LoadingState";
import PlaceService from "@/shared/services/place.service";
import formatPrice from "@/shared/utils/FormatPrice";

const DAYS_MAP = {
  monday: "Thứ 2",
  tuesday: "Thứ 3",
  wednesday: "Thứ 4",
  thursday: "Thứ 5",
  friday: "Thứ 6",
  saturday: "Thứ 7",
  sunday: "Chủ nhật",
};
const DAYS_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const WeeklyScheduleTooltip = ({ openingHours }) => {
  if (!openingHours) return "Chưa cập nhật lịch";

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" fontWeight="bold" mb={1} borderBottom="1px solid #ccc">
        Lịch hoạt động
      </Typography>
      {DAYS_ORDER.map((day) => {
        const slots = openingHours[day] || [];
        return (
          <Box key={day} display="flex" justifyContent="space-between" gap={3} mb={0.5}>
            <Typography variant="caption" fontWeight="bold" color="inherit">
              {DAYS_MAP[day]}:
            </Typography>
            <Box>
              {slots.length > 0 ? (
                slots.map((s, i) => (
                  <Typography key={`${s.open}-${s.close}-${i}`} variant="caption" display="block">
                    {s.open} - {s.close}
                  </Typography>
                ))
              ) : (
                <Typography variant="caption" color="error.light">
                  Đóng cửa
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

const getTodayTime = (openingHours) => {
  if (!openingHours) return { text: "Đang cập nhật", isOpen: false };
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const todayKey = days[new Date().getDay()];
  const todaySlots = openingHours[todayKey];

  if (!todaySlots || todaySlots.length === 0) return { text: "Đóng cửa hôm nay", isOpen: false };
  return { text: `${todaySlots[0].open} - ${todaySlots[0].close}`, isOpen: true };
};

const ExplorePlaces = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await PlaceService.getAll();
        setPlaces(res.data);
        setFilteredPlaces(res.data);
      } catch {
        console.error("Failed to load places");
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = places.filter(
      (place) =>
        place.name.toLowerCase().includes(lowerTerm) ||
        place.address?.toLowerCase().includes(lowerTerm),
    );
    setFilteredPlaces(filtered);
  }, [searchTerm, places]);

  const handleCardClick = (id) => {
    navigate(`/place/${id}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 5 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Khám phá điểm đến
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tìm kiếm những địa điểm thú vị cho hành trình của bạn
          </Typography>
        </Box>

        <TextField
          placeholder="Tìm kiếm địa điểm (tên, địa chỉ...)"
          variant="outlined"
          fullWidth
          sx={{
            bgcolor: "background.paper",
            maxWidth: "100%",
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            },
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <LoadingState />
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {filteredPlaces.length === 0 ? (
            <Box sx={{ width: "100%", textAlign: "center", mt: 4 }}>
              <Typography color="text.secondary">Không tìm thấy địa điểm nào.</Typography>
            </Box>
          ) : (
            filteredPlaces.map((place) => {
              const todayInfo = getTodayTime(place.opening_hours);

              return (
                <Box
                  key={place.id}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 12px)",
                      md: "calc(33.333% - 16px)",
                    },
                  }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      boxShadow: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[8],
                        borderColor: "primary.light",
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleCardClick(place.id)}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          pt: "60%",
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={
                            place.thumbnail ||
                            place.main_image ||
                            "https://via.placeholder.com/400x300"
                          }
                          alt={place.name}
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <Chip
                          label={place.entry_fee ? formatPrice(place.entry_fee) : "Miễn phí"}
                          size="small"
                          color={place.entry_fee ? "primary" : "success"}
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            fontWeight: "bold",
                            backdropFilter: "blur(4px)",
                            bgcolor: place.entry_fee
                              ? "rgba(25, 118, 210, 0.9)"
                              : "rgba(46, 125, 50, 0.9)",
                            color: "white",
                          }}
                        />
                      </Box>

                      <CardContent sx={{ flexGrow: 1, width: "100%", p: 2.5 }}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          fontWeight="bold"
                          sx={{
                            fontSize: "1.25rem",
                            lineHeight: 1.3,
                            display: "-webkit-box",
                            overflow: "hidden",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 1,
                          }}
                        >
                          {place.name}
                        </Typography>

                        <Stack spacing={1.5} mt={1}>
                          <Box display="flex" gap={1} alignItems="flex-start">
                            <LocationOnIcon fontSize="small" color="action" sx={{ mt: 0.3 }} />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: "-webkit-box",
                                overflow: "hidden",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
                                height: "42px",
                              }}
                            >
                              {place.address || "Chưa cập nhật địa chỉ"}
                            </Typography>
                          </Box>

                          <Tooltip
                            title={<WeeklyScheduleTooltip openingHours={place.opening_hours} />}
                            arrow
                            placement="top"
                          >
                            <Box
                              display="flex"
                              gap={1}
                              alignItems="center"
                              sx={{
                                cursor: "pointer",
                                width: "fit-content",
                                p: 0.5,
                                borderRadius: 1,
                                "&:hover": { bgcolor: "action.hover" },
                              }}
                            >
                              <AccessTimeIcon fontSize="small" color="action" />
                              <Typography
                                variant="body2"
                                fontWeight={500}
                                sx={{
                                  color: todayInfo.isOpen ? "success.main" : "error.main",
                                }}
                              >
                                {todayInfo.text}
                              </Typography>
                              <InfoIcon sx={{ fontSize: 14, color: "text.disabled", ml: 0.5 }} />
                            </Box>
                          </Tooltip>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Box>
              );
            })
          )}
        </Box>
      )}
    </Container>
  );
};

export default ExplorePlaces;
