import {
  Close,
  DirectionsCar,
  Hotel,
  LocationOn,
  Museum,
  Restaurant,
  ShoppingBag,
  TheaterComedy,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const ACTIVITY_TYPES = [
  {
    value: "RESTAURANT",
    label: "Nhà hàng",
    icon: Restaurant,
    color: "#FF6B6B",
  },
  {
    value: "ATTRACTION",
    label: "Điểm tham quan",
    icon: Museum,
    color: "#4ECDC4",
  },
  { value: "ACCOMMODATION", label: "Chỗ ở", icon: Hotel, color: "#45B7D1" },
  {
    value: "TRANSPORT",
    label: "Di chuyển",
    icon: DirectionsCar,
    color: "#FFA07A",
  },
  { value: "SHOPPING", label: "Mua sắm", icon: ShoppingBag, color: "#98D8C8" },
  {
    value: "ENTERTAINMENT",
    label: "Giải trí",
    icon: TheaterComedy,
    color: "#F7B731",
  },
  { value: "OTHER", label: "Khác", icon: LocationOn, color: "#95A5A6" },
];

export default function AddActivityDialog({ open, onClose, onAdd, dayNumber }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    exact_address: "",
    type: "RESTAURANT",
    time: "09:00",
    duration: 60,
    estimated_cost: 0,
    user_notes: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tên hoạt động";
    }
    if (!formData.time) {
      newErrors.time = "Vui lòng chọn thời gian";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onAdd(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      title: "",
      description: "",
      exact_address: "",
      type: "RESTAURANT",
      time: "09:00",
      duration: 60,
      estimated_cost: 0,
      user_notes: "",
    });
    setErrors({});
    onClose();
  };

  const selectedType = ACTIVITY_TYPES.find((t) => t.value === formData.type);
  const TypeIcon = selectedType?.icon || LocationOn;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                bgcolor: selectedType?.color,
                color: "white",
                borderRadius: 2,
                p: 1,
                display: "flex",
              }}
            >
              <TypeIcon />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              Thêm hoạt động - Ngày {dayNumber}
            </Typography>
          </Stack>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* Activity Type */}
          <FormControl fullWidth>
            <InputLabel>Loại hoạt động *</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              label="Loại hoạt động *"
            >
              {ACTIVITY_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <MenuItem key={type.value} value={type.value}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          bgcolor: type.color,
                          color: "white",
                          borderRadius: 1,
                          p: 0.5,
                          display: "flex",
                        }}
                      >
                        <Icon fontSize="small" />
                      </Box>
                      <Typography>{type.label}</Typography>
                    </Stack>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {/* Title */}
          <TextField
            label="Tên hoạt động *"
            fullWidth
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            placeholder="VD: Phở Gia Truyền Bát Đàn"
          />

          {/* Description */}
          <TextField
            label="Mô tả"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Mô tả chi tiết về hoạt động này..."
          />

          {/* Address */}
          <TextField
            label="Địa chỉ"
            fullWidth
            value={formData.exact_address}
            onChange={(e) => handleChange("exact_address", e.target.value)}
            placeholder="49 Bát Đàn, Hoàn Kiếm, Hà Nội"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn />
                </InputAdornment>
              ),
            }}
          />

          {/* Time & Duration */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Thời gian *"
              type="time"
              value={formData.time}
              onChange={(e) => handleChange("time", e.target.value)}
              error={!!errors.time}
              helperText={errors.time}
              fullWidth
            />
            <TextField
              label="Thời lượng (phút)"
              type="number"
              value={formData.duration}
              onChange={(e) => handleChange("duration", parseInt(e.target.value, 10) || 0)}
              fullWidth
              inputProps={{ min: 0, step: 15 }}
            />
          </Stack>

          {/* Cost */}
          <TextField
            label="Chi phí dự kiến (VNĐ)"
            type="number"
            value={formData.estimated_cost}
            onChange={(e) => handleChange("estimated_cost", parseFloat(e.target.value) || 0)}
            fullWidth
            inputProps={{ min: 0, step: 10000 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">₫</InputAdornment>,
            }}
          />

          {/* User Notes */}
          <TextField
            label="Ghi chú cá nhân"
            fullWidth
            multiline
            rows={2}
            value={formData.user_notes}
            onChange={(e) => handleChange("user_notes", e.target.value)}
            placeholder="Thêm ghi chú để nhớ..."
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" size="large">
          Thêm hoạt động
        </Button>
      </DialogActions>
    </Dialog>
  );
}
