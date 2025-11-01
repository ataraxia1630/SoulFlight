import { Box, Button, Card, CardContent, CardMedia, Typography } from "@mui/material";

const VoucherCard = ({ title, code, discount, image }) => {
  return (
    <Card
      sx={{
        position: "relative",
        flexShrink: 0,
        width: 320,
        height: 256,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <CardMedia
        component="img"
        image={image}
        alt="Voucher"
        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
        }}
      />
      <CardContent
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "text.contrast",
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ mb: 0.5, color: "text.contrast", textTransform: "uppercase" }}
          >
            {title} - {code}
          </Typography>
          <Typography variant="caption" sx={{ color: "border.light" }}>
            Sale Up To
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: "70px", fontWeight: "bold", mb: 2 }}>
            {discount}
            <Box component="span" sx={{ fontSize: "29px", color: "red", ml: 1 }}>
              %OFF
            </Box>
          </Typography>
          <Button
            variant="outlined"
            sx={{
              borderColor: "border.light",
              color: "text.contrast",
              "&:hover": {
                bgcolor: "background.default",
                color: "text.tertiary",
              },
            }}
          >
            Explore
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VoucherCard;
