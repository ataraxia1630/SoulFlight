import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalHotelIcon from "@mui/icons-material/LocalHotel";
import MapIcon from "@mui/icons-material/Map";
import PetsIcon from "@mui/icons-material/Pets";
import PlaceIcon from "@mui/icons-material/Place";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import TourIcon from "@mui/icons-material/Tour";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

const CommonHeader = ({ model, data, tags }) => (
  <Box mb={3}>
    <Stack direction="row" justifyContent="space-between" alignItems="start">
      <Box>
        <Stack direction="row" spacing={1} mb={1}>
          <Chip label={model.toUpperCase()} color="primary" size="small" />
          {data.modelTag && (
            <Chip label={`Category: ${data.modelTag}`} variant="outlined" size="small" />
          )}
        </Stack>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {data.serviceName}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          {data.description || "Không có mô tả"}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
          <PlaceIcon fontSize="small" color="error" />
          <Typography variant="body2" fontWeight={500}>
            {data.formattedAddress}
          </Typography>
          {data.location && (
            <Button
              size="small"
              startIcon={<MapIcon />}
              target="_blank"
              href={`https://www.google.com/maps/search/?api=1&query=${data.location.lat},${data.location.lng}`}
              sx={{ textTransform: "none", ml: 2 }}
            >
              Xem bản đồ
            </Button>
          )}
        </Stack>
      </Box>
    </Stack>

    {tags && tags.length > 0 && (
      <Stack direction="row" spacing={1} mt={2} flexWrap="wrap" gap={1}>
        {tags.map((t) => (
          <Chip key={t} label={`#${t}`} size="small" sx={{ bgcolor: "#f0f0f0" }} />
        ))}
      </Stack>
    )}
    <Divider sx={{ my: 3 }} />
  </Box>
);

export default function ServiceRenderer({ serviceData }) {
  const { data } = serviceData;
  const { rooms, menus, tours, tickets, tags } = data;
  const model = data.model;

  const renderContent = () => {
    switch (model) {
      case "stay":
        return <StayView rooms={rooms} />;
      case "fnb":
        return <FnBView menus={menus} />;
      case "tour":
        return <TourView tours={tours} />;
      case "leisure":
        return <LeisureView tickets={tickets} />;
      default:
        return <Typography>Loại dịch vụ không hỗ trợ hiển thị chi tiết.</Typography>;
    }
  };

  return (
    <Box>
      <CommonHeader model={model} data={data} tags={tags} />
      <Typography variant="h6" fontWeight={600} mb={2}>
        Chi tiết dịch vụ
      </Typography>
      {renderContent()}
    </Box>
  );
}

