import StatusChip from "./StatusChip";

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
    search: true,
  },
  {
    id: "email",
    label: "Email",
    width: "20%",
    header_align: "left",
    search: true,
  },
  {
    id: "location",
    label: "Location",
    width: "20%",
    header_align: "left",
    search: true,
  },
  {
    id: "status",
    label: "STATUS",
    width: "20%",
    header_align: "center",
    cell_align: "center",
    render: (value) => <StatusChip status={value} />,
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
