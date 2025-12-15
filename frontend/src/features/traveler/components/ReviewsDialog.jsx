import { AutoAwesome, Close, OpenInNew, ThumbUp, TrendingUp } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useActivity } from "../hooks/useItinerary";

export default function ReviewsDialog({ open, onClose, activity }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getReviews } = useActivity();

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const reviewsData = await getReviews(activity.id);
      setReviews(reviewsData.reviews || []);
    } catch (error) {
      console.error("Load reviews error:", error);
    } finally {
      setLoading(false);
    }
  }, [activity, getReviews]);

  useEffect(() => {
    if (open && activity) {
      loadReviews();
    }
  }, [open, activity, loadReviews]);

  const openGoogleMaps = () => {
    if (activity.latitude && activity.longitude) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          activity.title,
        )}&query=${activity.latitude},${activity.longitude}`,
        "_blank",
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${activity.title} ${activity.exact_address}`,
        )}`,
        "_blank",
      );
    }
  };

  const getAvatarColor = (name) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#F7B731",
      "#5F27CD",
      "#00D2D3",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, maxHeight: "90vh" },
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack spacing={1} flex={1}>
            <Typography variant="h6" fontWeight={700}>
              {activity?.title}
            </Typography>

            {activity?.estimated_rating && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Rating value={activity.estimated_rating} precision={0.1} size="small" readOnly />
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  {activity.estimated_rating} ⭐
                </Typography>
                <Chip
                  label="AI ước tính"
                  size="small"
                  icon={<AutoAwesome />}
                  color="primary"
                  variant="outlined"
                />
              </Stack>
            )}

            {activity?.exact_address && (
              <Typography variant="body2" color="text.secondary">
                📍 {activity.exact_address}
              </Typography>
            )}
          </Stack>

          <Stack direction="row" spacing={1}>
            <IconButton size="small" onClick={openGoogleMaps} title="Mở Google Maps">
              <OpenInNew />
            </IconButton>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Stack>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <CircularProgress size={48} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Đang tải đánh giá...
            </Typography>
          </Box>
        ) : reviews.length === 0 ? (
          <Alert severity="info">Chưa có đánh giá cho địa điểm này.</Alert>
        ) : (
          <Stack spacing={3}>
            {/* Summary Card */}
            <Card variant="outlined" sx={{ bgcolor: "rgba(33, 150, 243, 0.05)" }}>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" fontWeight={600} color="primary">
                    💬 Tổng quan đánh giá
                  </Typography>
                  <Stack direction="row" spacing={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Tổng số đánh giá
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {reviews.length}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Điểm trung bình
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(
                          1,
                        )}{" "}
                        ⭐
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* AI Notice */}
            <Alert severity="info" icon={<AutoAwesome />}>
              <Typography variant="body2">
                <strong>Lưu ý:</strong> Đây là các đánh giá được AI tạo ra dựa trên phân tích dữ
                liệu và trải nghiệm thực tế của khách du lịch. Để xem đánh giá chính xác nhất, vui
                lòng kiểm tra trên Google Maps hoặc các nền tảng đánh giá khác.
              </Typography>
            </Alert>

            {/* Reviews List */}
            <Stack spacing={2.5}>
              <AnimatePresence>
                {reviews.map((review, index) => (
                  <motion.div
                    key={review}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card variant="outlined">
                      <CardContent>
                        <Stack spacing={2}>
                          {/* Header */}
                          <Stack direction="row" spacing={2} alignItems="flex-start">
                            <Avatar
                              sx={{
                                bgcolor: getAvatarColor(review.author),
                                width: 48,
                                height: 48,
                                fontWeight: 700,
                              }}
                            >
                              {review.author.charAt(0)}
                            </Avatar>

                            <Stack spacing={0.5} flex={1}>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {review.author}
                                </Typography>
                                {review.helpful && (
                                  <Chip
                                    icon={<ThumbUp />}
                                    label={`${review.helpful} hữu ích`}
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              </Stack>

                              <Stack direction="row" spacing={1} alignItems="center">
                                <Rating value={review.rating} size="small" readOnly />
                                <Typography variant="caption" color="text.secondary">
                                  • {review.date}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Stack>

                          {/* Review Text */}
                          <Typography variant="body2" color="text.secondary">
                            {review.text}
                          </Typography>

                          {/* Tags */}
                          {review.tags && review.tags.length > 0 && (
                            <Stack direction="row" spacing={0.5} flexWrap="wrap">
                              {review.tags.map((tag) => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: "0.75rem" }}
                                />
                              ))}
                            </Stack>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Stack>

            {/* Call to Action */}
            <Card
              variant="outlined"
              sx={{
                bgcolor: "rgba(76, 175, 80, 0.05)",
                borderColor: "success.light",
              }}
            >
              <CardContent>
                <Stack spacing={1.5} alignItems="center" textAlign="center">
                  <TrendingUp color="success" sx={{ fontSize: 40 }} />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Bạn đã đến đây rồi?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Chia sẻ trải nghiệm của bạn để giúp người khác!
                  </Typography>
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={openGoogleMaps}
                    endIcon={<OpenInNew />}
                  >
                    Đánh giá trên Google Maps
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
