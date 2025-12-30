import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Dialog,
  IconButton,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import LoadingState from "@/shared/components/LoadingState";
import toast from "@/shared/utils/toast";
import JournalService from "../../services/journal.service";

const JournalEditorPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [formData, setFormData] = useState({ title: "", content: "" });

  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  const [openLightbox, setOpenLightbox] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState([]);

  useEffect(() => {
    if (isEdit) {
      const fetchDetail = async () => {
        setFetching(true);
        try {
          const res = await JournalService.getById(id);
          const data = res.data;
          setFormData({ title: data.title, content: data.content || "" });
          setExistingImages(data.images || []);
        } catch {
          toast.error("Không tìm thấy bài viết");
          navigate("/journal");
        } finally {
          setFetching(false);
        }
      };
      fetchDetail();
    }
  }, [id, isEdit, navigate]);

  useEffect(() => {
    const oldImgs = existingImages.map((img) => img.url);
    const newImgs = previewImages;
    setLightboxImages([...oldImgs, ...newImgs]);
  }, [existingImages, previewImages]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const totalCurrent = existingImages.length + newImages.length + files.length;
    if (totalCurrent > 10) {
      toast.warning("Tối đa 10 ảnh thôi nhé!");
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
    const newUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newUrls]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imgId) => {
    setDeletedImageIds((prev) => [...prev, { id: imgId, delete: true }]);
    setExistingImages((prev) => prev.filter((img) => img.id !== imgId));
  };

  const handleOpenLightbox = (index) => {
    setActiveImageIndex(index);
    setOpenLightbox(true);
  };
  const handleCloseLightbox = () => setOpenLightbox(false);
  const handleNextImage = () => setActiveImageIndex((prev) => (prev + 1) % lightboxImages.length);
  const handlePrevImage = () =>
    setActiveImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);

  const handleSubmit = async () => {
    if (!formData.title.trim()) return toast.error("Vui lòng nhập tiêu đề");

    try {
      setLoading(true);
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("content", formData.content);

      newImages.forEach((file) => {
        payload.append("images", file);
      });

      if (isEdit && deletedImageIds.length > 0) {
        payload.append("imageUpdates", JSON.stringify(deletedImageIds));
      }

      if (isEdit) {
        await JournalService.update(id, payload);
        toast.success("Cập nhật thành công");
      } else {
        await JournalService.create(payload);
        toast.success("Đăng bài thành công");
      }
      navigate("/journal");
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingState />;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9f9f9", pb: 2 }}>
      <Container maxWidth="lg" sx={{ py: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Box>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
              <Link component={RouterLink} to="/journal" color="inherit" underline="hover">
                Nhật ký
              </Link>
              <Typography variant="body1" color="text.primary">
                {isEdit ? "Chỉnh sửa" : "Viết mới"}
              </Typography>
            </Breadcrumbs>
            <Typography variant="h5" fontWeight="bold">
              {isEdit ? "Chỉnh sửa bài viết" : "Chia sẻ hành trình mới"}
            </Typography>
          </Box>
          <Stack direction="row" gap={2}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/journal")}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              disabled={loading}
              sx={{ px: 4 }}
            >
              {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Đăng bài"}
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
          <Paper
            elevation={0}
            sx={{
              flex: 2,
              p: 4,
              borderRadius: 2,
              border: "1px solid #e0e0e0",
              height: "fit-content",
            }}
          >
            <Stack spacing={3}>
              <TextField
                label="Tiêu đề chuyến đi"
                variant="outlined"
                fullWidth
                placeholder="Ví dụ: 3 ngày lạc lối ở Hà Giang..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                InputProps={{ style: { fontSize: 16, fontWeight: 550 } }}
              />
              <TextField
                label="Nội dung chi tiết"
                variant="outlined"
                fullWidth
                multiline
                minRows={10}
                placeholder="Kể về chuyến đi của bạn..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                sx={{ "& .MuiInputBase-root": { alignItems: "flex-start" } }}
              />
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 2,
              border: "1px solid #e0e0e0",
              height: "fit-content",
              position: "sticky",
              top: 20,
              minWidth: 300,
              minHeight: 409,
            }}
          >
            <Typography variant="h6" fontSize={16} fontWeight={550} mb={2}>
              Hình ảnh ({existingImages.length + newImages.length}/10)
            </Typography>

            <Box mb={3}>
              <Button
                component="label"
                variant="outlined"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{ borderStyle: "dashed", height: 50, textTransform: "none" }}
              >
                Tải ảnh lên
                <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
              </Button>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
              {" "}
              {existingImages.map((img, index) => (
                <Box
                  role="button"
                  tabIndex={0}
                  key={img.id}
                  onClick={() => handleOpenLightbox(index)}
                  sx={{
                    position: "relative",
                    aspectRatio: "1/1",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid #eee",
                  }}
                >
                  <img
                    src={img.thumbnail_url || img.url}
                    alt="old"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExistingImage(img.id);
                    }}
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      p: 0.5,
                      bgcolor: "rgba(255,255,255,0.8)",
                      color: "error.main",
                      "&:hover": { bgcolor: "white" },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              ))}
              {previewImages.map((url, idx) => (
                <Box
                  onClick={() => handleOpenLightbox(existingImages.length + idx)}
                  key={url}
                  sx={{
                    position: "relative",
                    aspectRatio: "1/1",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "2px solid #1976d2",
                  }}
                >
                  <img
                    src={url}
                    alt="new"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNewImage(idx);
                    }}
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      p: 0.5,
                      bgcolor: "rgba(255,255,255,0.8)",
                      color: "error.main",
                      "&:hover": { bgcolor: "white" },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      width: "100%",
                      bgcolor: "#1976d2",
                      color: "white",
                      fontSize: 9,
                      textAlign: "center",
                      py: 0.2,
                    }}
                  >
                    MỚI
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* xem ảnh */}
      <Dialog
        fullScreen
        open={openLightbox}
        onClose={handleCloseLightbox}
        sx={{ "& .MuiDialog-paper": { bgcolor: "black" } }}
      >
        <IconButton
          onClick={handleCloseLightbox}
          sx={{ position: "absolute", top: 20, right: 20, color: "white", zIndex: 10 }}
        >
          <CloseIcon />
        </IconButton>
        <IconButton
          onClick={handlePrevImage}
          sx={{ position: "absolute", top: "50%", left: 20, color: "white", zIndex: 10 }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleCloseLightbox}
        >
          <Box onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImages[activeImageIndex]}
              alt="Fullsize"
              style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain" }}
            />
          </Box>
        </Box>

        <IconButton
          onClick={handleNextImage}
          sx={{ position: "absolute", top: "50%", right: 20, color: "white", zIndex: 10 }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
        <Typography
          sx={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
          }}
        >
          {activeImageIndex + 1} / {lightboxImages.length}
        </Typography>
      </Dialog>
    </Box>
  );
};

export default JournalEditorPage;
