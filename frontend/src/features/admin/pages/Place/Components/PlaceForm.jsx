import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import FormInput from "@/shared/components/FormInput";
import PlaceService from "@/shared/services/place.service";
import formatPrice from "@/shared/utils/FormatPrice";
import toast from "@/shared/utils/toast";

const DAYS_VI = {
  monday: "Thứ 2",
  tuesday: "Thứ 3",
  wednesday: "Thứ 4",
  thursday: "Thứ 5",
  friday: "Thứ 6",
  saturday: "Thứ 7",
  sunday: "Chủ nhật",
};
const DAYS_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const PlaceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    entry_fee: 0,
    opening_hours: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    newImages: [],
  });
  const [existingImages, setExistingImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  const loadPlaceDetail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await PlaceService.getById(id);
      const data = res.data;
      const defaultHours = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      };
      const hours = data.opening_hours ? { ...defaultHours, ...data.opening_hours } : defaultHours;

      setFormData({
        name: data.name,
        description: data.description || "",
        address: data.address || "",
        entry_fee: data.entry_fee || 0,
        opening_hours: hours,
        newImages: [],
      });
      setExistingImages(data.images || []);
    } catch {
      toast.error("Không tìm thấy địa điểm");
      navigate("/admin/place");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isEdit) loadPlaceDetail();
  }, [isEdit, loadPlaceDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "entry_fee") {
      const numValue = parseFloat(value);
      if (numValue < 0) {
        toast.error("Giá vé không được nhỏ hơn 0");
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: Number.isNaN(numValue) ? 0 : numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSlot = (dayKey) => {
    setFormData((prev) => ({
      ...prev,
      opening_hours: {
        ...prev.opening_hours,
        [dayKey]: [...(prev.opening_hours[dayKey] || []), { open: "08:00", close: "17:00" }],
      },
    }));
  };
  const handleRemoveSlot = (dayKey, index) => {
    setFormData((prev) => ({
      ...prev,
      opening_hours: {
        ...prev.opening_hours,
        [dayKey]: prev.opening_hours[dayKey].filter((_, i) => i !== index),
      },
    }));
  };
  const handleTimeChange = (dayKey, index, field, value) => {
    const newDaySlots = [...formData.opening_hours[dayKey]];
    newDaySlots[index] = { ...newDaySlots[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      opening_hours: { ...prev.opening_hours, [dayKey]: newDaySlots },
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const totalImages = existingImages.length + formData.newImages.length + files.length;
    if (totalImages > 10) {
      toast.warning("Tối đa 10 ảnh thôi nhé!");
      return;
    }
    setFormData((prev) => ({ ...prev, newImages: [...prev.newImages, ...files] }));
    const newPreviews = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };
  const removeNewImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
    }));
  };
  const removeExistingImage = (imgId) => {
    setDeletedImageIds((prev) => [...prev, imgId]);
    setExistingImages((prev) => prev.filter((img) => img.id !== imgId));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên địa điểm");
      return;
    }

    if (formData.entry_fee < 0) {
      toast.error("Giá vé không được là số âm");
      return;
    }

    try {
      setLoading(true);
      const cleanOpeningHours = {};
      DAYS_KEYS.forEach((day) => {
        const slots = formData.opening_hours[day] || [];
        cleanOpeningHours[day] = slots.filter((s) => s.open && s.close);
      });

      const payload = {
        ...formData,
        opening_hours: cleanOpeningHours,
      };

      if (isEdit) {
        await PlaceService.update(id, { ...payload, deletedImageIds });
        toast.success("Cập nhật thành công");
      } else {
        await PlaceService.create({ ...payload, images: formData.newImages });
        toast.success("Tạo mới thành công");
      }
      navigate("/admin/place");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", pb: 10, p: { xs: 2, md: 4 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Box>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Link component={RouterLink} to="/admin/place" color="inherit" underline="hover">
              Quản lý
            </Link>
            <Typography color="text.primary">{isEdit ? "Sửa đổi" : "Tạo mới"}</Typography>
          </Breadcrumbs>
          <Typography variant="h4" fontWeight="bold">
            {isEdit ? "Cập nhật địa điểm" : "Thêm địa điểm mới"}
          </Typography>
        </Box>
        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/place")}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu lại"}
          </Button>
        </Stack>
      </Stack>

      <Stack spacing={3}>
        <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              mb={3}
              display="flex"
              alignItems="center"
              gap={1}
            >
              Thông tin cơ bản
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <FormInput
                name="name"
                label="Tên địa điểm"
                placeholder="Ví dụ: Chùa Bà Châu Đốc"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
                  gap: 3,
                }}
              >
                <FormInput
                  name="entry_fee"
                  label="Giá vé (VNĐ)"
                  type="number"
                  placeholder="0"
                  value={formData.entry_fee}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  helperText={formData.entry_fee > 0 ? formatPrice(formData.entry_fee) : "Miễn phí"}
                />
                <FormInput
                  name="address"
                  label="Địa chỉ"
                  placeholder="Số nhà, đường, phường..."
                  value={formData.address}
                  onChange={handleChange}
                />
              </Box>

              <FormInput
                name="description"
                label="Mô tả"
                multiline
                rows={4}
                placeholder="Giới thiệu về địa điểm..."
                value={formData.description}
                onChange={handleChange}
              />
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Box mb={3}>
              <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                Thời gian hoạt động
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thời gian mở/đóng cửa cho từng ngày.
              </Typography>
            </Box>

            <Stack spacing={0} divider={<Divider flexItem />}>
              {DAYS_KEYS.map((dayKey) => {
                const slots = formData.opening_hours[dayKey] || [];
                const isClosed = slots.length === 0;

                return (
                  <Box
                    key={`${dayKey}`}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "120px 1fr" },
                      gap: 2,
                      py: 2,
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography
                        fontWeight="bold"
                        color={isClosed ? "text.disabled" : "text.primary"}
                      >
                        {DAYS_VI[dayKey]}
                      </Typography>
                      {isClosed && (
                        <Typography variant="caption" color="error">
                          Đóng cửa
                        </Typography>
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Stack spacing={1}>
                        {slots.map((slot, index) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: Index is necessary because don't have id
                          <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box width={180}>
                              <FormInput
                                type="time"
                                value={slot.open}
                                onChange={(e) =>
                                  handleTimeChange(dayKey, index, "open", e.target.value)
                                }
                                size="small"
                                sx={{ mb: 0 }}
                              />
                            </Box>
                            <Typography>-</Typography>
                            <Box width={180}>
                              <FormInput
                                type="time"
                                value={slot.close}
                                onChange={(e) =>
                                  handleTimeChange(dayKey, index, "close", e.target.value)
                                }
                                size="small"
                                sx={{ mb: 0 }}
                              />
                            </Box>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleRemoveSlot(dayKey, index)}
                            >
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                          </Box>
                        ))}
                      </Stack>

                      <Button
                        startIcon={<AddCircleOutlineIcon />}
                        size="small"
                        onClick={() => handleAddSlot(dayKey)}
                        sx={{
                          whiteSpace: "nowrap",
                          height: "fit-content",
                        }}
                      >
                        Thêm khung giờ
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              mb={3}
              display="flex"
              alignItems="center"
              gap={1}
            >
              Thư viện ảnh
            </Typography>
            <Box
              component="label"
              sx={{
                border: `2px dashed ${theme.palette.grey[400]}`,
                borderRadius: 2,
                bgcolor: theme.palette.grey[50],
                p: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                  borderColor: "primary.main",
                },
              }}
            >
              <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
              <CloudUploadIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
              <Typography variant="h5" color="text.secondary">
                Kéo thả hoặc click để tải ảnh lên
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Hỗ trợ JPG, PNG, WEBP (Tối đa 10 ảnh)
              </Typography>
            </Box>

            <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", gap: 2 }}>
              {previewImages.map((img, index) => (
                <Box
                  key={img.url || `new-${index}`}
                  sx={{
                    position: "relative",
                    width: 160,
                    height: 120,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: `1px solid ${theme.palette.primary.main}`,
                  }}
                >
                  <Box
                    component="img"
                    src={img.url}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <Tooltip title="Xóa ảnh này">
                    <IconButton
                      size="small"
                      onClick={() => removeNewImage(index)}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "rgba(255,255,255,0.9)",
                        color: "error.main",
                        "&:hover": { bgcolor: "white" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      width: "100%",
                      bgcolor: "primary.main",
                      color: "white",
                      fontSize: 10,
                      textAlign: "center",
                      py: 0.5,
                    }}
                  >
                    MỚI
                  </Box>
                </Box>
              ))}
              {existingImages.map((img) => (
                <Box
                  key={img.id}
                  sx={{
                    position: "relative",
                    width: 160,
                    height: 120,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box
                    component="img"
                    src={img.thumbnail_url || img.url}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <Tooltip title="Xóa ảnh này">
                    <IconButton
                      size="small"
                      onClick={() => removeExistingImage(img.id)}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "rgba(255,255,255,0.9)",
                        color: "error.main",
                        "&:hover": { bgcolor: "white" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default PlaceForm;