const StayView = ({ rooms }) => {
  if (!rooms?.length) return <Typography fontStyle="italic">Không có dữ liệu phòng.</Typography>;

  return (
    <Grid container spacing={2}>
      {rooms.map((room) => (
        <Grid item xs={12} md={6} key={room}>
          <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="start">
              <Typography variant="subtitle1" fontWeight={700}>
                {room.name}
              </Typography>
              <Typography color="primary.main" fontWeight={700}>
                {formatCurrency(room.price)}/đêm
              </Typography>
            </Stack>

            {room.images && room.images.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  overflowX: "auto",
                  my: 1.5,
                  pb: 0.5,
                }}
              >
                {room.images.map((img) => (
                  <Avatar key={img} src={img} variant="rounded" sx={{ width: 80, height: 60 }} />
                ))}
              </Box>
            )}

            <Stack direction="row" spacing={2} my={1} color="text.secondary">
              <Box display="flex" alignItems="center" gap={0.5}>
                <LocalHotelIcon fontSize="small" />{" "}
                <Typography variant="caption">{room.bedCount} giường</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <GroupsIcon fontSize="small" />
                <Typography variant="caption">
                  {room.guestAdult} người lớn, {room.guestChild} trẻ em
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" flexWrap="wrap" gap={1}>
              {room.petAllowed && (
                <Chip
                  icon={<PetsIcon fontSize="small" />}
                  label="Cho phép thú cưng"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              )}
              <Chip label={`Tổng: ${room.totalRooms} phòng`} size="small" variant="outlined" />
              {room.viewType && (
                <Chip label={`View: ${room.viewType}`} size="small" variant="outlined" />
              )}
            </Stack>

            {room.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                mt={1}
                sx={{ bgcolor: "#fafafa", p: 1 }}
              >
                {room.description}
              </Typography>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

const FnBView = ({ menus }) => {
  if (!menus?.length) return <Typography fontStyle="italic">Không có dữ liệu thực đơn.</Typography>;

  return (
    <Box>
      {menus.map((menu, i) => (
        <Accordion
          key={menu}
          defaultExpanded={i === 0}
          disableGutters
          elevation={0}
          sx={{
            border: "1px solid #eee",
            mb: 1,
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={2}>
              <RestaurantIcon color="action" />
              <Typography fontWeight={600}>{menu.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                ({menu.items?.length || 0} món)
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {menu.description}
            </Typography>
            <Grid container spacing={2}>
              {menu.items?.map((item) => (
                <Grid item xs={12} sm={6} key={item}>
                  <Box display="flex" p={1.5} border="1px dashed #ddd" borderRadius={1}>
                    {item.image && (
                      <Avatar
                        src={item.image}
                        variant="rounded"
                        sx={{ width: 50, height: 50, mr: 1.5 }}
                      />
                    )}
                    <Box flex={1}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {item.description}
                      </Typography>
                      <Typography variant="body2" color="primary.main" fontWeight={600} mt={0.5}>
                        {formatCurrency(item.price)} / {item.unit}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

const TourView = ({ tours }) => {
  if (!tours?.length) return <Typography fontStyle="italic">Không có dữ liệu tour.</Typography>;

  return (
    <Stack spacing={2}>
      {tours.map((tour) => (
        <Paper key={tour} variant="outlined" sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TourIcon color="secondary" />
                <Typography variant="h6" fontWeight={700}>
                  {tour.name}
                </Typography>
              </Stack>
              <Typography variant="body2" mt={1}>
                {tour.description}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="h6" color="primary.main" fontWeight={700}>
                {formatCurrency(tour.price)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Mỗi người
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2} mb={2}>
            <Grid item xs={6} md={3}>
              <Stack direction="row" spacing={1}>
                <CalendarMonthIcon fontSize="small" color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Khởi hành
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {new Date(tour.startTime).toLocaleDateString("vi-VN")}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={6} md={3}>
              <Stack direction="row" spacing={1}>
                <AccessTimeIcon fontSize="small" color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Kết thúc
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {new Date(tour.endTime).toLocaleDateString("vi-VN")}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={6} md={3}>
              <Stack direction="row" spacing={1}>
                <GroupsIcon fontSize="small" color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Giới hạn
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    Max {tour.maxParticipants} khách
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          {tour.places && tour.places.length > 0 && (
            <Box bgcolor="#f8f9fa" p={2} borderRadius={1}>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                📍 Lịch trình / Điểm đến:
              </Typography>
              {tour.places.map((place) => (
                <Box key={place} display="flex" gap={2} mb={1} sx={{ opacity: 0.9 }}>
                  <Typography variant="caption" sx={{ minWidth: 80, fontWeight: "bold" }}>
                    {place.start_time || "---"}
                  </Typography>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {place.description || `Điểm dừng #${place.place_id}`}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      ))}
    </Stack>
  );
};

const LeisureView = ({ tickets }) => {
  if (!tickets?.length) return <Typography fontStyle="italic">Không có dữ liệu vé.</Typography>;

  return (
    <Grid container spacing={2}>
      {tickets.map((ticket) => (
        <Grid item xs={12} sm={6} md={4} key={ticket}>
          <Card
            variant="outlined"
            sx={{
              borderStyle: "dashed",
              borderColor: "#bbb",
              position: "relative",
            }}
          >
            {/* Visual "Cutout" effect for ticket */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: -10,
                width: 20,
                height: 20,
                bgcolor: "white",
                borderRadius: "50%",
                border: "1px solid #bbb",
                transform: "translateY(-50%)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                right: -10,
                width: 20,
                height: 20,
                bgcolor: "white",
                borderRadius: "50%",
                border: "1px solid #bbb",
                transform: "translateY(-50%)",
              }}
            />

            <CardContent sx={{ px: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <ConfirmationNumberIcon color="info" />
                <Chip label="VÉ VÀO CỔNG" size="small" color="default" />
              </Stack>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                {ticket.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2} sx={{ minHeight: 40 }}>
                {ticket.description}
              </Typography>

              <Divider sx={{ my: 1, borderStyle: "dashed" }} />

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Địa điểm ID: {ticket.placeId}
                </Typography>
                <Typography variant="h6" color="primary.main" fontWeight={700}>
                  {formatCurrency(ticket.price)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
