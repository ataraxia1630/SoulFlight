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
    id: "name",
    label: "NHÀ CUNG CẤP",
    width: "20%",
    header_align: "left",
    cell_align: "left",
    search: true,
  },
  {
    id: "email",
    label: "EMAIL",
    width: "20%",
    header_align: "left",
    cell_align: "left",
    search: true,
  },
  {
    id: "address",
    label: "ĐỊA CHỈ",
    width: "25%",
    header_align: "left",
    cell_align: "left",
    search: true,
  },
  {
    id: "status",
    label: "TRẠNG THÁI",
    width: "20%",
    header_align: "center",
    cell_align: "center",
    render: (value) => <StatusChip status={value} />,
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
