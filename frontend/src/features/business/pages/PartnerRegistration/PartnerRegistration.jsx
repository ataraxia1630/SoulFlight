import { Box, Chip, Grid, Stack, Typography, useTheme } from "@mui/material";
import ModelCard from "../../components/ModelCard";
import MODEL_CONFIG from "./modelConfig";

export default function PartnerRegistration() {
  const theme = useTheme();
  const models = MODEL_CONFIG;
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#B1EBFE",
        padding: { xs: 4, sm: 6, md: 8 },
        overflow: "visible",
      }}
    >
      <Grid container spacing={5} alignItems="flex-start">
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box
            sx={{
              mr: 5,
              ml: { xs: 0, sm: 8 },
            }}
          >
            <Chip
              label="For Provider"
              sx={{
                bgcolor: "#DFFAFF",
                color: theme.palette.primary.main,
                fontWeight: "600",
                fontSize: "12px",
                mb: 2,
              }}
            />

            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: "600",
                fontSize: { xs: "28px", sm: "32px", md: "40px" },
                color: "#063F5C",
                mb: 2,
              }}
            >
              Find the Ideal Service Model for Your Business
            </Typography>

            <Typography
              variant="body1"
              sx={{ fontSize: "14px", fontWeight: "light", mr: 11, ml: 1 }}
            >
              Every business delivers its own kind of experience - be it relaxation, dining, or
              travel. Selecting the right service model that your business provides to truly reflect
              your brand's vision and customer journey.
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
              justifyContent: "center",
              width: "100%",
              minHeight: "100%",
            }}
          >
            <Stack spacing={4} sx={{ maxWidth: "600px", my: 1, mr: { xs: 0, sm: 8 } }}>
              {models.map((model) => (
                <ModelCard key={model.name} config={model} />
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
