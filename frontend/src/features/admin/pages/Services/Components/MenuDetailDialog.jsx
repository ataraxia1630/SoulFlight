import {
  Close,
  ImageNotSupported,
  Info,
  LocationOn,
  RateReview,
  RestaurantMenu,
  Star,
  Store,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ProviderCard from "@/shared/components/service-detail/ProviderCard";
import ReviewsList from "@/shared/components/service-detail/tabs/ReviewList";
import formatPrice from "@/shared/utils/FormatPrice";
import { formatDate } from "@/shared/utils/formatDate";

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

const MenuDetailDialog = ({ open, onClose, data, service, provider, reviews }) => {
  const [tabValue, setTabValue] = useState(0);

  if (!data) return null;

  return (
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
            Chi tiết menu
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
          <Tab icon={<RestaurantMenu fontSize="small" />} iconPosition="start" label="Món ăn" />
          <Tab icon={<Info fontSize="small" />} iconPosition="start" label="Dịch vụ" />
          <Tab icon={<Store fontSize="small" />} iconPosition="start" label="Nhà cung cấp" />
          <Tab icon={<RateReview fontSize="small" />} iconPosition="start" label={`Đánh giá`} />
        </Tabs>
      </Box>

      <DialogContent
        sx={{
          p: 0,
          minHeight: 450,
          bgcolor: "grey.50",
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
            {data.cover_url && (
              <Box
                component="img"
                src={data.cover_url}
                alt="cover"
                sx={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 3,
                  mb: 2,
                  border: "1.5px solid #eee",
                }}
              />
            )}

            <Typography
              variant="body2"
              color="text.secondary"
              paragraph
              sx={{ mb: 3, fontStyle: "italic" }}
            >
              {data.description}
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
              <RestaurantMenu color="primary" fontSize="small" /> Danh sách món ăn (
              {data.items?.length || 0})
            </Typography>

            <Paper
              sx={{
                bgcolor: "white",
                borderRadius: 3,
                border: "1.5px solid #ddd",
                overflow: "hidden",
              }}
              elevation={0}
            >
              <List disablePadding>
                {data.items?.map((item, index) => {
                  const isAvailable = item.status === "AVAILABLE";
                  return (
                    <Box key={item.id}>
                      <ListItem
                        sx={{
                          px: 2,
                          py: 2.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 2.5,
                        }}
                      >
                        <Avatar
                          variant="rounded"
                          src={item.image_thumbnail}
                          sx={{
                            width: 90,
                            height: 90,
                            borderRadius: 2,
                            bgcolor: "grey.100",
                            border: "1px solid #f0f0f0",
                            flexShrink: 0,
                          }}
                        >
                          <ImageNotSupported sx={{ color: "grey.400", fontSize: 32 }} />
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            mb={0.5}
                          >
                            <Typography
                              variant="subtitle1"
                              fontWeight={700}
                              sx={{
                                lineHeight: 1.2,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                pr: 1,
                              }}
                            >
                              {item.name}
                            </Typography>

                            <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                              <Typography
                                variant="subtitle1"
                                fontWeight={800}
                                color="primary.main"
                                sx={{ lineHeight: 1 }}
                              >
                                {formatPrice(item.price)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                /{unitTranslation[item.unit] || item.unit}
                              </Typography>
                            </Box>
                          </Box>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            component="div"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              mb: 1.5,
                              lineHeight: 1.5,
                            }}
                          >
                            {item.description || "Không có mô tả cho món ăn này."}
                          </Typography>

                          <Chip
                            label={isAvailable ? "Còn món" : "Hết món"}
                            size="small"
                            color={isAvailable ? "success" : "default"}
                            variant={isAvailable ? "filled" : "outlined"}
                            sx={{
                              height: 22,
                              fontSize: "11px",
                              fontWeight: 600,
                              px: 0.5,
                            }}
                          />
                        </Box>
                      </ListItem>
                      {index < data.items.length - 1 && (
                        <Divider sx={{ mx: 2, borderColor: "#ddd", borderWidth: 1 }} />
                      )}
                    </Box>
                  );
                })}
              </List>
            </Paper>
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

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                my: 3,
                borderRadius: 2,
                border: "1.5px solid #eee",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                textTransform="uppercase"
              >
                Khoảng giá tham khảo
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                {formatPrice(service?.price_min) || 0}
                {" - "}
                {formatPrice(service?.price_max) || 0}
              </Typography>
            </Paper>

            <Box>
              <Typography variant="subtitle2" mb={1} fontWeight={700}>
                Giới thiệu dịch vụ
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
            <ProviderCard provider={provider} />
          </Box>
        )}

        {tabValue === 3 && (
          <Box sx={{ px: 3 }}>
            <ReviewsList reviews={reviews || []} />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MenuDetailDialog;
