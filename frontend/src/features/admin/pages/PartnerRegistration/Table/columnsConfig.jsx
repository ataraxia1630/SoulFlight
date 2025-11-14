import StatusChip from "./StatusChip";

const columnConfig = [
  {
    // có cái này để đánh STT
    id: "index",
    label: "NO.",
    width: "8%",
    header_align: "center",
    cell_align: "center",
    render: (index) => index + 1,
  },
  {
    id: "id",
    label: "APPLICANT ID",
    width: "15%",
    header_align: "left",
    cell_align: "left",
    bold: true,
    search: true,
  },
  {
    id: "provider",
    label: "PROVIDER",
    width: "30%",
    header_align: "left",
    cell_align: "left",
    search: true,
  },
  {
    id: "service",
    label: "SERVICE",
    width: "12%",
    header_align: "center",
    cell_align: "center",
  },
  {
    id: "submitDate",
    label: "SUBMIT DATE",
    width: "15%",
    header_align: "center",
    cell_align: "center",
  },
  {
    id: "status",
    label: "STATUS",
    width: "20%",
    header_align: "center",
    cell_align: "center",
    render: (value) => <StatusChip status={value} />,
  },
];

export default columnConfig;
