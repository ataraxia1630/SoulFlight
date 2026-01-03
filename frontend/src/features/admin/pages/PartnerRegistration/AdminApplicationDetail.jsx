import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingState from "@/shared/components/LoadingState";
import PartnerRegistrationAPI from "@/shared/services/partnerRegistration.service";
import { formatDateTime } from "@/shared/utils/formatDate";
import toast from "@/shared/utils/toast";
import ServiceRenderer from "./ServiceRenderer";

const STATUS_CONFIG = {
  PENDING: {
    label: "Đang chờ duyệt",
    color: "warning",
    icon: "⏳",
    bgcolor: "#FEF3C7",
  },
  INFO_REQUIRED: {
    label: "Cần bổ sung",
    color: "info",
    icon: "📝",
    bgcolor: "#DBEAFE",
  },
  APPROVED: {
    label: "Đã duyệt",
    color: "success",
    icon: "✅",
    bgcolor: "#D1FAE5",
  },
  REJECTED: {
    label: "Đã từ chối",
    color: "error",
    icon: "❌",
    bgcolor: "#FEE2E2",
  },
};

export default function AdminApplicationDetail() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const [reviewDialog, setReviewDialog] = useState({
    open: false,
    action: "",
    feedback: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchApplication = useCallback(async () => {
    if (!applicationId) return;

    setLoading(true);
    try {
      const response = await PartnerRegistrationAPI.getApplicationById(applicationId);
      setApplication(response.data);
    } catch (_error) {
      toast.error("Không thể tải thông tin đơn đăng ký");
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const handleReviewAction = async () => {
    const { action, feedback } = reviewDialog;
    if (!feedback.trim() && action !== "approve") return toast.error("Vui lòng nhập lý do");

    setSubmitting(true);
    try {
      const statusMap = {
        approve: "APPROVED",
        reject: "REJECTED",
        require_info: "INFO_REQUIRED",
      };
      await PartnerRegistrationAPI.reviewApplicant(applicationId, statusMap[action], feedback);
      toast.success("Đã cập nhật trạng thái đơn");
      setReviewDialog({ open: false, action: "", feedback: "" });
      fetchApplication();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState />;
  if (!application)
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Không tìm thấy đơn đăng ký</Alert>
      </Container>
    );

  const services = Array.isArray(application.metadata)
    ? application.metadata
    : [application.metadata];
  const statusInfo = STATUS_CONFIG[application.status] || STATUS_CONFIG.PENDING;
  const canReview = ["PENDING", "INFO_REQUIRED"].includes(application.status);
  const provider = application.provider || {};

  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ bgcolor: "white", border: "1px solid #ddd" }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Chi tiết đơn đăng ký
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {application.id}
            </Typography>
          </Box>
        </Stack>

        {canReview && (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="info"
              startIcon={<InfoIcon />}
              onClick={() =>
                setReviewDialog({
                  open: true,
                  action: "require_info",
                  feedback: "",
                })
              }
            >
              Yêu cầu bổ sung
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => setReviewDialog({ open: true, action: "reject", feedback: "" })}
            >
              Từ chối
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => setReviewDialog({ open: true, action: "approve", feedback: "" })}
            >
              Phê duyệt
            </Button>
          </Stack>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: statusInfo.bgcolor,
                border: `1px solid ${statusInfo.bgcolor}`,
                display: "flex",
                alignItems: "center",
                gap: 2,
                borderRadius: 2,
              }}
            >
              <Typography fontSize="2rem">{statusInfo.icon}</Typography>
              <Box>
                <Typography variant="h6" fontWeight={700} color="text.primary">
                  {statusInfo.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ngày tạo: {formatDateTime(application.created_at)}
                </Typography>
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  bgcolor: "white",
                  borderBottom: 1,
                  borderColor: "divider",
                  px: 2,
                  pt: 2,
                }}
              >
                {services.map((svc, idx) => (
                  <Tab key={svc} label={svc.data.serviceName || `Dịch vụ ${idx + 1}`} />
                ))}
              </Tabs>

              <Box sx={{ p: 3, bgcolor: "white" }}>
                {services.map((service, idx) => (
                  <div key={service} role="tabpanel" hidden={activeTab !== idx}>
                    {activeTab === idx && <ServiceRenderer serviceData={service} />}
                  </div>
                ))}
              </Box>
            </Paper>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            <Card elevation={0} sx={{ border: "1px solid #eee" }}>
              <CardContent>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  color="text.secondary"
                  gutterBottom
                >
                  THÔNG TIN NHÀ CUNG CẤP
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar src={provider.logo_url} variant="rounded" sx={{ width: 56, height: 56 }}>
                    <BusinessIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Provider #{application.provider_id}
                    </Typography>
                    {provider.website_link && (
                      <Link
                        href={provider.website_link}
                        target="_blank"
                        underline="hover"
                        fontSize="small"
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                      >
                        Website <OpenInNewIcon fontSize="inherit" />
                      </Link>
                    )}
                  </Box>
                </Box>
                <Stack spacing={1.5}>
                  <Box display="flex" gap={1}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {provider.address || "Chưa cập nhật địa chỉ"}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontStyle: "italic",
                      bgcolor: "#f9f9f9",
                      p: 1,
                      borderRadius: 1,
                    }}
                  >
                    "{provider.description || "Không có mô tả"}"
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ border: "1px solid #eee" }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={2}>
                  LỊCH SỬ XỬ LÝ
                </Typography>
                <Timeline
                  sx={{
                    p: 0,
                    m: 0,
                    "& .MuiTimelineItem-root:before": { flex: 0, padding: 0 },
                  }}
                >
                  {application.approvalHistories?.map((history, idx) => (
                    <TimelineItem key={history}>
                      <TimelineSeparator>
                        <TimelineDot
                          color={history.by === "ADMIN" ? "primary" : "grey"}
                          variant="outlined"
                        />
                        {idx < application.approvalHistories.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent sx={{ pb: 2, px: 2 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {history.action === "APPROVE"
                            ? "Đã duyệt"
                            : history.action === "REJECT"
                              ? "Từ chối"
                              : history.action === "SEND"
                                ? "Nộp đơn"
                                : "Yêu cầu bổ sung"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {formatDateTime(history.created_at)} • {history.by}
                        </Typography>
                        {history.note && (
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              mt: 0.5,
                              color: "text.primary",
                              bgcolor: "#f5f5f5",
                              p: 0.5,
                              borderRadius: 0.5,
                            }}
                          >
                            {history.note}
                          </Typography>
                        )}
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Dialog
        open={reviewDialog.open}
        onClose={() => setReviewDialog({ ...reviewDialog, open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Xác nhận hành động</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Ghi chú / Lý do"
            fullWidth
            multiline
            rows={4}
            value={reviewDialog.feedback}
            onChange={(e) => setReviewDialog({ ...reviewDialog, feedback: e.target.value })}
            placeholder={
              reviewDialog.action === "approve"
                ? "Ghi chú thêm (không bắt buộc)..."
                : "Nhập lý do..."
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog({ ...reviewDialog, open: false })}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleReviewAction}
            disabled={submitting}
            color={
              reviewDialog.action === "approve"
                ? "success"
                : reviewDialog.action === "reject"
                  ? "error"
                  : "info"
            }
          >
            {submitting ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
