import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingState = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      py: 8,
      gap: 2,
    }}
  >
    <CircularProgress size={48} />
    <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
      Searching for the best options...
    </Typography>
  </Box>
);

export default LoadingState;
