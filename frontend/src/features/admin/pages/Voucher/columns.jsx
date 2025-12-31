import { Chip, Typography } from "@mui/material";
import StatusChip from "./components/StatusChip";

export const columns = [
  {
    id: "index",
    label: "STT",
    width: "8%",
    header_align: "center",
    cell_align: "center",
    render: (index) => index + 1,
  },
  {
    id: "code",
    label: "MÃ VOUCHER",
    width: "12%",
    header_align: "left",
    cell_align: "left",
    search: true,
    render: (value) => <Typography variant="body2">{value}</Typography>,
  },
  {
    id: "title",
    label: "TIÊU ĐỀ",
    width: "15%",
    header_align: "left",
    cell_align: "left",
    search: true,
    render: (value) => <Typography variant="body2">{value}</Typography>,
  },
  {
    id: "service",
    label: "PHẠM VI",
    width: "12%",
    header_align: "left",
    cell_align: "left",
    render: (value, row) => {
      if (row?.isGlobal) {
        return (
          <Chip
            label="Toàn sàn"
            color="info"
            size="small"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        );
      }
      return value ? (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {value.name}
        </Typography>
      ) : (
        "-"
      );
    },
  },
  {
    id: "discountPercent",
    label: "GIẢM GIÁ",
    width: "10%",
    header_align: "center",
    cell_align: "center",
    render: (value) => `${value}%`,
  },
  {
    id: "status",
    label: "STATUS",
    width: "12%",
    header_align: "center",
    cell_align: "center",
    render: (value) => <StatusChip status={value} />,
  },
  {
    id: "validFrom",
    label: "BẮT ĐẦU",
    width: "12%",
    header_align: "center",
    cell_align: "center",
    render: (value) => (value ? new Date(value).toLocaleDateString("vi-VN") : "-"),
  },
  {
    id: "validTo",
    label: "KẾT THÚC",
    width: "12%",
    header_align: "center",
    cell_align: "center",
    render: (value) => (value ? new Date(value).toLocaleDateString("vi-VN") : "-"),
  },
  {
    id: "remainingUses",
    label: "CÒN LẠI",
    width: "8%",
    header_align: "center",
    cell_align: "center",
    render: (value) => (value !== null ? value : "∞"),
  },
  {
    id: "actions",
    label: "HÀNH ĐỘNG",
    width: "8%",
    header_align: "center",
    cell_align: "center",
  },
];
