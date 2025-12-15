import { AutoAwesome, CalendarToday, Flight } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { vi } from "date-fns/locale";
import { motion } from "framer-motion";
import { useState } from "react";

const PREFERENCES = [
  { value: "culture", label: "Văn hóa & Lịch sử", icon: "🏛️" },
  { value: "food", label: "Ẩm thực", icon: "🍜" },
  { value: "nature", label: "Thiên nhiên", icon: "🌿" },
  { value: "shopping", label: "Mua sắm", icon: "🛍️" },
  { value: "nightlife", label: "Nightlife", icon: "🌃" },
  { value: "adventure", label: "Phiêu lưu", icon: "🏔️" },
  { value: "beach", label: "Biển", icon: "🏖️" },
  { value: "relax", label: "Thư giãn", icon: "🧘" },
];

const DESTINATIONS = [
  "Hà Nội",
  "Hồ Chí Minh",
  "Đà Nẵng",
  "Hội An",
  "Nha Trang",
  "Phú Quốc",
  "Đà Lạt",
  "Sapa",
  "Huế",
  "Vũng Tàu",
];

export default function ItineraryForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    destination: "",
    start_date: null,
    end_date: null,
    budget: 3000000,
    preferences: [],
    special_request: "",
    title: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const togglePreference = (pref) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter((p) => p !== pref)
        : [...prev.preferences, pref],
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.destination) {
      newErrors.destination = "Vui lòng chọn điểm đến";
    }
    if (!formData.start_date) {
      newErrors.start_date = "Vui lòng chọn ngày đi";
    }
    if (!formData.end_date) {
      newErrors.end_date = "Vui lòng chọn ngày về";
    }
    if (formData.start_date && formData.end_date && formData.start_date >= formData.end_date) {
      newErrors.end_date = "Ngày về phải sau ngày đi";
    }
    if (formData.preferences.length === 0) {
      newErrors.preferences = "Vui lòng chọn ít nhất 1 sở thích";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={1}>
                <AutoAwesome color="primary" />
                <Typography variant="h4" fontWeight={700}>
                  Tạo lịch trình với AI
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                AI sẽ tạo lịch trình chi tiết dựa trên sở thích của bạn
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Title (Optional) */}
                <TextField
                  fullWidth
                  label="Tên chuyến đi (tuỳ chọn)"
                  placeholder="VD: Hành trình khám phá Hà Nội"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Flight />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Destination */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    Điểm đến *
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {DESTINATIONS.map((dest) => (
                      <Chip
                        key={dest}
                        label={dest}
                        onClick={() => handleChange("destination", dest)}
                        color={formData.destination === dest ? "primary" : "default"}
                        variant={formData.destination === dest ? "filled" : "outlined"}
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: formData.destination === dest ? 600 : 400,
                        }}
                      />
                    ))}
                  </Stack>
                  {errors.destination && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                      {errors.destination}
                    </Typography>
                  )}
                </Box>

                {/* Dates */}
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <DatePicker
                      label="Ngày đi *"
                      value={formData.start_date}
                      onChange={(date) => handleChange("start_date", date)}
                      minDate={new Date()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.start_date,
                          helperText: errors.start_date,
                          InputProps: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarToday />
                              </InputAdornment>
                            ),
                          },
                        },
                      }}
                    />
                    <DatePicker
                      label="Ngày về *"
                      value={formData.end_date}
                      onChange={(date) => handleChange("end_date", date)}
                      minDate={formData.start_date || new Date()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.end_date,
                          helperText: errors.end_date,
                          InputProps: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarToday />
                              </InputAdornment>
                            ),
                          },
                        },
                      }}
                    />
                  </Stack>
                </LocalizationProvider>

                {/* Budget */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    Ngân sách: {formatCurrency(formData.budget)}
                  </Typography>
                  <Slider
                    value={formData.budget}
                    onChange={(_e, value) => handleChange("budget", value)}
                    min={500000}
                    max={20000000}
                    step={500000}
                    marks={[
                      { value: 500000, label: "500K" },
                      { value: 5000000, label: "5M" },
                      { value: 10000000, label: "10M" },
                      { value: 20000000, label: "20M" },
                    ]}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${(value / 1000000).toFixed(1)}M`}
                  />
                </Box>

                {/* Preferences */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    Sở thích *
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {PREFERENCES.map((pref) => (
                      <Chip
                        key={pref.value}
                        icon={<span style={{ fontSize: "1.2rem" }}>{pref.icon}</span>}
                        label={pref.label}
                        onClick={() => togglePreference(pref.value)}
                        color={formData.preferences.includes(pref.value) ? "primary" : "default"}
                        variant={formData.preferences.includes(pref.value) ? "filled" : "outlined"}
                      />
                    ))}
                  </Stack>
                  {errors.preferences && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                      {errors.preferences}
                    </Typography>
                  )}
                </Box>

                {/* Special Request */}
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Yêu cầu đặc biệt (tuỳ chọn)"
                  placeholder="VD: Tôi muốn thử món ăn đường phố authentic, tránh các địa điểm du lịch đông người"
                  value={formData.special_request}
                  onChange={(e) => handleChange("special_request", e.target.value)}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={<AutoAwesome />}
                  sx={{
                    py: 1.5,
                    fontSize: "1.1rem",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                    },
                  }}
                >
                  {loading ? "Đang tạo lịch trình..." : "Tạo lịch trình với AI ✨"}
                </Button>
              </Stack>
            </form>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
}
