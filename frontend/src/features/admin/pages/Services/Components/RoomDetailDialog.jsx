import { AcUnit, Bed, Close, People, Pets, Square, Visibility } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import formatPrice from "@/shared/utils/FormatPrice";

const RoomDetailDialog = ({ open, onClose, data }) => {
  const [previewImage, setPreviewImage] = useState(null);

  if (!data) return null;

  const isAvailable = data.status === "AVAILABLE";

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
        <DialogTitle
          component="div"
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "grey.200",
          }}
        >
          <Typography variant="h6" component="div" fontWeight={700}>
            Chi tiết phòng: {data.name}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ px: 3 }}>
          <Grid>
            {" "}
            <Grid item xs={12} md={5}>
              {data.images && data.images.length > 0 ? (
                <ImageList cols={2} rowHeight={120} gap={5}>
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
                        alt={`Room ${index}`}
                        loading="lazy"
                        style={{
                          borderRadius: 8,
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              ) : (
                <Box
                  sx={{
                    height: 200,
                    bgcolor: "grey.200",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <Typography color="text.secondary">Không có ảnh</Typography>
                </Box>
              )}
            </Grid>
            <Grid>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Chip
                  label={isAvailable ? "Đang hoạt động" : "Tạm ngưng"}
                  color={isAvailable ? "success" : "default"}
                  variant="filled"
                  size="small"
                />
                <Typography variant="h5" color="primary.main" fontWeight={700}>
                  {formatPrice(data.price_per_night)}{" "}
                  <Typography component="span" variant="body2" color="text.secondary">
                    /đêm
                  </Typography>
                </Typography>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
                sx={{ fontStyle: "italic", whiteSpace: "pre-line", mb: 2 }}
              >
                {data.description || "Chưa có mô tả"}
              </Typography>

              <Divider sx={{ my: 2 }}>Thông số</Divider>

              <Grid container spacing={2}>
                <Grid>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <People fontSize="small" color="action" />
                    <Typography variant="body2">
                      {data.max_adult_number} Người lớn, {data.max_children_number} Trẻ em
                    </Typography>
                  </Stack>
                </Grid>

                <Grid>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Bed fontSize="small" color="action" />
                    <Typography variant="body2">{data.bed_number} Giường</Typography>
                  </Stack>
                </Grid>

                {data.size_sqm && (
                  <Grid>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Square fontSize="small" color="action" />
                      <Typography variant="body2">{data.size_sqm}</Typography>
                    </Stack>
                  </Grid>
                )}

                {data.view_type && (
                  <Grid>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Visibility fontSize="small" color="action" />
                      <Typography variant="body2">{data.view_type}</Typography>
                    </Stack>
                  </Grid>
                )}

                <Grid>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Pets fontSize="small" color={data.pet_allowed ? "success" : "disabled"} />
                    <Typography
                      variant="body2"
                      color={data.pet_allowed ? "success.main" : "text.secondary"}
                    >
                      {data.pet_allowed ? "Cho phép thú cưng" : "Không cho phép thú cưng"}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }}>Tiện nghi</Divider>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {data.facilities?.map((fac) => (
                  <Chip
                    key={fac.id}
                    label={fac.name}
                    size="small"
                    avatar={
                      fac.icon_url ? (
                        <Avatar
                          src={fac.icon_url}
                          variant="square"
                          sx={{ width: 24, height: 24 }}
                        />
                      ) : (
                        <Avatar
                          variant="square"
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: "grey.200",
                            color: "grey.600",
                          }}
                        >
                          <AcUnit sx={{ fontSize: 16 }} />
                        </Avatar>
                      )
                    }
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: "grey.200" }}>
          <Button onClick={onClose} variant="contained" color="primary" sx={{ fontSize: "13px" }}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* dialog xem ảnh */}
      <Dialog
        open={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        maxWidth="lg"
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
            overflow: "hidden",
          },
        }}
      >
        <Box sx={{ position: "relative", maxWidth: "100%", maxHeight: "100%" }}>
          <IconButton
            onClick={() => setPreviewImage(null)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
          >
            <Close />
          </IconButton>

          {previewImage && (
            <img
              src={previewImage.url || previewImage.thumbnail_url}
              alt="Room Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default RoomDetailDialog;
