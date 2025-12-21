import { Chip, Stack, Typography } from "@mui/material";
import formatPrice from "@/shared/utils/FormatPrice";
import { getDurationText } from "@/shared/utils/formatDate";
import StatusChip from "./StatusChip";

const ProviderCell = ({ providerName, serviceName }) => (
  <Stack spacing={0.5}>
    <Typography variant="body2">{providerName || "-"}</Typography>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
    >
      Service: {serviceName || "-"}
    </Typography>
  </Stack>
);

// tour
export const tourColumns = [
  {
    id: "index",
    label: "STT",
    width: "10%",
    header_align: "center",
    cell_align: "center",
    render: (index) => index + 1,
  },
  {
    id: "name",
    label: "TÊN TOUR",
    width: "15%",
    header_align: "left",
    cell_align: "left",
    search: true,
    render: (value) => <Typography variant="body2">{value}</Typography>,
  },
  {
    id: "provider_name",
    label: "NHÀ CUNG CẤP",
    width: "15%",
    header_align: "left",
    cell_align: "left",
    search: true,
    render: (_, row) => (
      <ProviderCell providerName={row.provider_name} serviceName={row.service_name} />
    ),
  },
  {
    id: "duration",
    label: "THỜI LƯỢNG",
    width: "10%",
    header_align: "center",
    cell_align: "center",
    render: (_, row) => getDurationText(row.duration_hours),
  },
  {
    id: "slots",
    label: "CHỖ",
    width: "10%",
    header_align: "center",
    cell_align: "center",
    render: (_, row) => (
      <Chip
        label={`${row.current_bookings}/${row.max_participants}`}
        size="small"
        variant="outlined"
        color={row.available_slots > 0 ? "success" : "error"}
      />
    ),
  },
  {
    id: "total_price",
    label: "GIÁ VÉ",
    width: "10%",
    header_align: "center",
    cell_align: "center",
    search: true,
    render: (value) => formatPrice(value),
  },
  {
    id: "status",
    label: "TRẠNG THÁI",
    width: "15%",
    header_align: "center",
    cell_align: "center",
    render: (value) => <StatusChip status={value} />,
  },
  {
    id: "actions",
    label: "HÀNH ĐỘNG",
    width: "10%",
    header_align: "center",
    cell_align: "center",
  },
];

// ticket
export const ticketColumns = [
  {
    id: "index",
    label: "STT",
    width: "10%",
    header_align: "center",
    cell_align: "center",
    render: (index) => index + 1,
  },
  {
    id: "name",
    label: "TÊN VÉ",
    width: "20%",
    search: true,
    header_align: "left",
    cell_align: "left",
    render: (value) => <Typography variant="body2">{value}</Typography>,
  },
  {
    id: "provider_name",
    label: "NHÀ CUNG CẤP",
    width: "20%",
    header_align: "left",
    cell_align: "left",
    search: true,
    render: (_, row) => (
      <ProviderCell providerName={row.provider_name} serviceName={row.service_name} />
    ),
  },
  {
    id: "place",
    label: "ĐỊA ĐIỂM",
    width: "15%",
    header_align: "left",
    cell_align: "left",
    search: true,
    render: (_, row) => row.place?.name || "-",
  },
  {
    id: "price",
    label: "GIÁ VÉ",
    width: "10%",
    header_align: "center",
    cell_align: "center",
    search: true,
    render: (value) => formatPrice(value),
  },
  {
    id: "status",
    label: "TRẠNG THÁI",
    width: "15%",
    header_align: "center",
    cell_align: "center",
    render: (value) => <StatusChip status={value} />,
  },
  {
    id: "actions",
    label: "HÀNH ĐỘNG",
    width: "15%",
    header_align: "center",
    cell_align: "center",
  },
];

// menu
export const menuColumns = [
  {
    id: "index",
    label: "STT",
    width: "8%",
    render: (index) => index + 1,
    header_align: "center",
    cell_align: "center",
  },
  {
    id: "name",
    label: "TÊN MENU",
    width: "25%",
    header_align: "left",
    cell_align: "left",
    search: true,
    render: (value) => <Typography variant="body2">{value}</Typography>,
  },
  {
    id: "provider_name",
    label: "NHÀ CUNG CẤP",
    width: "25%",
    header_align: "left",
    cell_align: "left",
    search: true,
    render: (_, row) => (
      <ProviderCell providerName={row.provider_name} serviceName={row.service_name} />
    ),
  },
  {
    id: "cover_thumbnail",
    label: "ẢNH",
    width: "20%",
    header_align: "center",
    cell_align: "center",
    is_picture: true,
  },
  {
    id: "items_count",
    label: "SỐ MÓN",
    width: "10%",
    header_align: "center",
    cell_align: "center",
    render: (_, row) => row.items?.length || 0,
  },
  {
    id: "actions",
    label: "HÀNH ĐỘNG",
    width: "15%",
    header_align: "center",
    cell_align: "center",
  },
];

// --- 4. ROOM (STAY) ---
export const roomColumns = [
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
    label: "PHÒNG",
    width: "20%",
    header_align: "left",
    cell_align: "left",
    search: true,
    render: (value) => <Typography variant="body2">{value}</Typography>,
  },
  {
    id: "provider_name",
    label: "NHÀ CUNG CẤP",
    width: "20%",
    header_align: "left",
    cell_align: "left",
    search: true,
    render: (_, row) => (
      <ProviderCell providerName={row.provider_name} serviceName={row.service_name} />
    ),
  },
  {
    id: "total_rooms",
    label: "SỐ LƯỢNG",
    width: "10%",
    header_align: "center",
    cell_align: "center",
  },
  {
    id: "price_per_night",
    label: "GIÁ / ĐÊM",
    width: "15%",
    header_align: "center",
    cell_align: "center",
    search: true,
    render: (value) => formatPrice(value),
  },
  {
    id: "status",
    label: "TRẠNG THÁI",
    width: "15%",
    header_align: "center",
    cell_align: "center",
    render: (value) => <StatusChip status={value} />,
  },
  {
    id: "actions",
    label: "HÀNH ĐỘNG",
    width: "15%",
    header_align: "center",
    cell_align: "center",
  },
];
