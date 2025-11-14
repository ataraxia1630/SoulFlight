import { Hotel, Pets } from "@mui/icons-material";
import { Box, Card, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import formatPrice from "@/shared/utils/formatPrice";

const RoomCard = ({ data }) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={data.image || "/placeholder.jpg"}
          alt={data.name}
          sx={{ objectFit: "cover" }}
        />
        {data.pet_allowed && (
          <Chip
            icon={<Pets sx={{ fontSize: 16 }} />}
            label="Pet Friendly"
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: "white",
              fontWeight: 600,
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: 18,
            fontWeight: 600,
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {data.name}
        </Typography>

        {data.service?.name && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Hotel sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: 13 }}>
              {data.service.name}
            </Typography>
          </Box>
        )}

        {data.facilities && data.facilities.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {data.facilities.slice(0, 3).map((facility, idx) => (
              <Chip
                key={facility.id || idx}
                label={facility}
                size="small"
                sx={{
                  height: 24,
                  fontSize: 11,
                  bgcolor: "grey.100",
                  color: "text.secondary",
                }}
              />
            ))}
            {data.facilities.length > 3 && (
              <Chip
                label={`+${data.facilities.length - 3}`}
                size="small"
                sx={{
                  height: 24,
                  fontSize: 11,
                  bgcolor: "grey.100",
                  color: "text.secondary",
                }}
              />
            )}
          </Box>
        )}

        {data.service?.tags && data.service.tags.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: "auto" }}>
            {data.service.tags.slice(0, 2).map((tag, idx) => (
              <Chip
                key={tag.id || idx}
                label={tag.name}
                size="small"
                sx={{
                  height: 24,
                  fontSize: 11,
                  bgcolor: "primary.50",
                  color: "primary.main",
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        )}

        <Box sx={{ mt: 1 }}>
          <Typography
            variant="h5"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            {formatPrice(data.price_per_night)}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 12 }}>
            per night
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
