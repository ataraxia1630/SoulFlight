import StatusChip from "./StatusChip";

const columnConfig = [
  {
    id: "id",
    label: "Applicant Id",
  },
  {
    id: "provider",
    label: "Provider",
  },
  {
    id: "service",
    label: "Service",
  },
  {
    id: "submit-date",
    label: "Submit Date",
  },
  {
    id: "status",
    label: "Status",
    render: (value) => <StatusChip status={value} />,
  },
];

export default columnConfig;
