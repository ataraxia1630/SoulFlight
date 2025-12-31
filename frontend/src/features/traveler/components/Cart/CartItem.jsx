import { Add, CalendarMonth, DeleteOutline, Remove } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography } from "@mui/material";

const CartItem = ({ item, onUpdate, onRemove }) => {
  const renderDateInfo = () => {
    if (item.itemType === "ROOM") {
      return (
        <Typography variant="caption" display="block" color="text.secondary">
          <CalendarMonth sx={{ fontSize: 12, mr: 0.5, verticalAlign: "middle" }} />
          {new Date(item.checkinDate).toLocaleDateString("vi-VN")} -{" "}
          {new Date(item.checkoutDate).toLocaleDateString("vi-VN")}
        </Typography>
      );
    }
    if (
      (item.itemType === "TOUR" || item.itemType === "TICKET" || item.itemType === "MENU_ITEM") &&
      item.visitDate
    ) {
      return (
        <Typography variant="caption" display="block" color="text.secondary">
          <CalendarMonth sx={{ fontSize: 12, mr: 0.5, verticalAlign: "middle" }} />
          Ngày: {new Date(item.visitDate).toLocaleDateString("vi-VN")}
        </Typography>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        mb: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="body1" fontWeight="medium">
          {item.itemName}
        </Typography>
        {renderDateInfo()}
        <Typography variant="caption" color="text.secondary">
          Đơn giá: {item.price.toLocaleString()}đ | Loại: {item.itemType}
        </Typography>
      </Box>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ border: "1px solid #ddd", borderRadius: 1, px: 0.5 }}
        >
          <IconButton size="small" onClick={() => onUpdate(item.id, item.quantity - 1)}>
            <Remove fontSize="small" />
          </IconButton>
          <Typography sx={{ mx: 1, minWidth: 20, textAlign: "center" }}>{item.quantity}</Typography>
          <IconButton size="small" onClick={() => onUpdate(item.id, item.quantity + 1)}>
            <Add fontSize="small" />
          </IconButton>
        </Stack>

        <Typography sx={{ minWidth: 100, textAlign: "right", fontWeight: "bold" }}>
          {item.total.toLocaleString()}đ
        </Typography>

        <IconButton color="error" onClick={() => onRemove(item.id)}>
          <DeleteOutline />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default CartItem;
