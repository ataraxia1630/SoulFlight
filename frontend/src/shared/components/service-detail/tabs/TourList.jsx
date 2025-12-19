import { AccessTime, AddShoppingCart, Event, Map as MapIcon, People } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import formatPrice from "@/shared/utils/FormatPrice";
import { formatDateTime, getDurationText } from "@/shared/utils/formatDate";

const ToursList = ({ tours }) => {
  if (!tours || tours.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Không có tour nào
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", flex: 1 }}>
      {tours.map((tour) => {
        const isAvailable = tour.status === "AVAILABLE";

        return (
          <Card
            key={tour.id}
            variant="outlined"
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: 2,
              width: "100%",
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    {tour.name}
                  </Typography>
                  <Chip
                    label={isAvailable ? "Sẵn sàng" : "Ngưng cung cấp"}
                    size="small"
                    color={isAvailable ? "success" : "default"}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                <Box sx={{ textAlign: "right", minWidth: 120 }}>
                  <Typography variant="h5" fontWeight={700} color="primary.main">
                    {formatPrice(tour.total_price)}
                  </Typography>
                </Box>
              </Box>

              {tour.description && (
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {tour.description}
                </Typography>
              )}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: 2,
                  mb: 3,
                  py: 1.5,
                  px: 0,
                  borderTop: "1px dashed",
                  borderBottom: "1px dashed",
                  borderColor: "grey.300",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "flex-start", sm: "center" },
                    gap: 1,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <AccessTime color="action" fontSize="small" />
                  <Typography variant="body2" fontWeight={500}>
                    {getDurationText(tour.duration_hours)}
                  </Typography>
                </Box>

                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ display: { xs: "none", sm: "block" } }}
                />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "flex-start", sm: "center" },
                    gap: 1,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <People color="action" fontSize="small" />
                  <Typography variant="body2" fontWeight={500}>
                    Còn{" "}
                    <Box component="span" fontWeight={700} color="primary.main">
                      {tour.available_slots}
                    </Box>{" "}
                    chỗ
                  </Typography>
                </Box>

                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ display: { xs: "none", sm: "block" } }}
                />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "flex-start", sm: "center" },
                    gap: 1,
                    flex: 2,
                    minWidth: 0,
                  }}
                >
                  <Event color="action" fontSize="small" />{" "}
                  <Box sx={{ textAlign: { xs: "left", sm: "left" } }}>
                    {" "}
                    <Typography variant="body2" fontWeight={600}>
                      {formatDateTime(tour.start_time)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      (Kết thúc: {formatDateTime(tour.end_time)})
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <MapIcon color="primary" />
                  <Typography variant="h4" fontWeight={650}>
                    Lịch trình di chuyển ({tour.places?.length || 0} điểm)
                  </Typography>
                </Box>

                {!tour.places || tour.places.length === 0 ? (
                  <Typography variant="body2" fontStyle="italic" color="text.secondary">
                    Chưa có thông tin địa điểm chi tiết.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {tour.places.map((place, index) => (
                      <Box
                        key={place.place_id || index}
                        sx={{
                          display: "flex",
                          gap: 2,
                          p: 2,
                          bgcolor: "grey.50",
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "grey.200",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          src={place.image ? place.image : ""}
                          variant="rounded"
                          sx={{
                            width: 80,
                            height: 80,
                            bgcolor: "primary.light",
                            color: "primary.contrastText",
                            fontWeight: "bold",
                            fontSize: "16px",
                          }}
                        >
                          {index + 1}
                        </Avatar>

                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" fontWeight={600}>
                            {place.name}
                          </Typography>
                          {place.start_time && (
                            <Typography
                              variant="caption"
                              color="primary"
                              fontWeight="bold"
                              fontSize="12px"
                            >
                              {place.start_time}
                              {place.end_time ? ` - ${place.end_time}` : ""}
                            </Typography>
                          )}
                          <Typography variant="body2" color="text.secondary">
                            {place.description}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>

              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddShoppingCart />}
                  disabled={!isAvailable}
                  onClick={() => console.log("Add to cart:", tour.id)}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Thêm vào giỏ
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  disabled={!isAvailable}
                  onClick={() => console.log("Book now:", tour.id)}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  {isAvailable ? "Đặt tour ngay" : "Đã hết / Ngưng"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default ToursList;
