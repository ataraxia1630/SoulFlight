import { Box, Button, Card, CardContent, CardMedia, Typography } from "@mui/material";

const VoucherCard = ({ code, discount, image }) => {
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
          color: "white",
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            SEOUL TOUR- {code}
          </Typography>
          <Typography variant="caption" sx={{ color: "grey.300" }}>
            Sale Up To
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: "4rem", fontWeight: "bold", mb: 2 }}>
            {discount}
            <Box component="span" sx={{ fontSize: "1.5rem", color: "red", ml: 1 }}>
              %OFF
            </Box>
          </Typography>
          <Button
            variant="outlined"
            sx={{
              borderColor: "white",
              color: "white",
              "&:hover": {
                bgcolor: "white",
                color: "grey.900",
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
