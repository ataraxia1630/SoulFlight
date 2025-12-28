import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

const RATING_LABELS = {
  1: "Rất tệ",
  2: "Tệ",
  3: "Bình thường",
  4: "Tốt",
  5: "Tuyệt vời",
};

const getLabelText = (value) => `${value} Sao, ${RATING_LABELS[value]}`;

const ReviewFormDialog = ({
  open,
  onClose,
  onSubmit,
  isEditMode,
  initialData,
  targetOptions = [],
}) => {
  const [hover, setHover] = useState(-1);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
    selectedTarget: "",
  });

  useEffect(() => {
    if (open) {
      if (isEditMode && initialData) {
        setFormData({
          rating: initialData.rating || 5,
          comment: initialData.comment || "",
          selectedTarget: "",
        });
      } else {
        setFormData({
          rating: 5,
          comment: "",
          selectedTarget: "",
        });
      }
      setHover(-1);
    }
  }, [open, isEditMode, initialData]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {isEditMode ? "Chỉnh sửa đánh giá" : "Viết đánh giá mới"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} py={1}>
          {!isEditMode && (
            <FormControl fullWidth>
              <InputLabel>Bạn đánh giá dịch vụ nào?</InputLabel>
              <Select
                value={formData.selectedTarget}
                label="Bạn đánh giá dịch vụ nào?"
                onChange={(e) => setFormData({ ...formData, selectedTarget: e.target.value })}
              >
                {targetOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Rating
              value={Number(formData.rating)}
              precision={1}
              size="large"
              getLabelText={getLabelText}
              onChange={(_event, newValue) => setFormData({ ...formData, rating: newValue })}
              onChangeActive={(_event, newHover) => setHover(newHover)}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
            <Box
              sx={{
                ml: 2,
                minHeight: "24px",
                fontWeight: "bold",
                color: "primary.main",
              }}
            >
              {RATING_LABELS[hover !== -1 ? hover : formData.rating]}
            </Box>
          </Box>

          <TextField
            label="Nội dung đánh giá"
            multiline
            rows={4}
            fullWidth
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isEditMode && !formData.selectedTarget}
        >
          {isEditMode ? "Cập nhật" : "Gửi đánh giá"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewFormDialog;
