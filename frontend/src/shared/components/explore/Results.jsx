import { Search } from "@mui/icons-material";
import { Box, Fade, Paper, Typography } from "@mui/material";
import ServiceCard from "./cards/ServiceCard";
import ResultSection from "./ResultSection";

const Results = ({ services }) => {
  const hasResults = services && services.length > 0;

  if (!hasResults) {
    return (
      <Paper elevation={0} sx={{ p: 8, textAlign: "center", borderRadius: 2 }}>
        <Search sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 600,
            color: "text.secondary",
            mb: 1,
          }}
        >
          Không tìm thấy dịch vụ nào
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>Bạn hãy thử đổi tìm kiếm khác</Typography>
      </Paper>
    );
  }

  return (
    <Fade in timeout={600}>
      <Box>
        <ResultSection title="Danh sách dịch vụ" count={services.length}>
          {services.map((item) => (
            <ServiceCard key={item.id} data={item} />
          ))}
        </ResultSection>
      </Box>
    </Fade>
  );
};

export default Results;
