import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Box, Card, Chip, Divider, Grid, Typography, useTheme } from "@mui/material";

export default function RoomCard() {
  const theme = useTheme();

  const bookingData = {
    quantity: 1,
    roomName: "Deluxe Ocean View King Bed",
    maxAdults: 2,
    maxChildren: 1,
    checkInDate: "15 Th10, 2023",
    checkInTime: "14:00",
    checkOutDate: "18 Th10, 2023",
    checkOutTime: "12:00",
    pricePerNight: 1500000,
    nights: 3,
    totalPrice: 4500000,
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        elevation={2}
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          maxWidth: 800,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Grid container sx={{ width: "100%" }}>
          <Grid size={9} sx={{ p: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={`x${bookingData.quantity}`}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: "bold", borderRadius: 1, height: 24 }}
                />
                <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                  {bookingData.roomName}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Max: <strong>{bookingData.maxAdults}</strong> người lớn
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Max: <strong>{bookingData.maxChildren}</strong> trẻ em
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Box sx={{ color: "text.secondary", mt: 0.5 }}>
                    <CalendarMonthIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Nhận phòng
                    </Typography>
                    <Typography variant="body2" color="text.primary" fontWeight={600}>
                      {bookingData.checkInTime} - {bookingData.checkInDate}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Box sx={{ color: "text.secondary", mt: 0.5 }}>
                    <AccessTimeIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Trả phòng
                    </Typography>
                    <Typography variant="body2" color="text.primary" fontWeight={600}>
                      {bookingData.checkOutTime} - {bookingData.checkOutDate}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid
            size={3}
            sx={{
              p: 2,
              borderLeft: `1px dashed ${theme.palette.divider}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end",
              backgroundColor: "#fafafa",
              textAlign: "right",
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block">
              Giá 1 đêm
            </Typography>
            <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
              {formatCurrency(bookingData.pricePerNight)}
            </Typography>

            <Divider sx={{ my: 1, width: "100%" }} />

            <Typography variant="caption" color="text.secondary" display="block">
              Tổng cộng ({bookingData.nights} đêm)
            </Typography>
            <Typography variant="h6" fontWeight={700} color="primary.main">
              {formatCurrency(bookingData.totalPrice)}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
