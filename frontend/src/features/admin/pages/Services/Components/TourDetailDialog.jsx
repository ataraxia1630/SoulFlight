import {
  AccessTime,
  Close,
  Event,
  Group,
  Info,
  LocationOn,
  Map as MapIcon,
  RateReview,
  Star,
  Store,
  TourOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ProviderCard from "@/shared/components/service-detail/ProviderCard";
import ReviewsList from "@/shared/components/service-detail/tabs/ReviewList";
import formatPrice from "@/shared/utils/FormatPrice";
import { formatDate, formatDateTime, getDurationText } from "@/shared/utils/formatDate";

const TourDetailDialog = ({ open, onClose, data, service, provider, reviews }) => {
  const [tabValue, setTabValue] = useState(0);

  if (!data) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          overflowY: "hidden",
          borderRadius: 3,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        component="div"
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "grey.200",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box>
          <Typography variant="h6" component="div" fontWeight={700}>
            Chi tiết tour
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{ maxWidth: 300, display: "block" }}
          >
            {data.name}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      {/* tab */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "white", px: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 48,
            "& .MuiTab-root": {
              minHeight: 48,
              textTransform: "none",
              fontWeight: 500,
            },
            "& .MuiTabs-flexContainer": {
              justifyContent: "space-between",
            },
          }}
        >
          <Tab icon={<TourOutlined fontSize="small" />} iconPosition="start" label="Lịch trình" />
          <Tab icon={<Info fontSize="small" />} iconPosition="start" label="Dịch vụ" />
          <Tab icon={<Store fontSize="small" />} iconPosition="start" label="Nhà cung cấp" />
          <Tab icon={<RateReview fontSize="small" />} iconPosition="start" label={`Đánh giá`} />
        </Tabs>
      </Box>

      <DialogContent
        sx={{
          p: 0,
          minHeight: 450,
          overflowX: "hidden",

          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: "10px",
            transition: "all 0.3s ease",
          },
          "&:hover::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(0,0,0,0.4)",
          },
        }}
      >
        {/* tab lịch trình */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Chip
                label={data.status === "AVAILABLE" ? "Sẵn sàng" : "Ngưng"}
                color={data.status === "AVAILABLE" ? "success" : "default"}
                sx={{ fontWeight: 600, fontSize: "14px" }}
              />

              <Typography variant="h5" color="primary.main" fontWeight={800}>
                {formatPrice(data.total_price)}
              </Typography>
            </Box>

            <Paper
              sx={{
                bgcolor: "white",
                py: 2,
                borderRadius: 3,
                mb: 3,
                border: "1.5px solid #ddd",
              }}
              elevation={0}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                divider={
                  <Divider orientation="vertical" flexItem sx={{ border: "1px solid #ddd" }} />
                }
              >
                <Box textAlign="center" flex={1}>
                  <AccessTime color="action" fontSize="small" sx={{ mb: 0.5 }} />
                  <Typography variant="caption" display="block" color="text.secondary">
                    Thời lượng
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {getDurationText(data.duration_hours)}
                  </Typography>
                </Box>
                <Box textAlign="center" flex={1}>
                  <Group color="action" fontSize="small" sx={{ mb: 0.5 }} />
                  <Typography variant="caption" display="block" color="text.secondary">
                    Chỗ trống
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {data.available_slots}/{data.max_participants}
                  </Typography>
                </Box>
                <Box textAlign="center" flex={1}>
                  <Event color="action" fontSize="small" sx={{ mb: 0.5 }} />
                  <Typography variant="caption" display="block" color="text.secondary">
                    Khởi hành
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatDateTime(data.start_time)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: "1rem",
                mb: 2.5,
              }}
            >
              <MapIcon color="primary" fontSize="small" /> Lịch trình di chuyển
            </Typography>
            <Box sx={{ pl: 1 }}>
              {data.places?.map((place, index) => {
                const mainImg = place.images?.find((i) => i.is_main) || place.images?.[0];
                return (
                  <Box
                    key={place.id || index}
                    sx={{ display: "flex", gap: 2, mb: 3, position: "relative" }}
                  >
                    {/* line nối (trừ item cuối) */}
                    {index < data.places.length - 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          left: 20,
                          top: 40,
                          bottom: -24,
                          width: 2,
                          bgcolor: "grey.300",
                          zIndex: 0,
                        }}
                      />
                    )}

                    <Avatar
                      variant="rounded"
                      src={mainImg?.url}
                      sx={{
                        width: 42,
                        height: 42,
                        zIndex: 1,
                        border: "2px solid white",
                        boxShadow: 1,
                      }}
                    >
                      {index + 1}
                    </Avatar>

                    <Box
                      sx={{
                        flex: 1,
                        bgcolor: "white",
                        p: 1.5,
                        borderRadius: 2,
                        border: "1.5px solid #eee",
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={700}>
                        {place.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="primary"
                        fontWeight={600}
                        display="block"
                        mb={0.5}
                      >
                        {place.start_time} - {place.end_time}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.85rem" }}
                      >
                        {place.description}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        {/* tab thông tin dịch vụ */}
        {tabValue === 1 && (
          <Box sx={{ bgcolor: "white", p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 2,
                mb: 1,
              }}
            >
              <Box>
                <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1.3 }}>
                  {service?.name}
                </Typography>

                {service?.location && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.5,
                      color: "text.secondary",
                    }}
                  >
                    <LocationOn fontSize="small" />
                    <Typography variant="body2">{service.location}</Typography>
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  bgcolor: "grey.100",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1.5,
                }}
              >
                <Star sx={{ color: "orange", fontSize: 18 }} />
                <Typography fontWeight={700}>{service?.rating || 4.5}</Typography>
              </Box>
            </Box>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                my: 3,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                textTransform="uppercase"
              >
                Khoảng giá tham khảo
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                {formatPrice(service?.price_min) || 0}
                {" - "}
                {formatPrice(service?.price_max) || 0}
              </Typography>
            </Paper>

            <Box>
              <Typography variant="subtitle2" mb={1}>
                Giới thiệu
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.7, textAlign: "justify" }}
              >
                {service?.description || "Chưa có mô tả"}
              </Typography>
            </Box>

            <Divider sx={{ mt: 4, mb: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Typography variant="caption" color="text.disabled">
                Cập nhật lần cuối: {formatDate(service?.updated_at)}
              </Typography>
            </Box>
          </Box>
        )}

        {/* tab provider */}
        {tabValue === 2 && (
          <Box sx={{ px: 3 }}>
            <ProviderCard provider={provider} />
          </Box>
        )}

        {/* tab review */}
        {tabValue === 3 && (
          <Box sx={{ px: 3 }}>
            <ReviewsList reviews={reviews || []} />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TourDetailDialog;
