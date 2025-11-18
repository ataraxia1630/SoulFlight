import { ConfirmationNumber, Place, ShoppingCart } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import formatPrice from "@/shared/utils/formatPrice";

const TicketCard = ({ data, onAddToCart }) => {
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
          image={data.place?.image || "/placeholder.jpg"}
          alt={data.place?.name || data.name}
          sx={{ objectFit: "cover" }}
        />
        <Chip
          icon={<ConfirmationNumber sx={{ fontSize: 16 }} />}
          label="Ticket"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "white",
            fontWeight: 600,
          }}
        />
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

        {data.place?.name && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Place sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: 13 }}>
              {data.place.name}
            </Typography>
          </Box>
        )}

        {data.service?.name && (
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 12 }}>
            Provided by {data.service.name}
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
            {formatPrice(data.price)}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 12 }}>
            per ticket
          </Typography>
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(data);
            }}
            sx={{ mt: 2 }}
          >
            Add to Cart
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
