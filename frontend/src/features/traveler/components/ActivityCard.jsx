import {
  AccessTime,
  AttachMoney,
  CheckCircle,
  Circle,
  Delete,
  DirectionsCar,
  Edit,
  Hotel,
  Lightbulb,
  LocationOn,
  Map as MapIcon,
  MoreVert,
  Museum,
  RateReview,
  Restaurant,
  ShoppingBag,
  SwapHoriz,
  TheaterComedy,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Collapse,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";

const ACTIVITY_ICONS = {
  RESTAURANT: Restaurant,
  ATTRACTION: Museum,
  ACCOMMODATION: Hotel,
  TRANSPORT: DirectionsCar,
  SHOPPING: ShoppingBag,
  ENTERTAINMENT: TheaterComedy,
  OTHER: LocationOn,
};

const ACTIVITY_COLORS = {
  RESTAURANT: "#FF6B6B",
  ATTRACTION: "#4ECDC4",
  ACCOMMODATION: "#45B7D1",
  TRANSPORT: "#FFA07A",
  SHOPPING: "#98D8C8",
  ENTERTAINMENT: "#F7B731",
  OTHER: "#95A5A6",
};

export default function ActivityCard({
  activity,
  onEdit,
  onDelete,
  onReplace,
  onViewReviews,
  onToggleComplete,
}) {
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const ActivityIcon = ACTIVITY_ICONS[activity.type] || LocationOn;
  const activityColor = ACTIVITY_COLORS[activity.type] || "#95A5A6";

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openGoogleMaps = () => {
    if (activity.latitude && activity.longitude) {
      window.open(
        `https://www.google.com/maps?q=${activity.latitude},${activity.longitude}`,
        "_blank",
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overflow: "hidden",
          border: activity.is_completed ? "2px solid" : "none",
          borderColor: "success.main",
          opacity: activity.is_completed ? 0.8 : 1,
        }}
      >
        {/* Photo */}
        {activity.photo_url && (
          <Box sx={{ position: "relative", width: { xs: "100%", md: 280 } }}>
            <CardMedia
              component="img"
              sx={{
                height: { xs: 200, md: "100%" },
                objectFit: "cover",
              }}
              image={activity.photo_url}
              alt={activity.title}
            />

            {/* Completion Badge */}
            {activity.is_completed && (
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  bgcolor: "success.main",
                  color: "white",
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <CheckCircle fontSize="small" />
                <Typography variant="caption" fontWeight={600}>
                  Hoàn thành
                </Typography>
              </Box>
            )}

            {/* Photo Credit */}
            {activity.photographer && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "white",
                  borderRadius: 1,
                  px: 1,
                  py: 0.3,
                }}
              >
                <Typography variant="caption" fontSize="0.7rem">
                  📷 {activity.photographer}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Content */}
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <CardContent sx={{ flex: 1 }}>
            <Stack spacing={2}>
              {/* Header */}
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                  <Box
                    sx={{
                      bgcolor: activityColor,
                      color: "white",
                      borderRadius: 2,
                      p: 0.8,
                      display: "flex",
                    }}
                  >
                    <ActivityIcon fontSize="small" />
                  </Box>

                  <Stack spacing={0.5} flex={1}>
                    <Typography variant="h6" fontWeight={600}>
                      {activity.title}
                    </Typography>

                    {/* Meta chips */}
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      <Chip
                        icon={<AccessTime />}
                        label={activity.time}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {activity.duration && (
                        <Chip label={`${activity.duration} phút`} size="small" variant="outlined" />
                      )}
                      {activity.estimated_cost && (
                        <Chip
                          icon={<AttachMoney />}
                          label={formatCurrency(activity.estimated_cost)}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                      {activity.price_level && (
                        <Chip
                          label={Array(activity.price_level).fill("₫").join("")}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  </Stack>
                </Stack>

                {/* Menu */}
                <IconButton onClick={handleMenuClick} size="small">
                  <MoreVert />
                </IconButton>
              </Stack>

              {/* Rating */}
              {activity.estimated_rating && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating value={activity.estimated_rating} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {activity.estimated_rating} ⭐ (ước tính)
                  </Typography>
                </Stack>
              )}

              {/* Address */}
              {activity.exact_address && (
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {activity.exact_address}
                  </Typography>
                </Stack>
              )}

              {/* Description */}
              <Typography variant="body2" color="text.secondary">
                {activity.description}
              </Typography>

              {/* Popular Times */}
              {activity.popular_times && (
                <Typography variant="caption" color="text.secondary" display="block">
                  🕐 Thời gian đông: {activity.popular_times}
                </Typography>
              )}

              {/* Local Tips */}
              {activity.local_tips && activity.local_tips.length > 0 && (
                <Collapse in={expanded}>
                  <Alert severity="info" icon={<Lightbulb />} sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                      💡 Tips từ người địa phương:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {activity.local_tips.slice(0, 3).map((tip) => (
                        <li key={tip}>
                          <Typography variant="body2">{tip}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Alert>
                </Collapse>
              )}

              {/* User Notes */}
              {activity.user_notes && (
                <Alert severity="warning" icon={<Edit />}>
                  <Typography variant="body2">
                    <strong>Ghi chú:</strong> {activity.user_notes}
                  </Typography>
                </Alert>
              )}

              {/* Actions */}
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button
                  size="small"
                  startIcon={<SwapHoriz />}
                  onClick={() => onReplace(activity)}
                  variant="outlined"
                >
                  Thay thế
                </Button>

                <Button
                  size="small"
                  startIcon={<RateReview />}
                  onClick={() => onViewReviews(activity)}
                >
                  Xem đánh giá
                </Button>

                {activity.latitude && activity.longitude && (
                  <Button size="small" startIcon={<MapIcon />} onClick={openGoogleMaps}>
                    Bản đồ
                  </Button>
                )}

                {activity.local_tips && activity.local_tips.length > 0 && (
                  <Button size="small" onClick={() => setExpanded(!expanded)}>
                    {expanded ? "Ẩn tips" : "Xem tips"}
                  </Button>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Box>

        {/* Menu */}
        <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              onToggleComplete(activity);
              handleMenuClose();
            }}
          >
            <ListItemIcon>{activity.is_completed ? <Circle /> : <CheckCircle />}</ListItemIcon>
            <ListItemText>
              {activity.is_completed ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"}
            </ListItemText>
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEdit(activity);
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <Edit />
            </ListItemIcon>
            <ListItemText>Chỉnh sửa</ListItemText>
          </MenuItem>

          <MenuItem
            onClick={() => {
              onDelete(activity);
              handleMenuClose();
            }}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon sx={{ color: "error.main" }}>
              <Delete />
            </ListItemIcon>
            <ListItemText>Xóa hoạt động</ListItemText>
          </MenuItem>
        </Menu>
      </Card>
    </motion.div>
  );
}
