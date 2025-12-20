import { formatDate } from "@/shared/utils/formatDate";

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
    label: "TÊN",
    width: "15%",
    header_align: "left",
    cell_align: "left",
    search: true,
  },
  {
    id: "description",
    label: "MÔ TẢ",
    width: "25%",
    header_align: "left",
    cell_align: "left",
    search: true,
  },
  {
    id: "updated_at",
    label: "NGÀY CẬP NHẬT",
    width: "20%",
    header_align: "center",
    cell_align: "center",
    render: (_value, row) => formatDate(row.updated_at),
  },
  {
    id: "actions",
    label: "HÀNH ĐỘNG",
    width: "16%",
    header_align: "center",
    cell_align: "center",
  },
];

export default columnConfig;
