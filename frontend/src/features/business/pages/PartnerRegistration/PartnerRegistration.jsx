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
        padding: { xs: 2, sm: 4, md: 6 },
        overflow: "visible",
      }}
    >
      <Grid container spacing={5} alignItems="flex-start" sx={{ overflow: "visible" }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box
            sx={{
              padding: { xs: 0, md: 2 },
              position: "sticky",
              top: theme.spacing(12),
              alignSelf: "flex-start",
              mt: "100px",
            }}
          >
            <Chip
              label="For Provider"
              sx={{
                bgcolor: "#DFFAFF",
                color: theme.palette.primary.main,
                fontWeight: "600",
                fontSize: "20px",
                mb: 2,
              }}
            />

            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: "600",
                fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                color: "#063F5C",
                mb: 2,
              }}
            >
              Find the Ideal Service Model for Your Business
            </Typography>

            <Typography variant="body1" sx={{ fontSize: "16px", fontWeight: "light", mr: 10 }}>
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
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              minHeight: "100%",
            }}
          >
            <Stack spacing={4} sx={{ width: "100%", maxWidth: "600px", my: 1 }}>
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
