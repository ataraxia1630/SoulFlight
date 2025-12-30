import {
  AddShoppingCart,
  Bed,
  Close as CloseIcon,
  Hotel,
  People,
  Pets,
  Square,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/app/store";
import formatPrice from "@/shared/utils/FormatPrice";

const RoomsList = ({ rooms }) => {
  const [openImageObj, setOpenImageObj] = useState(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleOpenImage = (imgUrl) => {
    setOpenImageObj(imgUrl);
  };

  const handleCloseImage = () => {
    setOpenImageObj(null);
  };

  if (!rooms || rooms.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Không có phòng nào
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {rooms.map((room) => {
        const isAvailable = room.status === "AVAILABLE";

        return (
          <Card
            key={room.id}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              mb: 3,
              borderRadius: 2,
              boxShadow: 2,
              overflow: "hidden",
            }}
          >
            <Box sx={{ width: { xs: "100%", sm: 300 }, flexShrink: 0 }}>
              {room.images && room.images.length > 0 ? (
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 200, sm: 300 },
                    overflowY: "auto",
                    p: 0,
                    display: "grid",
                    gridTemplateColumns: room.images.length === 1 ? "1fr" : "repeat(2, 1fr)",
                    autoRows: "150px",
                    gap: 1,
                    "&::-webkit-scrollbar": { width: "6px" },
                    "&::-webkit-scrollbar-track": { background: "transparent" },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "rgba(0,0,0,0.1)",
                      borderRadius: "10px",
                    },
                    "&:hover::-webkit-scrollbar-thumb": {
                      backgroundColor: "rgba(0,0,0,0.5)",
                    },
                  }}
                >
                  {room.images.slice(0, 10).map((img, index) => {
                    const isOddTotal = room.images.length % 2 !== 0;
                    const isFirstImage = index === 0;
                    const shouldSpanFull = isOddTotal && isFirstImage && room.images.length > 1;

                    return (
                      <Box
                        key={img.id}
                        sx={{
                          position: "relative",
                          gridColumn: shouldSpanFull ? "span 2" : "span 1",
                          height: "100%",
                          overflow: "hidden",
                          cursor: "pointer",
                        }}
                        onClick={() => handleOpenImage(img.url)}
                      >
                        <Box
                          component="img"
                          src={img.thumbnail_url || img.url}
                          alt={`Room image ${index + 1}`}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                            "&:hover": { transform: "scale(1.1)" },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 200, sm: 300 },
                    bgcolor: "grey.200",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Hotel sx={{ fontSize: 60, color: "grey.400" }} />
                </Box>
              )}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <CardContent sx={{ flex: "1 0 auto", p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {room.name}
                    </Typography>
                    <Chip
                      label={isAvailable ? "Còn phòng" : "Hết phòng"}
                      color={isAvailable ? "success" : "default"}
                      size="small"
                      sx={{ mt: 0.5, fontWeight: 600 }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    fontWeight={700}
                    sx={{ minWidth: "max-content", ml: 2 }}
                  >
                    {formatPrice(room.price_per_night)}
                    <Typography component="span" variant="body2" color="text.secondary">
                      /đêm
                    </Typography>
                  </Typography>
                </Box>

                {room.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {room.description}
                  </Typography>
                )}

                <Divider sx={{ borderStyle: "dashed", my: 1 }} />

                <Stack spacing={1} mt={1}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {room.max_adult_number && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <People sx={{ fontSize: 18, color: "action.active" }} />
                        <Typography variant="body2" color="text.secondary">
                          {room.max_adult_number} người lớn
                        </Typography>
                      </Box>
                    )}

                    {room.max_children_number > 0 && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <People sx={{ fontSize: 18, color: "action.active" }} />
                        <Typography variant="body2" color="text.secondary">
                          {room.max_children_number} trẻ em
                        </Typography>
                      </Box>
                    )}

                    {room.bed_number && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Bed sx={{ fontSize: 18, color: "action.active" }} />
                        <Typography variant="body2" color="text.secondary">
                          {room.bed_number} giường
                        </Typography>
                      </Box>
                    )}

                    {room.size_sqm && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Square sx={{ fontSize: 18, color: "action.active" }} />
                        <Typography variant="body2" color="text.secondary">
                          {room.size_sqm}m²
                        </Typography>
                      </Box>
                    )}

                    {room.view_type && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Visibility sx={{ fontSize: 18, color: "action.active" }} />
                        <Typography variant="body2" color="text.secondary">
                          View: {room.view_type}
                        </Typography>
                      </Box>
                    )}

                    {room.pet_allowed && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Pets sx={{ fontSize: 18, color: "success.main" }} />
                        <Typography variant="body2" color="success.main">
                          Cho phép thú cưng
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {room.facilities && room.facilities.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 600, display: "block", mb: 0.5 }}
                      >
                        Tiện nghi:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                        }}
                      >
                        {room.facilities.map((facility) => (
                          <Chip
                            key={facility.id}
                            label={facility.name}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.7rem" }}
                            icon={
                              facility.icon_url ? (
                                <img
                                  src={facility.icon_url}
                                  alt=""
                                  style={{ width: 16, height: 16 }}
                                />
                              ) : undefined
                            }
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Stack>
              </CardContent>

              {user?.role === "TRAVELER" && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    p: 2,
                    pt: 0,
                    gap: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddShoppingCart />}
                    disabled={!isAvailable}
                  >
                    Thêm vào giỏ
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={!isAvailable}
                    onClick={() => navigate(`/rooms/${room.id}`)}
                  >
                    {isAvailable ? "Đặt phòng" : "Hết phòng"}
                  </Button>
                </Box>
              )}
            </Box>
          </Card>
        );
      })}

      {/* dialog hiển thị ảnh */}
      <Dialog
        open={Boolean(openImageObj)}
        onClose={handleCloseImage}
        maxWidth="lg"
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
            overflow: "hidden",
            position: "relative",
          },
        }}
      >
        <IconButton
          onClick={handleCloseImage}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "white",
            bgcolor: "rgba(0,0,0,0.5)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>

        {openImageObj && (
          <img
            src={openImageObj}
            alt="Room Detail"
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default RoomsList;
