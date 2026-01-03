import { AddPhotoAlternate, ArrowBack, Close, Save } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import LoadingState from "@/shared/components/LoadingState";
import FacilityService from "@/shared/services/facility.service";
import RoomService from "@/shared/services/room.service";
import formatPrice from "@/shared/utils/FormatPrice";
import toast from "@/shared/utils/toast";

const MAX_IMAGES = 10;

export default function RoomUpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price_per_night: "",
    total_rooms: 1,
    bed_number: 1,
    size_sqm: "",
    max_adult_number: 2,
    max_children_number: 0,
    view_type: "",
    status: "AVAILABLE",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  const [allFacilities, setAllFacilities] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [initialFacilities, setInitialFacilities] = useState([]);

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const [roomRes, facilityRes] = await Promise.all([
          RoomService.getById(id),
          FacilityService.getAll(),
        ]);

        const roomData = roomRes.data || roomRes;
        const facilitiesList = facilityRes.data || facilityRes;

        setFormData({
          name: roomData.name || "",
          description: roomData.description || "",
          price_per_night: roomData.price_per_night || 0,
          total_rooms: roomData.total_rooms || 1,
          bed_number: roomData.bed_number || 1,
          size_sqm: roomData.size_sqm || 0,
          max_adult_number: roomData.max_adult_number || 2,
          max_children_number: roomData.max_children_number || 0,
          view_type: roomData.view_type || "",
          status: roomData.status || "AVAILABLE",
        });

        setExistingImages(roomData.images || []);
        setAllFacilities(facilitiesList);

        const currentIds = roomData.facilities?.map((f) => f.id) || [];
        setSelectedFacilities(currentIds);
        setInitialFacilities(currentIds);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải thông tin phòng");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    if (id) initData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/\./g, "");
    if (!Number.isNaN(rawValue)) {
      setFormData((prev) => ({ ...prev, price_per_night: rawValue }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const currentTotal = existingImages.length + newFiles.length;
      const remainingSlots = MAX_IMAGES - currentTotal;

      if (remainingSlots <= 0) {
        toast.warning(`Bạn chỉ được đăng tối đa ${MAX_IMAGES} ảnh!`);
        return;
      }

      let filesToAdd = filesArray;
      if (filesArray.length > remainingSlots) {
        toast.warning(`Đã cắt bớt số lượng ảnh thừa.`);
        filesToAdd = filesArray.slice(0, remainingSlots);
      }
      setNewFiles((prev) => [...prev, ...filesToAdd]);
    }
  };

  const removeNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    setDeletedImageIds((prev) => [...prev, imageId]);
  };

  const toggleFacility = (id) => {
    setSelectedFacilities((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "total_rooms") {
          submitData.append(key, formData[key]);
        }
      });
      newFiles.forEach((file) => {
        submitData.append("images", file);
      });

      const imageActions = deletedImageIds.map((id) => ({
        action: "delete",
        image_id: id,
      }));
      if (imageActions.length > 0) {
        submitData.append("imageActions", JSON.stringify(imageActions));
      }

      const connectFacilities = selectedFacilities.filter((id) => !initialFacilities.includes(id));
      const disconnectFacilities = initialFacilities.filter(
        (id) => !selectedFacilities.includes(id),
      );

      connectFacilities.forEach((id) => {
        submitData.append("connectFacilities[]", id);
      });
      disconnectFacilities.forEach((id) => {
        submitData.append("disconnectFacilities[]", id);
      });

      await RoomService.update(id, submitData);
      toast.success("Cập nhật phòng thành công!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState />;

  const totalImages = existingImages.length + newFiles.length;

  return (
    <Box sx={{ width: "100%", p: { xs: 2, md: 3 }, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Box>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Link
              component={RouterLink}
              to="/business/services"
              color="inherit"
              underline="hover"
              sx={{ display: "flex", alignItems: "center" }}
            >
              Quản lý dịch vụ
            </Link>
            <Typography color="text.primary">Cập nhật phòng</Typography>
          </Breadcrumbs>
          <Typography variant="h4" fontWeight="bold">
            {formData.name || "Cập nhật phòng"}
          </Typography>
        </Box>

        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 3,
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            flex: 7,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Card elevation={0} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={3}>
                Thông tin cơ bản
              </Typography>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Tên phòng"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ví dụ: Deluxe King Ocean View"
                />

                <TextField
                  fullWidth
                  label="Mô tả chi tiết"
                  name="description"
                  multiline
                  rows={8}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Mô tả tiện nghi, không gian..."
                />
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={3}>
                Thông tin chi tiết
              </Typography>

              <Stack spacing={3}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Giá mỗi đêm"
                      type="text"
                      value={formatPrice(formData.price_per_night)}
                      onChange={handlePriceChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography
                              variant="caption"
                              sx={{ whiteSpace: "nowrap", color: "text.secondary" }}
                            >
                              VNĐ
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Diện tích"
                      name="size_sqm"
                      type="number"
                      value={formData.size_sqm}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography
                              variant="caption"
                              sx={{ whiteSpace: "nowrap", color: "text.secondary" }}
                            >
                              m²
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Tổng số phòng"
                      name="total_rooms"
                      value={formData.total_rooms}
                      disabled
                      helperText="Không thể thay đổi"
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Số giường"
                      name="bed_number"
                      type="number"
                      value={formData.bed_number}
                      onChange={handleChange}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Hướng nhìn"
                      name="view_type"
                      value={formData.view_type}
                      onChange={handleChange}
                      placeholder="VD: Hướng biển"
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Người lớn tối đa"
                      name="max_adult_number"
                      type="number"
                      value={formData.max_adult_number}
                      onChange={handleChange}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Trẻ em tối đa"
                      name="max_children_number"
                      type="number"
                      value={formData.max_children_number}
                      onChange={handleChange}
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <TextField
                      select
                      fullWidth
                      label="Trạng thái"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <MenuItem value="AVAILABLE">Hoạt động</MenuItem>
                      <MenuItem value="UNAVAILABLE">Tạm ngưng</MenuItem>
                      <MenuItem value="NO_LONGER_PROVIDED">Ngưng</MenuItem>
                    </TextField>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box
          sx={{
            flex: 3,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Card elevation={0} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Hình ảnh
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {totalImages}/{MAX_IMAGES}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {existingImages.map((img) => (
                  <Box
                    key={img.id}
                    sx={{
                      position: "relative",
                      width: "calc(33.33% - 8px)",
                      aspectRatio: "1/1",
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid #eee",
                    }}
                  >
                    <Box
                      component="img"
                      src={img.url}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "rgba(255,255,255,0.9)",
                        padding: "2px",
                        "&:hover": { bgcolor: "error.main", color: "white" },
                      }}
                      onClick={() => removeExistingImage(img.id)}
                    >
                      <Close sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                ))}

                {newFiles.map((file, idx) => (
                  <Box
                    key={`new-${file.name}-${idx}`}
                    sx={{
                      position: "relative",
                      width: "calc(33.33% - 8px)",
                      aspectRatio: "1/1",
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "2px solid",
                      borderColor: "primary.main",
                    }}
                  >
                    <Box
                      component="img"
                      src={URL.createObjectURL(file)}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: 0.9,
                      }}
                    />
                    <Chip
                      label="Mới"
                      size="small"
                      color="primary"
                      sx={{
                        position: "absolute",
                        top: 4,
                        left: 4,
                        height: 18,
                        fontSize: "0.6rem",
                        fontWeight: "bold",
                        boxShadow: 1,
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "rgba(255,255,255,0.9)",
                        padding: "2px",
                        "&:hover": { bgcolor: "error.main", color: "white" },
                      }}
                      onClick={() => removeNewFile(idx)}
                    >
                      <Close sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                ))}

                {totalImages < MAX_IMAGES && (
                  <Button
                    component="label"
                    variant="outlined"
                    sx={{
                      width: "calc(33.33% - 8px)",
                      aspectRatio: "1/1",
                      borderRadius: 2,
                      borderStyle: "dashed",
                      borderColor: "text.disabled",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      minWidth: 0,
                      "&:hover": { borderColor: "primary.main", bgcolor: "primary.50" },
                    }}
                  >
                    <AddPhotoAlternate color="action" />
                    <input
                      hidden
                      accept="image/*"
                      multiple
                      type="file"
                      onChange={handleFileChange}
                    />
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>

          <Box sx={{ position: "sticky", top: 24 }}>
            <Card
              elevation={0}
              sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Tiện ích phòng
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    maxHeight: 470,
                    overflowY: "auto",
                    bgcolor: "white",
                    border: "1px solid #e0e0e0",
                    p: 0,
                  }}
                >
                  {allFacilities.length > 0 ? (
                    <Box>
                      {allFacilities.map((f, index) => {
                        const isSelected = selectedFacilities.includes(f.id);
                        return (
                          <Box
                            key={f.id}
                            onClick={() => toggleFacility(f.id)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              px: 2,
                              py: 1.5,
                              cursor: "pointer",
                              borderBottom:
                                index !== allFacilities.length - 1 ? "1px solid #f0f0f0" : "none",
                              transition: "0.2s",
                              bgcolor: isSelected ? "primary.50" : "transparent",
                              "&:hover": {
                                bgcolor: isSelected ? "primary.100" : "grey.50",
                              },
                            }}
                          >
                            <Checkbox size="small" checked={isSelected} sx={{ p: 0, mr: 1.5 }} />
                            {f.icon_url && (
                              <Box
                                component="img"
                                src={f.icon_url}
                                sx={{
                                  width: 20,
                                  height: 20,
                                  mr: 1.5,
                                  objectFit: "contain",
                                }}
                              />
                            )}
                            <Typography
                              variant="body2"
                              color={isSelected ? "primary.main" : "text.primary"}
                              fontWeight={isSelected ? 500 : 400}
                            >
                              {f.name}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" align="center" py={3}>
                      Không có tiện ích nào
                    </Typography>
                  )}
                </Paper>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
