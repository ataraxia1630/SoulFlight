import InfoCard from "@admin/components/InfoCard";
import { Box, Stack } from "@mui/material";

export default function PartnerRegistration() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
        <InfoCard title="Pending Approval" content="4 applicants" highlightColor="#EAB308" />
        <InfoCard title="Approved" content="128 applicants" highlightColor="#1ABFC3" />

        <InfoCard
          title="Requires Additional Info"
          content="12 applicants"
          highlightColor="#4F46E5"
        />

        <InfoCard title="Rejected" content="56 applicants" highlightColor="#EA4335" />
      </Stack>
      <Box></Box>
    </Box>
  );
}
