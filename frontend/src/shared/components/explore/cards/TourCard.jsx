import { Explore, LocationOn, Schedule } from "@mui/icons-material";
import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import formatPrice from "@/shared/utils/formatPrice";

const TourCard = ({ data }) => {
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
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            icon={<Explore sx={{ fontSize: 16 }} />}
            label="Tour Package"
            size="small"
            color="primary"
            sx={{ fontWeight: 600 }}
          />
        </Box>

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

        {data.duration && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Schedule sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: 13 }}>
              {`${data.duration} hours`}
            </Typography>
          </Box>
        )}

        {data.places && data.places.length > 0 && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
              <LocationOn sx={{ fontSize: 16, color: "primary.main" }} />
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                {data.places.length} Destinations
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {data.places.slice(0, 2).map((place, idx) => (
                <Chip
                  key={place.id || idx}
                  label={place}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: 11,
                    bgcolor: "grey.100",
                    color: "text.secondary",
                  }}
                />
              ))}
              {data.places.length > 2 && (
                <Chip
                  label={`+${data.places.length - 2} more`}
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
          </Box>
        )}

        {data.service?.name && (
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 12 }}>
            Organized by {data.service.name}
          </Typography>
        )}

        {data.service?.tags && data.service.tags.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: "auto" }}>
            {data.service.tags.map((tag, idx) => (
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
            {formatPrice(data.total_price)}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 12 }}>
            total package price
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TourCard;
