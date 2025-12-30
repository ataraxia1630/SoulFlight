import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingState from "../../../../shared/components/LoadingState";
import PartnerRegistrationAPI from "../../../../shared/services/partnerRegistration.service";
import { formatDateTime } from "../../../../shared/utils/formatDate";

const STATUS_CONFIG = {
  PENDING: { label: "Pending Review", color: "warning", icon: "⏳" },
  INFO_REQUIRED: { label: "Info Required", color: "info", icon: "📝" },
  APPROVED: { label: "Approved", color: "success", icon: "✅" },
  REJECTED: { label: "Rejected", color: "error", icon: "❌" },
};

const ACTION_LABELS = {
  SEND: "Submitted",
  UPDATE: "Updated",
  APPROVE: "Approved",
  REJECT: "Rejected",
  REQUIRE_INFO: "Requested Info",
};

export default function ProviderApplicationDetail() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      try {
        const response = await PartnerRegistrationAPI.getApplicants();
        const app = response.data.find((a) => a.id === applicationId);
        console.log("Fetched application:", app);

        if (!app) {
          const reviewed = await PartnerRegistrationAPI.getReviewedApplicants();
          const reviewedApp = reviewed.data.find((a) => a.id === applicationId);
          setApplication(reviewedApp);
        } else {
          setApplication(app);
        }
      } catch (error) {
        console.error("Failed to fetch application:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  if (loading) {
    return <LoadingState />;
  }

  const services = Array.isArray(application.metadata)
    ? application.metadata
    : [application.metadata];
  const statusConfig = STATUS_CONFIG[application.status];
  const canEdit = application.status === "INFO_REQUIRED";

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton
          onClick={() => navigate("/business/partner-registration/applications")}
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight={600}>
          Application Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Application Overview */}
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" fontWeight={600} mb={1}>
                      Application #{application.id.slice(0, 8)}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Chip
                        label={statusConfig.label}
                        color={statusConfig.color}
                        icon={<span>{statusConfig.icon}</span>}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Submitted: {formatDateTime(new Date(application.created_at))}
                      </Typography>
                    </Stack>
                  </Box>

                  {canEdit && (
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/business/applications/${id}/edit`)}
                    >
                      Edit Application
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Services */}
            {services.map((service, index) => (
              <Card key={service.id}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Service {index + 1}: {service.data.serviceName}
                  </Typography>

                  <Chip
                    label={service.data.model.toUpperCase()}
                    color="primary"
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {service.data.description || "Không có mô tả"}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" fontWeight={600} mb={1}>
                    Location
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {service.data.formattedAddress}
                  </Typography>

                  {service.data.rooms && service.data.rooms.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        Rooms ({service.data.rooms.length})
                      </Typography>
                      <Grid container spacing={1}>
                        {service.data.rooms.map((room) => (
                          <Grid key={room} size={{ xs: 12, sm: 6 }}>
                            <Paper variant="outlined" sx={{ p: 1.5 }}>
                              <Typography variant="body2" fontWeight={600}>
                                {room.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ${room.price}/{room.currency} per night
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}

                  {service.data.tours && service.data.tours.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        Tours ({service.data.tours.length})
                      </Typography>
                      <Grid container spacing={1}>
                        {service.data.tours.map((tour) => (
                          <Grid key={tour} size={{ xs: 12, sm: 6 }}>
                            <Paper variant="outlined" sx={{ p: 1.5 }}>
                              <Typography variant="body2" fontWeight={600}>
                                {tour.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ${tour.price}/person
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}

                  {service.data.menus && service.data.menus.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        Menus ({service.data.menus.length})
                      </Typography>
                      <Grid container spacing={1}>
                        {service.data.menus.map((menu) => (
                          <Grid key={menu} size={{ xs: 12, sm: 6 }}>
                            <Paper variant="outlined" sx={{ p: 1.5 }}>
                              <Typography variant="body2" fontWeight={600}>
                                {menu.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {menu.items?.length || 0} items
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}

                  {service.data.tickets && service.data.tickets.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        Tickets ({service.data.tickets.length})
                      </Typography>
                      <Grid container spacing={1}>
                        {service.data.tickets.map((ticket) => (
                          <Grid key={ticket} size={{ xs: 12, sm: 6 }}>
                            <Paper variant="outlined" sx={{ p: 1.5 }}>
                              <Typography variant="body2" fontWeight={600}>
                                {ticket.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ${ticket.price}
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography variant="h6" fontWeight={600} mb={3}>
              Application Timeline
            </Typography>

            <Timeline sx={{ p: 0, m: 0 }}>
              {application.approvalHistories?.map((history, idx) => (
                <TimelineItem key={history}>
                  <TimelineOppositeContent sx={{ m: 0, flex: 0 }} />
                  <TimelineSeparator>
                    <TimelineDot color={history.by === "ADMIN" ? "primary" : "grey"} />
                    {idx < application.approvalHistories.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {ACTION_LABELS[history.action]}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {formatDateTime(new Date(application.created_at))}
                    </Typography>
                    {history.note && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          p: 1,
                          bgcolor: "grey.50",
                          borderRadius: 1,
                        }}
                      >
                        {history.note}
                      </Typography>
                    )}
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
