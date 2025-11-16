import { formatDate } from "@/shared/utils/formatDate";

const columnConfig = [
  {
    id: "index",
    label: "NO.",
    width: "8%",
    header_align: "center",
    cell_align: "center",
    render: (index) => index + 1,
  },
  {
    id: "name",
    label: "NAME",
    width: "20%",
    header_align: "left",
    cell_align: "left",
    search: true,
  },
  {
    id: "icon_url",
    label: "ICON",
    width: "20%",
    header_align: "center",
    cell_align: "center",
    is_picture: true,
  },
  {
    id: "created_at",
    label: "CREATED DATE",
    width: "20%",
    header_align: "center",
    cell_align: "center",
    render: (_value, row) => formatDate(row.created_at),
  },
  {
    id: "updated_at",
    label: "UPDATED DATE",
    width: "20%",
    header_align: "center",
    cell_align: "center",
    render: (_value, row) => formatDate(row.updated_at),
  },
  {
    id: "actions",
    label: "ACTIONS",
    width: "16%",
    header_align: "center",
    cell_align: "center",
  },
];

export default columnConfig;
