import { Box, Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const DestinationCard = ({ title, description, image }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        position: "relative",
        height: 280,
        flex: 1,
        borderRadius: 3,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          "& img": {
            transform: "scale(1.08)",
          },
        },
      }}
    >
      <CardMedia
        component="img"
        image={image}
        alt={title}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.5s ease",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
        }}
      />
      <CardContent
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          color: "white",
          pb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mb: 2 }}>
          {description}
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: theme.palette.text.contrast,
            color: theme.palette.text.primary,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: "none",
            fontSize: "0.875rem",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.9)",
            },
          }}
        >
          Explore
        </Button>
      </CardContent>
    </Card>
  );
};

export default DestinationCard;
