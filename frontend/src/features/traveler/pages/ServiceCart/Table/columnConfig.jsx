import { Box, Typography } from "@mui/material";

const columnConfig = [
  {
    id: "select",
    label: "Chọn",
    width: "60px",
    header_align: "center",
    cell_align: "center",
  },
  {
    id: "product",
    label: "Dịch Vụ",
    width: "40%",
    render: (_, row) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <img
          src={row.img}
          alt={row.name}
          style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover" }}
        />
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.desc}
          </Typography>
          {row.discount && (
            <Typography variant="caption" color="error" sx={{ ml: 1 }}>
              Giảm {row.discount}
            </Typography>
          )}
        </Box>
      </Box>
    ),
  },
  {
    id: "unitPrice",
    label: "Đơn Giá",
    width: "15%",
    render: (_, row) => (
      <Box>
        {row.originalPrice > row.salePrice && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textDecoration: "line-through" }}
          >
            {row.originalPrice.toLocaleString()}đ
          </Typography>
        )}
        <Typography variant="body2" fontWeight={600} color="error">
          {row.salePrice.toLocaleString()}đ
        </Typography>
      </Box>
    ),
  },
  { id: "quantity", label: "Số Lượng", width: "15%" },
  {
    id: "total",
    label: "Thành Tiền",
    width: "15%",
    render: (_, row) => (
      <Typography fontWeight={600} color="primary">
        {(row.salePrice * row.quantity).toLocaleString()}đ
      </Typography>
    ),
  },
  { id: "action", label: "Thao Tác", width: "10%" },
];

export default columnConfig;
