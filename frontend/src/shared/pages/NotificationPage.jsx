import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import InfoIcon from "@mui/icons-material/Info";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Skeleton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/app/store";
import DeleteConfirmDialog from "@/shared/components/DeleteConfirmDialog";
import NotificationService from "@/shared/services/notification.service";
import { formatDateTime } from "@/shared/utils/formatDate";
import toast from "@/shared/utils/toast";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [deleteState, setDeleteState] = useState({ open: false, id: null });

  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await NotificationService.getAll();
      setNotifications(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user, fetchNotifications]);

  const handleBack = () => navigate(-1);

  const handleMarkAllRead = async () => {
    const unreadCount = notifications.filter((n) => !n.is_read).length;
    if (unreadCount === 0) {
      toast.info("Bạn đã đọc hết các thông báo rồi!");
      return;
    }
    try {
      await NotificationService.markAllAsRead();
      toast.success("Đã đánh dấu tất cả là đã đọc");
      fetchNotifications();
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDeleteAll = () => {
    if (notifications.length === 0) return;
    setDeleteState({ open: true, id: null });
  };

  const handleOpenDeleteOne = (id, e) => {
    e.stopPropagation();
    setDeleteState({ open: true, id: id });
  };

  const handleConfirmDelete = async () => {
    const { id } = deleteState;
    try {
      if (id) {
        await NotificationService.delete(id);
        toast.success("Đã xóa thông báo");
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      } else {
        await NotificationService.deleteAll();
        toast.success("Đã xóa tất cả thông báo");
        fetchNotifications();
      }
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setDeleteState({ open: false, id: null });
    }
  };

  const displayedList = tabValue === 0 ? notifications : notifications.filter((n) => !n.is_read);

  const getIcon = (type) => {
    if (type?.includes("REPORT")) return <WarningIcon color="error" />;
    if (type?.includes("SUCCESS") || type?.includes("APPROVED"))
      return <CheckCircleIcon color="success" />;
    return <InfoIcon color="primary" />;
  };

  return (
    <Container maxWidth="md" sx={{ pb: 0.5 }}>
      <Box sx={{ mb: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ color: "text.primary", textTransform: "none", fontWeight: 500 }}
        >
          Quay lại
        </Button>
      </Box>

      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ p: 3, bgcolor: "primary.light", color: "white" }}>
          <Typography variant="h5" fontWeight="bold">
            Thông báo của bạn
          </Typography>
        </Box>

        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Tabs value={tabValue} onChange={(_e, v) => setTabValue(v)}>
            <Tab label={`Tất cả (${notifications.length})`} />
            <Tab label={`Chưa đọc (${notifications.filter((n) => !n.is_read).length})`} />
          </Tabs>

          <Box sx={{ display: "flex", gap: 1, my: 1 }}>
            <Button
              startIcon={<DoneAllIcon />}
              color="success"
              onClick={handleMarkAllRead}
              size="small"
              disabled={notifications.filter((n) => !n.is_read).length === 0}
            >
              Đọc hết
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              color="error"
              onClick={handleOpenDeleteAll}
              size="small"
              disabled={notifications.length === 0}
            >
              Xóa hết
            </Button>
          </Box>
        </Box>

        <List sx={{ minHeight: 400 }}>
          {loading &&
            notifications.length === 0 &&
            [1, 2, 3].map((i) => (
              <Box key={i} sx={{ p: 2 }}>
                <Box display="flex" gap={2}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box flex={1}>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="90%" />
                  </Box>
                </Box>
              </Box>
            ))}

          {!loading && displayedList.length === 0 && (
            <Box sx={{ p: 8, textAlign: "center", color: "text.secondary" }}>
              <NotificationsOffIcon sx={{ fontSize: 60, mb: 2, color: "grey.300" }} />
              <Typography>Không có thông báo nào.</Typography>
            </Box>
          )}

          {displayedList.map((notif) => (
            <React.Fragment key={notif.id}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <IconButton edge="end" onClick={(e) => handleOpenDeleteOne(notif.id, e)}>
                    <DeleteIcon fontSize="small" sx={{ color: "red" }} />
                  </IconButton>
                }
                sx={{
                  bgcolor: notif.is_read ? "inherit" : "rgba(25, 118, 210, 0.08)",
                  transition: "0.2s",
                  "&:hover": { bgcolor: "action.hover" },
                  cursor: !notif.is_read ? "pointer" : "default",
                }}
                onClick={() => !notif.is_read && handleMarkRead(notif.id)}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "transparent" }}>{getIcon(notif.type)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <Typography
                        fontWeight={notif.is_read ? 600 : 750}
                        variant="subtitle1"
                        sx={{ mr: 1 }}
                      >
                        {notif.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {formatDateTime(notif.created_at)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
                      {notif.message}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <DeleteConfirmDialog
        open={deleteState.open}
        onClose={() => setDeleteState({ open: false, id: null })}
        onConfirm={handleConfirmDelete}
        itemName={deleteState.id ? "thông báo này" : "tất cả thông báo"}
      />
    </Container>
  );
};

export default NotificationPage;
