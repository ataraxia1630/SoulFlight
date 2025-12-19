import { Send as SendIcon, Star as StarIcon } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { formatDateTime } from "@/shared/utils/formatDate";

const ReviewsList = ({ reviews = [], onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(-1);

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, cur) => acc + cur.rating, 0) / totalReviews).toFixed(1)
      : 0;

  const handleSubmit = () => {
    if (rating === 0) return;

    if (onSubmitReview) {
      onSubmitReview({ rating, comment });
    }

    setRating(0);
    setComment("");
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", py: 2 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "grey.50", borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h2" fontWeight={700} color="primary.main">
              {averageRating}
            </Typography>
            <Rating value={parseFloat(averageRating)} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {totalReviews} đánh giá
            </Typography>
          </Box>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => Math.round(r.rating) === star).length;
              const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <Box key={star} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Typography variant="caption" sx={{ minWidth: 10 }}>
                    {star}
                  </Typography>
                  <StarIcon sx={{ fontSize: 12, color: "text.secondary" }} />
                  <LinearProgress
                    variant="determinate"
                    value={percent}
                    sx={{
                      flex: 1,
                      height: 6,
                      borderRadius: 5,
                      bgcolor: "grey.300",
                      "& .MuiLinearProgress-bar": { bgcolor: "warning.main" },
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Viết đánh giá của bạn
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography component="legend">Chất lượng:</Typography>
            <Rating
              name="hover-feedback"
              value={rating}
              precision={1}
              onChange={(_event, newValue) => {
                setRating(newValue);
              }}
              onChangeActive={(_event, newHover) => {
                setHoverRating(newHover);
              }}
              size="large"
            />
            {rating !== null && (
              <Box sx={{ ml: 2, typography: "caption", color: "text.secondary" }}>
                {labels[hoverRating !== -1 ? hoverRating : rating]}
              </Box>
            )}
          </Box>

          <TextField
            label="Chia sẻ cảm nhận của bạn"
            multiline
            rows={3}
            variant="outlined"
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Phòng sạch sẽ, tiện nghi, nhân viên nhiệt tình..."
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSubmit}
              disabled={!rating}
              sx={{ px: 4, borderRadius: 2 }}
            >
              Gửi đánh giá
            </Button>
          </Box>
        </Box>
      </Paper>

      <Divider sx={{ my: 4 }}>
        <Chip label="Đánh giá gần đây" />
      </Divider>

      {!reviews || reviews.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4, opacity: 0.6 }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png"
            alt="No reviews"
            style={{ width: 80, marginBottom: 16, filter: "grayscale(100%)" }}
          />
          <Typography color="text.secondary">
            Chưa có đánh giá nào. Hãy là người đầu tiên!
          </Typography>
        </Box>
      ) : (
        <Stack spacing={3}>
          {reviews.map((review) => (
            <Paper
              key={review.id}
              elevation={0}
              variant="outlined"
              sx={{ p: 2.5, borderRadius: 2, "&:hover": { bgcolor: "grey.50" } }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                <Avatar
                  src={review.user_avatar}
                  alt={review.user_name}
                  sx={{ width: 48, height: 48, bgcolor: "primary.light" }}
                >
                  {review.user_name ? review.user_name.charAt(0) : "U"}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 0.5,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {review.user_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {formatDateTime(review.created_at)}
                      </Typography>
                    </Box>
                    <Rating value={review.rating} size="small" readOnly />
                  </Box>

                  <Typography variant="body2" color="text.primary" sx={{ mt: 1, lineHeight: 1.6 }}>
                    {review.comment}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

const labels = {
  1: "Rất tệ",
  2: "Tệ",
  3: "Bình thường",
  4: "Tốt",
  5: "Tuyệt vời",
};

export default ReviewsList;
