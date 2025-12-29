import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
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

const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await PlaceService.getById(id);
        setPlace(res.data);
      } catch {
        toast.error("Không tìm thấy địa điểm");
        navigate("/admin/place");
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id, navigate]);

  const handleOpenImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenImageModal(true);
  };

  const handleCloseImage = () => {
    setOpenImageModal(false);
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!place) return null;

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Box>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Link component={RouterLink} to="/admin/place" color="inherit" underline="hover">
              Danh sách
            </Link>
            <Typography color="text.primary">Chi tiết</Typography>
          </Breadcrumbs>
          <Typography variant="h4" fontWeight="bold">
            {place.name}
          </Typography>
        </Box>
        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/place")}
          >
            Quay lại
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/admin/place/edit/${place.id}`)}
          >
            Chỉnh sửa
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        <Box sx={{ flex: { md: 2 }, width: "100%" }}>
          <Card elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Thông tin chung
              </Typography>
              <Stack spacing={2} mt={2}>
                <Box display="flex" gap={2}>
                  <LocationOnIcon color="action" />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Địa chỉ
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {place.address}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" gap={2}>
                  <MonetizationOnIcon color="action" />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Giá vé
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      {place.entry_fee ? `${formatPrice(place.entry_fee)}` : "Miễn phí"}
                    </Typography>
                  </Box>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Mô tả
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap", color: "text.secondary" }}
                  >
                    {place.description}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                display="flex"
                alignItems="center"
                gap={1}
              >
                <AccessTimeIcon color="primary" /> Giờ mở cửa
              </Typography>
              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 4 }}>
                {Object.keys(DAYS_VI).map((dayKey) => {
                  const slots = place.opening_hours?.[dayKey] || [];
                  const isClosed = slots.length === 0;
                  return (
                    <Box
                      key={dayKey}
                      sx={{
                        width: { xs: "100%", md: "calc(50% - 16px)" },
                        display: "flex",
                        alignItems: "flex-start",
                        p: 1.5,
                        borderBottom: "1px dashed #eee",
                        "&:hover": { bgcolor: "#f9f9f9", borderRadius: 1 },
                      }}
                    >
                      <Box
                        sx={{
                          width: 120,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: isClosed ? "error.light" : "success.main",
                          }}
                        />
                        <Typography variant="body2" fontWeight="600" color="text.primary">
                          {DAYS_VI[dayKey]}
                        </Typography>
                      </Box>
                      <Box sx={{ flexGrow: 1, textAlign: "right" }}>
                        {isClosed ? (
                          <Typography
                            variant="body2"
                            color="text.disabled"
                            sx={{ fontStyle: "italic" }}
                          >
                            Đóng cửa
                          </Typography>
                        ) : (
                          <Box display="flex" flexDirection="column" gap={0.5}>
                            {slots.map((slot, idx) => (
                              <Typography
                                key={`${slot.open}-${slot.close}-${idx}`}
                                variant="body2"
                                color="primary.main"
                                fontWeight={500}
                              >
                                {slot.open} - {slot.close}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: { md: 1 }, width: "100%", minWidth: 0 }}>
          <Card elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Thư viện ảnh ({place.images?.length || 0})
              </Typography>

              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {place.images?.length > 0 ? (
                  place.images.map((img) => (
                    <Box
                      key={img.id}
                      sx={{
                        width: "calc(50% - 4px)",
                        position: "relative",
                        aspectRatio: "4/3",
                      }}
                    >
                      <Box
                        component="img"
                        src={img.thumbnail_url || img.url}
                        alt="place thumbnail"
                        onClick={() => handleOpenImage(img.url)}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 1,
                          border: "1px solid #eee",
                          display: "block",
                          cursor: "pointer",
                          transition: "opacity 0.2s",
                          "&:hover": { opacity: 0.8 },
                        }}
                      />
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                    Chưa có hình ảnh
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* popup hiển thị ảnh */}
      <Dialog
        open={openImageModal}
        onClose={handleCloseImage}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { bgcolor: "transparent", boxShadow: "none" },
        }}
        onClick={handleCloseImage}
      >
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          sx={{
            p: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {selectedImage && (
            <Box
              sx={{
                position: "relative",
                display: "inline-flex",
                pointerEvents: "auto",
                maxWidth: "90vw",
                maxHeight: "90vh",
              }}
            >
              <IconButton
                onClick={handleCloseImage}
                size="medium"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 10,
                  bgcolor: "rgba(0,0,0,0.1)",
                  color: "white",
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.8)",
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>

              <img
                src={selectedImage}
                alt="Full Size"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: theme.shape.borderRadius * 1.5,
                }}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PlaceDetail;
