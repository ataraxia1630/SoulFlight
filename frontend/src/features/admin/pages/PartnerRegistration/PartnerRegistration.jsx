import InfoCard from "@admin/components/InfoCard";
import { Box, Stack } from "@mui/material";
import CustomTable from "@/shared/components/Table";
import columnConfig from "./Table/columnsConfig";

const mockData = [
  {
    id: "#PR-90123",
    provider: "Công ty cổ phần dịch vụ ABC",
    service: "3 services",
    submitDate: "18/10/2025",
    status: "Pending",
  },
  {
    id: "#PR-90124",
    provider: "Công ty cổ phần dịch vụ XYZ",
    service: "1 services",
    submitDate: "18/10/2025",
    status: "Approved",
  },
  {
    id: "#PR-90125",
    provider: "TNHH Giải pháp GHH",
    service: "1 services",
    submitDate: "18/10/2025",
    status: "Approved",
  },
  {
    id: "#PR-90127",
    provider: "Chuỗi khách sạn QAS",
    service: "3 services",
    submitDate: "18/10/2025",
    status: "Pending",
  },
  {
    id: "#PR-90133",
    provider: "Hình như có gì đó sai sai",
    service: "0 services",
    submitDate: "18/10/2025",
    status: "Rejected",
  },
  {
    id: "#PR-90127b",
    provider: "Công viên sinh thái",
    service: "11 services",
    submitDate: "18/10/2025",
    status: "Pending",
  },
  {
    id: "#PR-90223",
    provider: "Tour du lịch Cả nhà cùng vui",
    service: "5 services",
    submitDate: "18/10/2025",
    status: "Info_Required",
  },
  {
    id: "#PR-90233",
    provider: "Trà sữa Ohayo",
    service: "3 services",
    submitDate: "18/10/2025",
    status: "Approved",
  },
  {
    id: "#PR-90235",
    provider: "Vietnam Airline",
    service: "1 services",
    submitDate: "18/10/2025",
    status: "Info_Required",
  },
  {
    id: "#PR-90323",
    provider: "Cơm tấm 234/98/12",
    service: "1 services",
    submitDate: "18/10/2025",
    status: "Pending",
  },
];

export default function PartnerRegistration() {
  return (
    <Box sx={{ width: "100%", p: { xs: 2, sm: 3 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 4 }}>
        <InfoCard title="Pending Approval" content="4 applicants" highlightColor="#EAB308" />
        <InfoCard title="Approved" content="128 applicants" highlightColor="#1ABFC3" />

        <InfoCard
          title="Requires Additional Info"
          content="12 applicants"
          highlightColor="#4F46E5"
        />

        <InfoCard title="Rejected" content="56 applicants" highlightColor="#EA4335" />
      </Stack>
      <CustomTable columns={columnConfig} data={mockData} />
      <Box></Box>
    </Box>
  );
}
