import { ChevronRight, Flight } from "@mui/icons-material";
import { Box, Container, Grid, IconButton, Paper, Typography } from "@mui/material";
import VoucherCard from "./cards/VoucherCard";

const HotVouchers = () => {
  const vouchers = [
    {
      code: "SK3462",
      discount: "30",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    },
    {
      code: "SK3462",
      discount: "30",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
    },
    {
      code: "SK3462",
      discount: "30",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    },
  ];

  return (
    <Container sx={{ py: 10 }}>
      <Grid container spacing={4}>
        {/* Info Card */}
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              border: "2px solid",
              borderColor: "grey.300",
              p: 3,
              borderRadius: 2,
            }}
          >
            <Flight sx={{ fontSize: 48, color: "grey.700", mb: 2 }} />
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                mb: 2,
              }}
            >
              Lorem Ipsum is simply dummy text of tum is simply dummy text of the printing and
              typesetting industring and typesetting industry.
            </Typography>
            <ChevronRight sx={{ fontSize: 32, color: "grey.400" }} />
          </Paper>
        </Grid>

        {/* Vouchers */}
        <Grid item xs={12} md={9}>
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 4 }}>
            HOT
            <br />
            VOUCHERS
          </Typography>

          <Box sx={{ display: "flex", gap: 3, overflowX: "auto" }}>
            {vouchers.map((voucher) => (
              <VoucherCard key={voucher.code} {...voucher} />
            ))}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <IconButton>
              <ChevronRight sx={{ fontSize: 40, color: "grey.400" }} />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HotVouchers;
