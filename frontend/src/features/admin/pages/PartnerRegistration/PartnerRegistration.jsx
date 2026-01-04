import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InfoCard from "@/shared/components/InfoCard";
import CustomTable from "@/shared/components/Table";
import PartnerRegistrationAPI from "../../../../shared/services/partnerRegistration.service";

const STATUS_COLORS = {
  PENDING: "#EAB308",
  INFO_REQUIRED: "#4F46E5",
  APPROVED: "#1ABFC3",
  REJECTED: "#EA4335",
};

const STATUS_LABELS = {
  PENDING: "Pending",
  INFO_REQUIRED: "Info Required",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const getStatusChip = (status) => {
  const color = STATUS_COLORS[status] || "#6B7280";
  const label = STATUS_LABELS[status] || status;

  return (
    <Box
      sx={{
        display: "inline-block",
        px: 2,
        py: 0.5,
        borderRadius: 1,
        bgcolor: `${color}20`,
        color: color,
        fontWeight: 600,
        fontSize: "0.875rem",
      }}
    >
      {label}
    </Box>
  );
};

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
    id: "id",
    label: "APPLICANT ID",
    width: "15%",
    header_align: "left",
    cell_align: "left",
    bold: true,
    render: (value) => value.slice(0, 8),
  },
  {
    id: "provider_name",
    label: "PROVIDER",
    width: "20%",
    header_align: "left",
    cell_align: "left",
  },
  {
    id: "service_count",
    label: "SERVICES",
    width: "12%",
    header_align: "center",
    cell_align: "center",
    render: (value) => `${value} service${value > 1 ? "s" : ""}`,
  },
  {
    id: "created_at",
    label: "SUBMIT DATE",
    width: "15%",
    header_align: "center",
    cell_align: "center",
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    id: "status",
    label: "STATUS",
    width: "15%",
    header_align: "center",
    cell_align: "center",
    render: (value) => getStatusChip(value),
  },
  {
    id: "actions",
    label: "ACTIONS",
    width: "10%",
    header_align: "center",
    cell_align: "center",
  },
];

export default function PartnerRegistration() {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    info_required: 0,
    rejected: 0,
  });
  const [filters, setFilters] = useState({
    status: "",
  });

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const response = await PartnerRegistrationAPI.getAllApplicants({
          ...filters,
        });

        const transformedData = response.data.map((app) => {
          const services = Array.isArray(app.metadata) ? app.metadata : [app.metadata];
          return {
            ...app,
            service_count: services.length,
            provider_name: app.provider?.user?.name || "—",
            actions: (
              <Button
                startIcon={<VisibilityIcon />}
                size="small"
                onClick={() => navigate(`/admin/applications/${app.id}`)}
              >
                Review
              </Button>
            ),
          };
        });

        setApplicants(transformedData);
      } catch (error) {
        console.error("Failed to fetch applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const [pending, approved, info_required, rejected] = await Promise.all([
          PartnerRegistrationAPI.getAllApplicants({
            status: "PENDING",
          }),
          PartnerRegistrationAPI.getAllApplicants({
            status: "APPROVED",
          }),
          PartnerRegistrationAPI.getAllApplicants({
            status: "INFO_REQUIRED",
          }),
          PartnerRegistrationAPI.getAllApplicants({
            status: "REJECTED",
          }),
        ]);

        setStats({
          pending: pending.data.length,
          approved: approved.data.length,
          info_required: info_required.data.length,
          rejected: rejected.data.length,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchApplicants();
    fetchStats();
  }, [filters, navigate]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={600} mb={4}>
        Partner Applications
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard
            title="Pending Approval"
            content={`${stats.pending} applicants`}
            highlightColor={STATUS_COLORS.PENDING}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard
            title="Approved"
            content={`${stats.approved} applicants`}
            highlightColor={STATUS_COLORS.APPROVED}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard
            title="Info Required"
            content={`${stats.info_required} applicants`}
            highlightColor={STATUS_COLORS.INFO_REQUIRED}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InfoCard
            title="Rejected"
            content={`${stats.rejected} applicants`}
            highlightColor={STATUS_COLORS.REJECTED}
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} mb={3}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="INFO_REQUIRED">Info Required</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <CustomTable columns={columnConfig} data={applicants} loading={loading} />
      </Paper>
    </Container>
  );
}
