import { AccessTime, AddShoppingCart, AttachMoney, Info, LocationOn } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import formatPrice from "@/shared/utils/FormatPrice";

const TicketsList = ({ tickets }) => {
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
                const dayMap = {
                  monday: "Thứ 2",
                  tuesday: "Thứ 3",
                  wednesday: "Thứ 4",
                  thursday: "Thứ 5",
                  friday: "Thứ 6",
                  saturday: "Thứ 7",
                  sunday: "CN",
                };
                const timeStr = Array.isArray(times)
                  ? times.map((t) => `${t.open}-${t.close}`).join(", ")
                  : `${times.open} - ${times.close}`;
                return (
                  <Typography key={day} variant="caption" display="block">
                    <strong>{dayMap[day.toLowerCase()] || day}:</strong> {timeStr}
                  </Typography>
                );
              })}
            </Box>
          }
          arrow
          placement="top"
        >
          <span
            style={{
              cursor: "pointer",
              color: "#1976d2",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            Xem lịch chi tiết <Info sx={{ fontSize: 16 }} />
          </span>
        </Tooltip>
      );
    }
    return "Liên hệ";
  };

  if (!tickets || tickets.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Không có vé nào
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {tickets.map((ticket) => {
        const isAvailable = ticket.status === "AVAILABLE";

        return (
          <Card
            key={ticket.id}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              mb: 3,
              borderRadius: 2,
              boxShadow: 2,
              overflow: "hidden",
            }}
          >
            <CardMedia
              component="img"
              sx={{
                width: { xs: "100%", sm: 240 },
                height: { xs: 200, sm: "auto" },
                objectFit: "cover",
              }}
              image={ticket.place?.main_image || "https://via.placeholder.com/300?text=No+Image"}
              alt={ticket.place?.name}
            />

            <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <CardContent sx={{ flex: "1 0 auto", p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {ticket.name}
                    </Typography>
                    <Chip
                      label={isAvailable ? "Đang mở bán" : "Tạm ngưng / Hết vé"}
                      color={isAvailable ? "success" : "default"}
                      size="small"
                      sx={{ mt: 0.5, fontWeight: 600 }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    fontWeight={700}
                    sx={{ minWidth: "max-content", ml: 2 }}
                  >
                    {ticket.price?.toLocaleString()}đ
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {ticket.description}
                </Typography>

                <Divider sx={{ borderStyle: "dashed", my: 1 }} />

                {ticket.place && (
                  <Stack spacing={1} mt={1}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <LocationOn color="action" sx={{ fontSize: 18, mt: 0.3 }} />
                      <Typography variant="body2" color="text.secondary">
                        <strong>{ticket.place.name}</strong> - {ticket.place.address}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTime color="action" sx={{ fontSize: 18 }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatOpeningHours(ticket.place.opening_hours)}
                      </Typography>
                    </Box>

                    {ticket.place.entry_fee > 0 && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AttachMoney color="action" sx={{ fontSize: 18 }} />
                        <Typography variant="body2" color="text.secondary">
                          Vé cổng: {formatPrice(ticket.place.entry_fee)}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                )}
              </CardContent>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  p: 2,
                  pt: 0,
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddShoppingCart />}
                  disabled={!isAvailable}
                >
                  Thêm vào giỏ
                </Button>
                <Button variant="contained" size="small" disabled={!isAvailable}>
                  {isAvailable ? "Mua ngay" : "Tạm ngưng"}
                </Button>
              </Box>
            </Box>
          </Card>
        );
      })}
    </Box>
  );
};

export default TicketsList;
