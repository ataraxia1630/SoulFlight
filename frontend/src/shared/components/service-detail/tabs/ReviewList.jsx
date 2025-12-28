import {
  ConfirmationNumber,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Hotel,
  Restaurant,
  TourOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Rating,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import useAuthStore from "@/app/store/authStore";
import DeleteConfirmDialog from "@/shared/components/DeleteConfirmDialog";
import ReviewService from "@/shared/services/review.service";
import { formatDateTime } from "@/shared/utils/formatDate";
import toast from "@/shared/utils/toast";
import ReviewFormDialog from "../ReviewFormDialog";

const RATING_LABELS = {
  1: "Rất tệ",
  2: "Tệ",
  3: "Bình thường",
  4: "Tốt",
  5: "Tuyệt vời",
};

const ReviewsList = ({
  serviceId,
  rooms = [],
  tours = [],
  menus = [],
  tickets = [],
  onRefresh,
}) => {
  const user = useAuthStore((state) => state.user);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const targetOptions = useMemo(() => {
    return [
      ...(rooms ?? []).map((r) => ({
        value: `room-${r.id}`,
        label: `Phòng: ${r.name}`,
      })),
      ...(tours ?? []).map((t) => ({
        value: `tour-${t.id}`,
        label: `Tour: ${t.name}`,
      })),
      ...(menus ?? []).map((m) => ({
        value: `menu-${m.id}`,
        label: `Menu: ${m.name}`,
      })),
      ...(tickets ?? []).map((t) => ({
        value: `ticket-${t.id}`,
        label: `Vé: ${t.name}`,
      })),
    ];
  }, [rooms, tours, menus, tickets]);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ReviewService.getByService(serviceId);
      if (Array.isArray(res)) setReviews(res);
      else if (res && Array.isArray(res.data)) setReviews(res.data);
      else setReviews([]);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setReviews([]);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setEditingReview(null);
    setFormDialogOpen(true);
  };

  const handleOpenEdit = (review) => {
    setIsEditMode(true);
    setEditingReview(review);
    setFormDialogOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await ReviewService.update(editingReview.id, {
          rating: formData.rating,
          comment: formData.comment,
        });
        toast.success("Cập nhật đánh giá thành công!");
      } else {
        const [type, idStr] = formData.selectedTarget.split("-");
        const id = parseInt(idStr, 10);
        const payload = {
          service_id: serviceId,
          rating: formData.rating,
          comment: formData.comment,
          room_id: type === "room" ? id : null,
          tour_id: type === "tour" ? id : null,
          menu_id: type === "menu" ? id : null,
          ticket_id: type === "ticket" ? id : null,
        };
        await ReviewService.create(payload);
        toast.success("Gửi đánh giá thành công!");
      }

      setFormDialogOpen(false);
      fetchReviews();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Submit error:", error);
      const msg = "Có lỗi xảy ra.";
      toast.error(msg);
    }
  };

  const handleClickDelete = (review) => {
    setReviewToDelete(review);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    try {
      await ReviewService.delete(reviewToDelete.id);
      toast.success("Đã xóa đánh giá.");
      fetchReviews();
      if (onRefresh) onRefresh();
    } catch {
      toast.error("Lỗi khi xóa đánh giá.");
    } finally {
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const getTargetInfo = (review) => {
    const target = review.target;
    if (!target) return null;
    if (target.room)
      return {
        label: target.room.name,
        icon: <Hotel fontSize="small" />,
        color: "primary",
      };
    if (target.tour)
      return {
        label: target.tour.name,
        icon: <TourOutlined fontSize="small" />,
        color: "success",
      };
    if (target.menu)
      return {
        label: target.menu.name,
        icon: <Restaurant fontSize="small" />,
        color: "warning",
      };
    if (target.ticket)
      return {
        label: target.ticket.name,
        icon: <ConfirmationNumber fontSize="small" />,
        color: "info",
      };
    return null;
  };

  const checkPermission = (review) => {
    if (!user) return false;
    if (user.role === "ADMIN") return true;
    return review.traveler && user.id === review.traveler.id;
  };

  const avgRating =
    Array.isArray(reviews) && reviews.length > 0
      ? (reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <Box sx={{ py: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Đánh giá từ khách hàng
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
            <Rating value={Number(avgRating) || 0} readOnly precision={0.1} size="medium" />

            <Typography variant="body1" fontWeight={600} color="text.primary">
              {(Number(avgRating) || 0).toFixed(1)}
            </Typography>

            <Typography variant="body1" color="text.secondary">
              ({Array.isArray(reviews) ? reviews.length : 0} đánh giá)
            </Typography>
          </Stack>
        </Box>

        {user && (
          <Button variant="contained" startIcon={<EditIcon />} onClick={handleOpenAdd}>
            Viết đánh giá
          </Button>
        )}
      </Stack>

      <Stack spacing={2}>
        {loading ? (
          [1, 2, 3].map((item) => (
            <Card key={item} variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={2}>
                  <Skeleton variant="circular" width={48} height={48} />
                  <Box flex={1}>
                    <Skeleton variant="text" width="40%" height={30} />
                    <Skeleton variant="text" width="20%" />
                    <Skeleton variant="text" width="100%" height={60} sx={{ mt: 1 }} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            {Array.isArray(reviews) &&
              reviews.map((review) => {
                const canEdit = checkPermission(review);
                const targetInfo = getTargetInfo(review);
                return (
                  <Card
                    key={review.id}
                    variant="outlined"
                    sx={{ borderRadius: 3, bgcolor: "background.paper" }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={2}>
                        <Avatar
                          src={review.traveler?.avatar_url}
                          alt={review.traveler?.name}
                          sx={{ width: 48, height: 48 }}
                        />
                        <Box flex={1}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                          >
                            <Box>
                              <Typography fontWeight="bold" variant="subtitle1">
                                {review.traveler?.name || "Người dùng ẩn danh"}
                              </Typography>
                              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                                <Rating value={review.rating} readOnly size="small" />
                                <Typography
                                  variant="caption"
                                  fontWeight="bold"
                                  color="text.primary"
                                >
                                  {RATING_LABELS[review.rating]}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDateTime(review.created_at)}
                                </Typography>
                              </Stack>
                              {targetInfo && (
                                <Chip
                                  icon={targetInfo.icon}
                                  label={targetInfo.label}
                                  size="small"
                                  color={targetInfo.color}
                                  variant="outlined"
                                  sx={{ mt: 0.5, fontWeight: 500 }}
                                />
                              )}
                            </Box>
                            {canEdit && (
                              <Stack direction="row">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleOpenEdit(review)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleClickDelete(review)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Stack>
                            )}
                          </Stack>
                          <Typography
                            variant="body1"
                            sx={{
                              mt: 1.5,
                              whiteSpace: "pre-line",
                              color: "text.primary",
                            }}
                          >
                            {review.comment}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            {(!Array.isArray(reviews) || reviews.length === 0) && (
              <Box textAlign="center" py={4} bgcolor="grey.50" borderRadius={2}>
                <Typography color="text.secondary">Chưa có đánh giá nào.</Typography>
              </Box>
            )}
          </>
        )}
      </Stack>

      <ReviewFormDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleFormSubmit}
        isEditMode={isEditMode}
        initialData={editingReview}
        targetOptions={targetOptions}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName="đánh giá này"
      />
    </Box>
  );
};

export default ReviewsList;
