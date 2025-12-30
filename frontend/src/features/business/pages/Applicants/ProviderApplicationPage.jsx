import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingState from "../../../../shared/components/LoadingState";
import PartnerRegistrationAPI from "../../../../shared/services/partnerRegistration.service";
import { formatDateTime } from "../../../../shared/utils/formatDate";

const STATUS_CONFIG = {
  PENDING: { label: "Pending", color: "warning" },
  INFO_REQUIRED: { label: "Info Required", color: "info" },
  APPROVED: { label: "Approved", color: "success" },
  REJECTED: { label: "Rejected", color: "error" },
};

export default function ProviderApplicationsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [pendingApps, setPendingApps] = useState([]);
  const [reviewedApps, setReviewedApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const [pending, reviewed] = await Promise.all([
          PartnerRegistrationAPI.getApplicants(),
          PartnerRegistrationAPI.getReviewedApplicants(),
        ]);
        setPendingApps(pending.data || []);
        setReviewedApps(reviewed.data || []);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getServiceCount = (app) => {
    const services = Array.isArray(app.metadata) ? app.metadata : [app.metadata];
    return services.length;
  };

  const handleView = (appId) => {
    navigate(`/business/partner-registration/applications/${appId}`);
  };

  const handleEdit = (appId) => {
    navigate(`/business/partner-registration/applications/${appId}/edit`);
  };

  const canEdit = (status) => status === "INFO_REQUIRED";

  const renderApplicationCard = (app) => {
    const statusConfig = STATUS_CONFIG[app.status] || {
      label: app.status,
      color: "default",
    };
    const latestHistory = app.approvalHistories?.[0];

    return (
      <Card key={app.id} variant="outlined">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1}>
              <Typography variant="h6" fontWeight={500} mb={1}>
                Application #{app.id.slice(0, 8)}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                <Chip label={statusConfig.label} color={statusConfig.color} size="small" />
                <Chip
                  label={`${getServiceCount(app)} Service${getServiceCount(app) > 1 ? "s" : ""}`}
                  size="small"
                  variant="outlined"
                />
              </Stack>

              <Typography variant="body2" color="text.secondary">
                Submitted: {formatDateTime(new Date(app.created_at))}
              </Typography>

              {latestHistory?.note && (
                <Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
                  <Typography variant="caption" fontWeight={600} display="block" mb={0.5}>
                    Admin Note:
                  </Typography>
                  <Typography variant="body2">{latestHistory.note}</Typography>
                </Box>
              )}
            </Box>

            <Stack direction="row" spacing={1}>
              {canEdit(app.status) && (
                <IconButton
                  color="primary"
                  onClick={() => handleEdit(app.id)}
                  title="Edit application"
                >
                  <EditIcon />
                </IconButton>
              )}
              <IconButton color="primary" onClick={() => handleView(app.id)} title="View details">
                <VisibilityIcon />
              </IconButton>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={600}>
          My Applications
        </Typography>
        <Button variant="contained" onClick={() => navigate("/business/partner-registration")}>
          New Application
        </Button>
      </Box>

      <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)} sx={{ mb: 3 }}>
        <Tab label={`In Review (${pendingApps.length})`} />
        <Tab label={`Reviewed (${reviewedApps.length})`} />
      </Tabs>

      {activeTab === 0 && (
        <Stack spacing={2}>
          {pendingApps.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography color="text.secondary">No pending applications</Typography>
            </Box>
          ) : (
            pendingApps.map(renderApplicationCard)
          )}
        </Stack>
      )}

      {activeTab === 1 && (
        <Stack spacing={2}>
          {reviewedApps.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography color="text.secondary">No reviewed applications</Typography>
            </Box>
          ) : (
            reviewedApps.map(renderApplicationCard)
          )}
        </Stack>
      )}
    </Container>
  );
}
