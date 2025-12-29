import { ChevronLeft, ChevronRight, Close, Expand } from "@mui/icons-material";
import {
  Box,
  Card,
  CardMedia,
  Dialog,
  Grid,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import { useState } from "react";

const ImageGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (!images.length) return null;

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImage = images[selectedImage]?.url || images[selectedImage];

  return (
    <>
      <Card sx={{ mb: 3, position: "relative", overflow: "hidden" }}>
        <Box sx={{ position: "relative", height: 400 }}>
          {imageLoading && <Skeleton variant="rectangular" width="100%" height={400} />}
          <CardMedia
            component="img"
            image={currentImage}
            alt={`Phòng ${selectedImage + 1}`}
            sx={{
              height: 400,
              objectFit: "cover",
              display: imageLoading ? "none" : "block",
              cursor: "pointer",
            }}
            onClick={() => setFullscreenOpen(true)}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />

          <IconButton
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
            onClick={() => setFullscreenOpen(true)}
          >
            <Expand />
          </IconButton>

          {images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                }}
              >
                <ChevronRight />
              </IconButton>
            </>
          )}
        </Box>

        {images.length > 1 && (
          <Grid container spacing={1} sx={{ mt: 2, px: 2, pb: 2 }}>
            {images.slice(0, 6).map((img, idx) => (
              <Grid size={{ xs: 4, sm: 2 }} key={img}>
                <Card
                  sx={{
                    cursor: "pointer",
                    border: selectedImage === idx ? "3px solid" : "1px solid",
                    borderColor: selectedImage === idx ? "primary.main" : "grey.300",
                    overflow: "hidden",
                  }}
                  onClick={() => {
                    setSelectedImage(idx);
                    setImageLoading(true);
                  }}
                >
                  <CardMedia
                    component="img"
                    height="80"
                    image={img.url || img}
                    alt={`Thumbnail ${idx + 1}`}
                    sx={{ objectFit: "cover" }}
                  />
                </Card>
              </Grid>
            ))}
            {images.length > 6 && (
              <Grid size={{ xs: 12 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ mt: 1, cursor: "pointer" }}
                  onClick={() => setFullscreenOpen(true)}
                >
                  Xem thêm {images.length - 6} ảnh khác
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </Card>

      <Dialog
        open={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{ sx: { bgcolor: "black", m: 0 } }}
      >
        <Box sx={{ position: "relative", height: "100vh" }}>
          <IconButton
            onClick={() => setFullscreenOpen(false)}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "white",
              zIndex: 10,
              bgcolor: "rgba(0,0,0,0.5)",
            }}
          >
            <Close />
          </IconButton>

          {images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  fontSize: 50,
                  zIndex: 10,
                }}
              >
                <ChevronLeft fontSize="large" />
              </IconButton>
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  fontSize: 50,
                  zIndex: 10,
                }}
              >
                <ChevronRight fontSize="large" />
              </IconButton>
            </>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <img
              src={currentImage}
              alt={`Phòng fullscreen ${selectedImage + 1}`}
              style={{
                maxWidth: "100%",
                maxHeight: "100vh",
                objectFit: "contain",
              }}
            />
          </Box>

          <Typography
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              color: "white",
              bgcolor: "rgba(0,0,0,0.6)",
              px: 2,
              py: 1,
              borderRadius: 2,
            }}
          >
            {selectedImage + 1} / {images.length}
          </Typography>
        </Box>
      </Dialog>
    </>
  );
};

export default ImageGallery;
