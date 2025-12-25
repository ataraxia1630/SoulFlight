import { SearchOff } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";

const EmptyState = ({ message }) => {
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            textAlign: "center",
          }}
        >
          <SearchOff sx={{ fontSize: 80, color: "text.secondary" }} />
          <Typography variant="h5" fontWeight={600}>
            {message || "Không tìm thấy dữ liệu"}
          </Typography>
          <Button variant="contained" onClick={() => window.history.back()}>
            Quay lại
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default EmptyState;
