import {
  AccessTime,
  AttachMoney,
  Close,
  ConfirmationNumber,
  Info,
  LocationOn,
  RateReview,
  Star,
  Store,
} from "@mui/icons-material";
import {
  Box,
  CardMedia,
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
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ProviderCard from "@/shared/components/service-detail/ProviderCard";
import ReviewsList from "@/shared/components/service-detail/tabs/ReviewList";
import formatPrice from "@/shared/utils/FormatPrice";
import { formatDate } from "@/shared/utils/formatDate";

const formatOpeningHours = (hours) => {
  if (!hours) return "Chưa cập nhật";
  if (hours.open && hours.close) return `${hours.open} - ${hours.close}`;
  if (typeof hours === "object") {
    return (
      <Tooltip
        title={
          <Box sx={{ p: 1 }}>
            {Object.entries(hours).map(([day, times]) => {
              if (!times) return null;
              const timeStr = Array.isArray(times)
                ? times.map((t) => `${t.open}-${t.close}`).join(", ")
                : `${times.open} - ${times.close}`;
              return (
                <Typography key={day} variant="caption" display="block">
                  <strong>{day}:</strong> {timeStr}
                </Typography>
              );
            })}
          </Box>
        }
        arrow
      >
        <span style={{ cursor: "pointer", color: "#1976d2", textDecoration: "underline" }}>
          Xem lịch chi tiết
        </span>
      </Tooltip>
    );
  }
  return "Liên hệ";
};

const TicketDetailDialog = ({ open, onClose, data, service, provider, reviews }) => {
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
            Chi tiết vé
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
          <Tab icon={<ConfirmationNumber fontSize="small" />} iconPosition="start" label="Vé" />
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
        {/* tab chi tiết vé*/}
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
                label={data.status === "AVAILABLE" ? "Đang bán" : "Ngưng"}
                color={data.status === "AVAILABLE" ? "success" : "default"}
                sx={{ fontWeight: 600, fontSize: "14px" }}
              />

              <Typography variant="h5" color="primary.main" fontWeight={800}>
                {formatPrice(data.price)}
              </Typography>
            </Box>

            {data.place?.main_image && (
              <CardMedia
                component="img"
                height="220"
                image={data.place.main_image}
                alt={data.name}
                sx={{
                  borderRadius: 3,
                  mb: 3,
                  objectFit: "cover",
                  border: "1.5px solid #eee",
                }}
              />
            )}

            <Typography
              variant="body2"
              color="text.secondary"
              paragraph
              sx={{ mb: 3, fontStyle: "italic" }}
            >
              {data.description}
            </Typography>

            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: "1rem",
                mb: 2,
              }}
            >
              <LocationOn color="primary" fontSize="small" /> Thông tin địa điểm
            </Typography>

            <Paper
              sx={{
                bgcolor: "white",
                p: 2,
                borderRadius: 3,
                border: "1.5px solid #ddd",
              }}
              elevation={0}
            >
              {data.place ? (
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {data.place.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {data.place.address}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderStyle: "dashed" }} />
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <AccessTime color="action" fontSize="small" />
                    <Typography variant="body2">
                      {formatOpeningHours(data.place.opening_hours)}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <AttachMoney color="action" fontSize="small" />
                    <Typography variant="body2">
                      Vé cổng tham khảo: {formatPrice(data.place.entry_fee || 0)}
                    </Typography>
                  </Box>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Không có thông tin địa điểm
                </Typography>
              )}
            </Paper>
          </Box>
        )}

        {/* tab thông tin dịch vụ*/}
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

        {/* tab provider*/}
        {tabValue === 2 && (
          <Box sx={{ px: 3 }}>
            <ProviderCard provider={provider} />
          </Box>
        )}

        {/* tab review*/}
        {tabValue === 3 && (
          <Box sx={{ px: 3 }}>
            <ReviewsList reviews={reviews || []} />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetailDialog;
