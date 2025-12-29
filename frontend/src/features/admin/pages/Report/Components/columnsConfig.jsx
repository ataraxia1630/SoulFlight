import { Typography } from "@mui/material";
import { formatDate } from "@/shared/utils/formatDate";
import StatusChip from "./StatusChip";

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
    id: "reporter_name",
    label: "NGƯỜI TỐ CÁO",
    width: "15%",
    search: true,
    header_align: "left",
    cell_align: "left",
    render: (value) => value,
  },
  {
    id: "provider_name",
    label: "NHÀ CUNG CẤP",
    width: "15%",
    search: true,
    header_align: "left",
    cell_align: "left",
    render: (value) => value,
  },
  {
    id: "content",
    label: "NỘI DUNG",
    width: "25%",
    header_align: "left",
    cell_align: "left",
    search: true,
    render: (content) => (
      <Typography
        variant="body2"
        sx={{
          display: "-webkit-box",
          overflow: "hidden",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
        }}
      >
        {content}
      </Typography>
    ),
  },
  {
    id: "created_at",
    label: "NGÀY GỬI",
    width: "15%",
    header_align: "center",
    cell_align: "center",
    render: (value) => formatDate(value),
  },
  {
    id: "status",
    label: "TRẠNG THÁI",
    width: "15%",
    header_align: "center",
    cell_align: "center",
    render: (status) => <StatusChip status={status} />,
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
