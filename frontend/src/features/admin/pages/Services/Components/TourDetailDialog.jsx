import { AccessTime, Close, Event, Group, Map as MapIcon } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import formatPrice from "@/shared/utils/FormatPrice";
import { formatDateTime, getDurationText } from "@/shared/utils/formatDate";

const TourDetailDialog = ({ open, onClose, data }) => {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
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
          Chi tiết tour: {data.name}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Chip
              label={data.status === "AVAILABLE" ? "Sẵn sàng" : "Ngưng hoạt động"}
              color={data.status === "AVAILABLE" ? "success" : "default"}
            />
            <Typography variant="h5" color="primary" fontWeight={700}>
              {formatPrice(data.total_price)}
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            {data.description}
          </Typography>
        </Box>

        <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2, mb: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <AccessTime color="action" />
              <Box>
                <Typography variant="caption" display="block">
                  Thời lượng
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {getDurationText(data.duration_hours)}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Group color="action" />
              <Box>
                <Typography variant="caption" display="block">
                  Chỗ trống
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {data.available_slots} / {data.max_participants}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Event color="action" />
              <Box>
                <Typography variant="caption" display="block">
                  Khởi hành
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatDateTime(data.start_time)}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>

        <Typography
          variant="h6"
          component="div"
          fontWeight={600}
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <MapIcon color="primary" /> Lịch trình ({data.places?.length || 0} điểm)
        </Typography>

        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {data.places?.map((place, index) => {
            const mainImg = place.images?.find((i) => i.is_main) || place.images?.[0];
            return (
              <Box key={place.id || index}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={mainImg?.url}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    >
                      {index + 1}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        component="span"
                        fontWeight={600}
                        display="block"
                      >
                        {place.name}
                      </Typography>
                    }
                    secondaryTypographyProps={{ component: "div" }}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="primary"
                          fontWeight="bold"
                          display="block"
                        >
                          {place.start_time} - {place.end_time}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          {place.description}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < data.places.length - 1 && <Divider variant="inset" component="li" />}
              </Box>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: "grey.200" }}>
        <Button onClick={onClose} variant="contained" sx={{ fontSize: "13px" }}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TourDetailDialog;
