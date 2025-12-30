import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemAvatar,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationService from "@/shared/services/notification.service";
import { formatDateTime } from "@/shared/utils/formatDate";

const NotificationMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const countRes = await NotificationService.countUnread();
      setUnreadCount(countRes.data.count);

      const listRes = await NotificationService.getAll();
      setNotifications(listRes.data.slice(0, 5));
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // set interval để poll notification mỗi 1 phút
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleMarkRead = async (id, _relatedId, type) => {
    try {
      await NotificationService.markAsRead(id);
      fetchData();
      handleClose();

      if (type === "REPORT_CREATED") {
        navigate(`/admin/report`);
      }
      if (type === ("REPORT_RESOLVED" || "SYSTEM_INFO" || "BOOKING_CREATED" || "REVIEW_CREATED")) {
        navigate(`/notifications`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewAll = () => {
    handleClose();
    navigate("/notifications");
  };

  const getIcon = (type) => {
    if (type?.includes("REPORT")) return <WarningIcon color="error" />;
    if (type?.includes("SUCCESS") || type?.includes("APPROVED"))
      return <CheckCircleIcon color="success" />;
    return <InfoIcon color="primary" />;
  };

  return (
    <>
      <IconButton onClick={handleOpen} color="inherit">
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 360, maxHeight: 480 },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          sx={{
            p: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">Thông báo</Typography>
          {unreadCount > 0 && (
            <Typography variant="caption" color="primary">
              {unreadCount} chưa đọc
            </Typography>
          )}
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2">Chưa có thông báo nào</Typography>
          </MenuItem>
        ) : (
          notifications.map((notif) => (
            <MenuItem
              key={notif.id}
              onClick={() => handleMarkRead(notif.id, notif.related_id, notif.type)}
              sx={{
                bgcolor: notif.is_read ? "inherit" : "action.hover",
                whiteSpace: "normal",
                alignItems: "flex-start",
                gap: 1.5,
              }}
            >
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Avatar sx={{ bgcolor: "transparent" }}>{getIcon(notif.type)}</Avatar>
              </ListItemAvatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={notif.is_read ? 500 : 700}>
                  {notif.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    overflow: "hidden",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                  }}
                >
                  {notif.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDateTime(notif.created_at)}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}

        <Divider />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button size="small" onClick={handleViewAll}>
            Xem tất cả
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default NotificationMenu;
