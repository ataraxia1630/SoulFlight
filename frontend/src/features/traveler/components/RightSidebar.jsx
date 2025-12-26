import { Box, Card, CardMedia, Typography } from "@mui/material";

const RIGHT_SIDEBAR_WIDTH = 280;
const HEADER_HEIGHT = 72;

const RightSidebar = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: HEADER_HEIGHT,
        right: 0,
        width: RIGHT_SIDEBAR_WIDTH,
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        px: 1.5,
        zIndex: 1100,
      }}
    >
      <Box sx={{ pl: 2.7, pt: 2 }}>
        <Typography fontWeight={700} mb={1}>
          Quảng cáo
        </Typography>

        <Card sx={{ mb: 2, borderRadius: 2 }}>
          <CardMedia
            component="img"
            height={140}
            image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          />
          <Typography sx={{ p: 1 }} fontSize={14}>
            Du lịch biển – Ưu đãi hè
          </Typography>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardMedia
            component="img"
            height={140}
            image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
          />
          <Typography sx={{ p: 1 }} fontSize={14}>
            Khám phá châu Âu
          </Typography>
        </Card>
      </Box>
    </Box>
  );
};

export default RightSidebar;
