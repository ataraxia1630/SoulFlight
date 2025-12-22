import { AccessTime, AttachMoney, Close, LocationOn } from "@mui/icons-material";
import {
  Box,
  Button,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import formatPrice from "@/shared/utils/FormatPrice";

const formatOpeningHours = (hours) => {
  if (!hours) return "Chưa cập nhật";
  if (hours.open && hours.close) return `${hours.open} - ${hours.close}`;
  if (typeof hours === "object") {
    return (
      <Tooltip
        title={
          <Box sx={{ p: 1 }}>
            {Object.entries(hours).map(([day, times]) => {
              if (!times) return null;
              const timeStr = Array.isArray(times)
                ? times.map((t) => `${t.open}-${t.close}`).join(", ")
                : `${times.open} - ${times.close}`;
              return (
                <Typography key={day} variant="caption" display="block">
                  <strong>{day}:</strong> {timeStr}
                </Typography>
              );
            })}
          </Box>
        }
        arrow
      >
        <span
          style={{
            cursor: "pointer",
            color: "#1976d2",
            textDecoration: "underline",
          }}
        >
          Xem lịch chi tiết
        </span>
      </Tooltip>
    );
  }
  return "Liên hệ";
};

const TicketDetailDialog = ({ open, onClose, data }) => {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        component="div"
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "grey.200",
        }}
      >
        <Typography variant="h6" component="div" fontWeight={700}>
          Vé: {data.name}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {data.place?.main_image && (
          <CardMedia
            component="img"
            height="200"
            image={data.place.main_image}
            alt={data.name}
            sx={{ borderRadius: 2, mb: 2, mt: 2, objectFit: "cover" }}
          />
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Chip
            label={data.status === "AVAILABLE" ? "Đang bán" : "Ngưng bán"}
            color={data.status === "AVAILABLE" ? "success" : "default"}
            size="small"
          />
          <Typography variant="h5" color="primary.main" fontWeight={700}>
            {formatPrice(data.price)}
          </Typography>
        </Box>

        <Typography variant="body1" paragraph component="div">
          {data.description}
        </Typography>

        <Divider sx={{ my: 2 }}>Thông tin địa điểm</Divider>

        {data.place && (
          <Stack spacing={2}>
            <Box display="flex" gap={1}>
              <LocationOn color="action" />
              <Typography variant="body2" component="div">
                <strong>{data.place.name}</strong> <br /> {data.place.address}
              </Typography>
            </Box>
            <Box display="flex" gap={1} alignItems="center">
              <AccessTime color="action" />
              <Typography variant="body2" component="div">
                {formatOpeningHours(data.place.opening_hours)}
              </Typography>
            </Box>
            <Box display="flex" gap={1} alignItems="center">
              <AttachMoney color="action" />
              <Typography variant="body2">
                Vé cổng: {formatPrice(data.place.entry_fee || 0)}
              </Typography>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: "grey.200" }}>
        <Button onClick={onClose} variant="contained" sx={{ fontSize: "13px" }}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketDetailDialog;
