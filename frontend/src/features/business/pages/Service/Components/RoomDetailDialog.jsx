import {
  AcUnit,
  Bed,
  Close,
  Info,
  LocationOn,
  People,
  Pets,
  RateReview,
  Square,
  Star,
  Visibility,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ReviewsList from "@/shared/components/service-detail/tabs/ReviewList";
import formatPrice from "@/shared/utils/FormatPrice";
import { formatDate } from "@/shared/utils/formatDate";

const RoomDetailDialog = ({ open, onClose, data, service, reviews }) => {
  const [tabValue, setTabValue] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);

  if (!data) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            overflowY: "hidden",
            borderRadius: 3,
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          component="div"
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "grey.200",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box>
            <Typography variant="h6" component="div" fontWeight={700}>
              Chi tiết phòng
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ maxWidth: 300, display: "block" }}
            >
              {data.name}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        {/* tab */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "white", px: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: 48,
              "& .MuiTab-root": {
                minHeight: 48,
                textTransform: "none",
                fontWeight: 500,
              },
              "& .MuiTabs-flexContainer": {
                justifyContent: "space-between",
              },
            }}
          >
            <Tab icon={<Bed fontSize="small" />} iconPosition="start" label="Phòng" />
            <Tab icon={<Info fontSize="small" />} iconPosition="start" label="Dịch vụ" />
            <Tab icon={<RateReview fontSize="small" />} iconPosition="start" label={`Đánh giá`} />
          </Tabs>
        </Box>

        <DialogContent
          sx={{
            p: 0,
            minHeight: 450,
            overflowX: "hidden",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.1)",
              borderRadius: "10px",
              transition: "all 0.3s ease",
            },
            "&:hover::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.2)",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "rgba(0,0,0,0.4)",
            },
          }}
        >
          {tabValue === 0 && (
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Chip
                  label={data.status === "AVAILABLE" ? "Sẵn sàng" : "Ngưng"}
                  color={data.status === "AVAILABLE" ? "success" : "default"}
                  sx={{ fontWeight: 600, fontSize: "14px" }}
                />
                <Typography variant="h5" color="primary.main" fontWeight={800}>
                  {formatPrice(data.price_per_night)}
                  <Typography component="span" variant="body2" color="text.secondary">
                    /đêm
                  </Typography>
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                {data.images && data.images.length > 0 ? (
                  <ImageList
                    cols={2}
                    rowHeight={120}
                    gap={5}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      border: "1.5px solid #eee",
                    }}
                  >
                    {data.images.slice(0, 10).map((img, index) => (
                      <ImageListItem
                        key={img.id || index}
                        cols={index === 0 ? 2 : 1}
                        rows={index === 0 ? 2 : 1}
                        onClick={() => setPreviewImage(img)}
                        sx={{ cursor: "pointer" }}
                      >
                        <img
                          src={img.thumbnail_url || img.url}
                          alt="Room"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                ) : (
                  <Box
                    sx={{
                      height: 180,
                      bgcolor: "grey.200",
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography color="text.secondary">Không có ảnh</Typography>
                  </Box>
                )}
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                paragraph
                sx={{ mb: 3, fontStyle: "italic" }}
              >
                {data.description || "Chưa có mô tả chi tiết."}
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: "1rem",
                  mb: 2,
                }}
              >
                <Bed color="primary" fontSize="small" /> Thông số phòng
              </Typography>

              <Paper
                sx={{
                  bgcolor: "white",
                  py: 2,
                  borderRadius: 3,
                  border: "1.5px solid #ddd",
                  mb: 3,
                }}
                elevation={0}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  divider={
                    <Divider orientation="vertical" flexItem sx={{ border: "1px solid #ddd" }} />
                  }
                >
                  <Box textAlign="center" flex={1}>
                    <People color="action" fontSize="small" sx={{ mb: 0.5 }} />
                    <Typography variant="caption" display="block" color="text.secondary">
                      Sức chứa
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {data.max_adult_number} Người lớn, {data.max_children_number} Trẻ em
                    </Typography>
                  </Box>
                  <Box textAlign="center" flex={1}>
                    <Bed color="action" fontSize="small" sx={{ mb: 0.5 }} />
                    <Typography variant="caption" display="block" color="text.secondary">
                      Số giường
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {data.bed_number} Giường
                    </Typography>
                  </Box>
                  <Box textAlign="center" flex={1}>
                    <Square color="action" fontSize="small" sx={{ mb: 0.5 }} />
                    <Typography variant="caption" display="block" color="text.secondary">
                      Diện tích
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {data.size_sqm > 0 ? `${data.size_sqm} m²` : "__ m²"}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Visibility color="action" fontSize="small" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Tầm nhìn
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {data.view_type || "Tầm nhìn cơ bản"}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Pets color={data.pet_allowed ? "success" : "action"} fontSize="small" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Thú cưng
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={data.pet_allowed ? "success.main" : "text.primary"}
                      >
                        {data.pet_allowed ? "Cho phép mang theo" : "Không cho phép"}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="body1" fontWeight={600} gutterBottom sx={{ mb: 1.5 }}>
                Tiện nghi sẵn có
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {data.facilities?.map((fac) => (
                  <Chip
                    key={fac.id}
                    label={fac.name}
                    size="small"
                    variant="outlined"
                    avatar={
                      fac.icon_url ? (
                        <Avatar
                          src={fac.icon_url}
                          variant="square"
                          sx={{ width: 16, height: 16, bgcolor: "transparent" }}
                        />
                      ) : (
                        <Avatar sx={{ width: 16, height: 16, bgcolor: "transparent" }}>
                          <AcUnit fontSize="small" sx={{ color: "action.active" }} />
                        </Avatar>
                      )
                    }
                  />
                ))}
              </Box>
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ bgcolor: "white", p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 2,
                  mb: 1,
                }}
              >
                <Box>
                  <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1.3 }}>
                    {service?.name}
                  </Typography>
                  {service?.location && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 0.5,
                        color: "text.secondary",
                      }}
                    >
                      <LocationOn fontSize="small" />
                      <Typography variant="body2">{service.location}</Typography>
                    </Box>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    bgcolor: "grey.100",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1.5,
                  }}
                >
                  <Star sx={{ color: "orange", fontSize: 18 }} />
                  <Typography fontWeight={700}>{service?.rating || 4.5}</Typography>
                </Box>
              </Box>

              <Paper variant="outlined" sx={{ p: 2, my: 3, borderRadius: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  textTransform="uppercase"
                >
                  Khoảng giá tham khảo
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  {formatPrice(service?.price_min) || 0} {" - "}{" "}
                  {formatPrice(service?.price_max) || 0}
                </Typography>
              </Paper>

              <Box>
                <Typography variant="subtitle2" mb={1}>
                  Giới thiệu
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7, textAlign: "justify" }}
                >
                  {service?.description || "Chưa có mô tả"}
                </Typography>
              </Box>

              <Divider sx={{ mt: 4, mb: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Typography variant="caption" color="text.disabled">
                  Cập nhật lần cuối: {formatDate(service?.updated_at)}
                </Typography>
              </Box>
            </Box>
          )}

          {tabValue === 2 && (
            <Box sx={{ px: 3 }}>
              <ReviewsList reviews={reviews || []} />
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* preview iamge dialog */}
      <Dialog open={Boolean(previewImage)} onClose={() => setPreviewImage(null)} maxWidth="lg">
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={() => setPreviewImage(null)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              bgcolor: "rgba(0,0,0,0.4)",
              color: "white",
            }}
          >
            <Close />
          </IconButton>
          <img src={previewImage?.url} alt="Full" style={{ maxWidth: "100%", maxHeight: "90vh" }} />
        </Box>
      </Dialog>
    </>
  );
};

export default RoomDetailDialog;
