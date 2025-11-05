import { ErrorOutline, Refresh } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";

const ErrorState = ({ message }) => (
  <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 2 }}>
    <ErrorOutline sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
    <Typography sx={{ fontSize: 20, fontWeight: 600, color: "error.main", mb: 1 }}>
      Oops! Something went wrong
    </Typography>
    <Typography sx={{ color: "text.secondary", mb: 3 }}>
      {message || "Failed to load search results. Please try again."}
    </Typography>
    <Button
      variant="contained"
      startIcon={<Refresh />}
      sx={{ textTransform: "none", fontWeight: 600 }}
      disabled
    >
      Retry Search
    </Button>
  </Paper>
);

export default ErrorState;
