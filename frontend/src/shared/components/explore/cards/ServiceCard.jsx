import { Favorite, FavoriteBorder, LocationOn, Star } from "@mui/icons-material";
import { Box, Card, CardContent, CardMedia, Chip, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ data }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleClick = () => {
    navigate(`/services/${data.id}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    //Add API call to save wishlist state
  };

  return (
    <Card
      onClick={handleClick}
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

        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.2,
          }}
        >
          {data.type && (
            <Chip
              label={data.type}
              size="small"
              sx={{
                bgcolor: "white",
                fontWeight: 600,
              }}
            />
          )}

          <IconButton
            onClick={handleWishlistClick}
            sx={{
              bgcolor: "white",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "white",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
              p: 0.5,
            }}
            size="small"
          >
            {isWishlisted ? (
              <Favorite sx={{ color: "error.main", fontSize: 20 }} />
            ) : (
              <FavoriteBorder sx={{ color: "text.secondary", fontSize: 20 }} />
            )}
          </IconButton>
        </Box>
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

        {data.location && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: 13 }}>
              {data.location}
            </Typography>
          </Box>
        )}

        {data.rating && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Star sx={{ fontSize: 18, color: "#FFB800" }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {data.rating}
            </Typography>
          </Box>
        )}

        {data.tags && data.tags.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: "auto" }}>
            {data.tags.slice(0, 3).map((tag, idx) => (
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

        {data.price_range && (
          <Typography
            variant="body1"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              fontSize: 16,
              mt: 1,
            }}
          >
            {data.price_range}
          </Typography>
        )}

        {data.provider?.name && (
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 12 }}>
            by {data.provider.name}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
