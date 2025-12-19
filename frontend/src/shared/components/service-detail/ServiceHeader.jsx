import { LocationOn } from "@mui/icons-material";
import { Box, Card, CardContent, Chip, Rating, Typography } from "@mui/material";

const ServiceHeader = ({ service, reviews }) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
            gap: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, flex: 1 }}>
            {service.name}
          </Typography>
          {service.type && (
            <Chip label={service.type.name} color="primary" size="medium" sx={{ flexShrink: 0 }} />
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Rating value={service.rating || 0} precision={0.1} readOnly size="small" />
            <Typography variant="body1" fontWeight={600}>
              {service.rating || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({reviews.length} đánh giá)
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
          <LocationOn sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary">
            {service.location}
          </Typography>
        </Box>

        {service.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, lineHeight: 1.7 }}>
            {service.description}
          </Typography>
        )}

        {service.price_min && service.price_max && (
          <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
            <Typography variant="h6" fontWeight={600} color="primary.main">
              {service.price_min.toLocaleString("vi-VN")}đ -{" "}
              {service.price_max.toLocaleString("vi-VN")}đ
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceHeader;
