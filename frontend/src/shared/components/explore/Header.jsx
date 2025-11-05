import { Box, Chip, Fade, Paper, Typography } from "@mui/material";
import SearchBar from "../home/SearchBar";

const ExploreHeader = ({ location, priceMin, priceMax, guests, totalResults, theme }) => {
  return (
    <Fade in timeout={500}>
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.third.main} 100%)`,
          color: "text.contrast",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 4, pb: 2 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, mb: 1, opacity: 0.9 }}>
            Search results
          </Typography>

          <Typography sx={{ fontSize: 36, fontWeight: 700, mb: 2 }}>
            {location || "All locations"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {(priceMin || priceMax) && (
              <Chip
                label={
                  priceMin && priceMax
                    ? `${priceMin.toLocaleString()} - ${priceMax.toLocaleString()} VND`
                    : priceMin
                      ? `From ${priceMin.toLocaleString()} VND`
                      : priceMax
                        ? `Up to ${priceMax.toLocaleString()} VND`
                        : ""
                }
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "text.contrast",
                  fontWeight: 500,
                }}
              />
            )}

            <Chip
              label={`${guests} guest${guests !== "1" ? "s" : ""}`}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "text.contrast",
                fontWeight: 500,
              }}
            />

            <Chip
              label={`${totalResults} results found`}
              sx={{
                bgcolor: "rgba(255,255,255,0.3)",
                color: "text.contrast",
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            px: 2,
            pb: 4,
            pt: 2,
          }}
        >
          <Box
            sx={{
              bgcolor: "background.default",
              color: "text.primary",
              borderRadius: 2,
              p: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <SearchBar />
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
};

export default ExploreHeader;
