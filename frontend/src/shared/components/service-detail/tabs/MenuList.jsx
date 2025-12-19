import { AddShoppingCart } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import formatPrice from "@/shared/utils/FormatPrice";

const unitTranslation = {
  PORTION: "Khẩu phần",
  SERVING: "Suất",
  PIECE: "Cái",
  SLICE: "Lát",
  SET: "Set",
  BOX: "Hộp",
  TRAY: "Khay",
  PACK: "Gói",
  CUP: "Cốc",
  BOTTLE: "Chai",
  CAN: "Lon",
  DISH: "Dĩa",
  BOWL: "Tô",
  GLASS: "Ly",
  JAR: "Hũ",
};

const MenusList = ({ menus }) => {
  if (!menus || menus.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Không có menu nào
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {menus.map((menu) => (
        <Card key={menu.id} sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
              {menu.cover_url && (
                <CardMedia
                  component="img"
                  image={menu.cover_thumbnail}
                  alt={menu.name}
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: 2,
                    objectFit: "cover",
                  }}
                />
              )}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {menu.name}
                </Typography>
                {menu.description && (
                  <Typography variant="body1" color="text.secondary">
                    {menu.description}
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
              Danh sách món ăn ({menu.items?.length || 0})
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {menu.items?.map((item) => {
                const isAvailable = item.status === "AVAILABLE";

                return (
                  <Card
                    key={item.id}
                    variant="outlined"
                    sx={{
                      display: "flex",
                      width: "100%",
                      height: 160,
                      transition: "0.3s",
                      "&:hover": { boxShadow: 4, borderColor: "primary.main" },
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    {item.image_thumbnail && (
                      <CardMedia
                        component="img"
                        sx={{
                          width: 150,
                          minWidth: 150,
                          height: 160,
                          objectFit: "cover",
                        }}
                        image={item.image_thumbnail}
                        alt={item.name}
                      />
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        p: 2,
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 0.75,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            lineHeight={1.2}
                            sx={{ pr: 1 }}
                          >
                            {item.name}
                          </Typography>

                          <Chip
                            label={isAvailable ? "Còn món" : "Hết món"}
                            size="small"
                            color={isAvailable ? "success" : "default"}
                            variant={isAvailable ? "filled" : "outlined"}
                            sx={{
                              fontWeight: 600,
                              fontSize: "12px",
                              height: 24,
                              flexShrink: 0,
                            }}
                          />
                        </Box>

                        {item.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              overflow: "hidden",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 2,
                              mb: 1,
                            }}
                          >
                            {item.description}
                          </Typography>
                        )}
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                          mt: 1,
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          color="primary.main"
                          sx={{ lineHeight: 1, mb: 0.5 }}
                        >
                          {formatPrice(item.price)}
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              ml: 0.5,
                              fontWeight: 400,
                              fontSize: "14px",
                            }}
                          >
                            / {unitTranslation[item.unit] || item.unit}
                          </Typography>
                        </Typography>

                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<AddShoppingCart />}
                            disabled={!isAvailable}
                            onClick={() => console.log("Add to cart", item.id)}
                            sx={{ textTransform: "none", fontWeight: 600 }}
                          >
                            Thêm vào giỏ
                          </Button>

                          <Button
                            variant="contained"
                            size="small"
                            disableElevation
                            disabled={!isAvailable}
                            onClick={() => console.log("Order now", item.id)}
                            sx={{ textTransform: "none", fontWeight: 600 }}
                          >
                            Đặt ngay
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default MenusList;
