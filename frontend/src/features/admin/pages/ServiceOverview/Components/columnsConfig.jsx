import { Avatar, Box, Chip, Typography } from "@mui/material";
import formatPrice from "@/shared/utils/FormatPrice";

const columnConfig = [
  {
    id: "index",
    label: "STT",
    width: "8%",
    header_align: "center",
    cell_align: "center",
    render: (index) => index + 1,
  },
  {
    id: "name",
    label: "TÊN DỊCH VỤ",
    width: "25%",
    header_align: "left",
    cell_align: "left",
    search: true,
    render: (_value, row) => (
      <Box>
        <Typography variant="body2" fontWeight={600}>
          {row.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {row.location}
        </Typography>
      </Box>
    ),
  },
  {
    id: "provider.name",
    label: "NHÀ CUNG CẤP",
    width: "20%",
    header_align: "left",
    cell_align: "left",
    search: true,
    render: (_value, row) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar
          src={row.provider?.logo_url}
          alt={row.provider?.name}
          sx={{ width: 24, height: 24 }}
        />
        <Typography variant="body2">{row.provider?.name || "N/A"}</Typography>
      </Box>
    ),
  },
  {
    id: "type.name",
    label: "LOẠI",
    width: "10%",
    header_align: "center",
    cell_align: "center",
    search: true,
    render: (_value, row) => (
      <Chip
        label={row.type?.name || "KHÁC"}
        size="small"
        color="info"
        variant="outlined"
        sx={{ fontWeight: 600, fontSize: "11px" }}
      />
    ),
  },
  {
    id: "price",
    label: "KHOẢNG GIÁ",
    width: "18%",
    header_align: "center",
    cell_align: "center",
    render: (_value, row) => (
      <Typography variant="body2" sx={{ fontWeight: 600, color: "success.main" }}>
        {formatPrice(row.price_min)} - {formatPrice(row.price_max)}
      </Typography>
    ),
  },
  {
    id: "rating",
    label: "ĐÁNH GIÁ",
    width: "10%",
    header_align: "center",
    cell_align: "center",
  },
  {
    id: "actions",
    label: "HÀNH ĐỘNG",
    width: "10%",
    header_align: "center",
    cell_align: "center",
  },
];

export default columnConfig;
