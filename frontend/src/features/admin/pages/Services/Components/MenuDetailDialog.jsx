import { Close, ImageNotSupported } from "@mui/icons-material";
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
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
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

const MenuDetailDialog = ({ open, onClose, data }) => {
  if (!data) return null;

  return (
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
        <Box>
          <Typography variant="h6" component="div" fontWeight={700}>
            {data.name}
          </Typography>
          <Typography variant="caption" component="div" color="text.secondary">
            {data.items?.length || 0} món ăn
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2 }}>
        {data.cover_url && (
          <Box
            component="img"
            src={data.cover_url}
            alt="cover"
            sx={{
              width: "100%",
              height: 150,
              objectFit: "cover",
              borderRadius: 2,
              mb: 2,
            }}
          />
        )}
        <Typography variant="body2" component="div" sx={{ mb: 2, fontStyle: "italic" }}>
          {data.description}
        </Typography>

        <List>
          {data.items?.map((item, index) => {
            const isAvailable = item.status === "AVAILABLE";
            return (
              <Box key={item.id}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar
                      variant="square"
                      src={item.image_thumbnail}
                      sx={{ width: 70, height: 70, borderRadius: 1, mr: 2 }}
                    >
                      <ImageNotSupported />
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="start">
                        <Typography variant="subtitle1" component="span" fontWeight={600}>
                          {item.name}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="span"
                          fontWeight={700}
                          color="primary"
                          sx={{ whiteSpace: "nowrap", ml: 1 }}
                        >
                          {formatPrice(item.price)}
                          <Typography component="span" variant="caption" color="text.secondary">
                            /{unitTranslation[item.unit] || item.unit}
                          </Typography>
                        </Typography>
                      </Box>
                    }
                    secondaryTypographyProps={{ component: "div" }}
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="div"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            my: 0.5,
                          }}
                        >
                          {item.description}
                        </Typography>

                        <Chip
                          label={isAvailable ? "Còn món" : "Hết món"}
                          size="small"
                          color={isAvailable ? "success" : "default"}
                          variant="outlined"
                          sx={{ height: 20, fontSize: "10px" }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
                {index < data.items.length - 1 && <Divider component="li" />}
              </Box>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: "grey.200" }}>
        <Button onClick={onClose} variant="contained" sx={{ fontSize: "13px" }}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MenuDetailDialog;
