import StatusChip from "./StatusChip";

const columnConfig = [
  {
    id: "id",
    label: "APPLICANT ID",
    width: "15%",
    header_align: "left",
    cell_align: "left",
    bold: true,
  },
  {
    id: "provider",
    label: "PROVIDER",
    width: "30%",
    header_align: "left",
    cell_align: "left",
  },
  {
    id: "service",
    label: "SERVICE",
    width: "15%",
    header_align: "center",
    cell_align: "center",
  },
  {
    id: "submitDate",
    label: "SUBMIT DATE",
    width: "20%",
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
