import { Box, Card, CardMedia, Typography } from "@mui/material";

const CategoryCard = ({ name, image }) => {
  return (
    <Box sx={{ flexShrink: 0, width: 192 }}>
      <Card sx={{ height: 256, borderRadius: 2, overflow: "hidden", mb: 1 }}>
        <CardMedia
          component="img"
          image={image}
          alt={name}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Card>
      <Typography
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "0.875rem",
          letterSpacing: 1,
        }}
      >
        {name}
      </Typography>
    </Box>
  );
};

export default CategoryCard;
