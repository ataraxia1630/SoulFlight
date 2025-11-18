import { MenuBook, Restaurant, ShoppingCart } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import formatPrice from "@/shared/utils/formatPrice";

const MenuCard = ({ data, onAddToCart }) => {
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
          image={data.cover || "/placeholder.jpg"}
          alt={data.name}
          sx={{ objectFit: "cover" }}
        />
        <Chip
          icon={<MenuBook sx={{ fontSize: 16 }} />}
          label="Menu"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "background.default",
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

        {data.service?.name && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Restaurant sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: 13 }}>
              {data.service.name}
            </Typography>
          </Box>
        )}

        {data.items && data.items.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Divider sx={{ mb: 1 }} />
            {data.items.slice(0, 3).map((item, idx) => (
              <Box
                key={item.id || idx}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 0.5,
                }}
              >
                <Typography variant="body2" sx={{ fontSize: 13, color: "text.secondary" }}>
                  {item.name}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontSize: 13, fontWeight: 600, color: "primary.main" }}
                >
                  {formatPrice(item.price)}
                </Typography>
              </Box>
            ))}

            {data.items.length > 3 && (
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: 11,
                  mt: 0.5,
                  display: "block",
                }}
              >
                +{data.items.length - 3} more items
              </Typography>
            )}
          </Box>
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
      </CardContent>
    </Card>
  );
};

export default MenuCard;
