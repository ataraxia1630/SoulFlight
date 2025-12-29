import {
  LocationOn,
  Message as MessageIcon,
  Phone,
  ReportProblem,
  Language as WebIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAuthStore } from "@/app/store";
import ReportService from "@/shared/services/report.service";
import toast from "@/shared/utils/toast";

const ProviderCard = ({ provider }) => {
  const { user } = useAuthStore();

  const [openReport, setOpenReport] = useState(false);
  const [reportReason, setReportReason] = useState("");

  if (!provider) return null;

  const handleOpenReport = () => {
    setOpenReport(true);
  };

  const handleCloseReport = () => {
    setOpenReport(false);
    setReportReason("");
  };

  const handleSubmitReport = async () => {
    if (!reportReason.trim()) return;

    try {
      await ReportService.create({
        provider_id: provider.id,
        content: reportReason,
      });
      toast.success("Tố cáo đã được gửi. Chúng tôi sẽ xem xét sớm nhất có thể.");
      handleCloseReport();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi gửi tố cáo.");
    }
  };

  return (
    <>
      <Card sx={{ boxShadow: 3, position: "sticky", top: 20, mt: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Nhà cung cấp
            </Typography>

            {user?.role === "TRAVELER" && (
              <Tooltip title="Tố cáo vi phạm">
                <IconButton
                  onClick={handleOpenReport}
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      color: "error.main",
                      bgcolor: "rgba(211, 47, 47, 0.08)",
                    },
                  }}
                >
                  <ReportProblem sx={{ fontSize: 25 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              src={provider.logo_url}
              alt={provider.name}
              sx={{ width: 60, height: 60, border: "1px solid #eee" }}
            />
            <Box>
              <Typography variant="body1" fontWeight={600}>
                {provider.name}
              </Typography>

              {provider.establish_year && (
                <Typography variant="body2" color="text.secondary">
                  Tham gia từ {provider.establish_year}
                </Typography>
              )}
            </Box>
          </Box>

          {provider.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {provider.description}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {provider.address && (
              <Typography variant="body2" sx={{ display: "flex", alignItems: "start" }}>
                <LocationOn sx={{ fontSize: 18, mr: 1, color: "text.secondary", mt: -0.2 }} />
                {provider.address}
              </Typography>
            )}

            {provider.phone && (
              <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
                <Phone sx={{ fontSize: 18, mr: 1, color: "text.secondary" }} />
                <Box component="span" fontWeight={500}>
                  {provider.phone}
                </Box>
              </Typography>
            )}

            {provider.website_link && (
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center", wordBreak: "break-all" }}
              >
                <WebIcon sx={{ fontSize: 18, mr: 1, color: "text.secondary" }} />
                <a
                  href={provider.website_link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {provider.website_link}
                </a>
              </Typography>
            )}
          </Box>

          {user?.role === "TRAVELER" && (
            <Button fullWidth variant="outlined" startIcon={<MessageIcon />} sx={{ mt: 3 }}>
              Liên hệ nhà cung cấp
            </Button>
          )}
        </CardContent>
      </Card>

      {/* tố cáo */}
      <Dialog open={openReport} onClose={handleCloseReport} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            bgcolor: "error.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ReportProblem sx={{ color: "white" }} /> Tố cáo vi phạm
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText sx={{ mb: 2 }}>
            Vui lòng cho chúng tôi biết lý do bạn muốn tố cáo nhà cung cấp <b>{provider.name}</b>.
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            label="Lý do chi tiết"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            color="error"
            placeholder="Ví dụ: Lừa đảo, thông tin sai lệch..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "error.main",
                  borderWidth: "2px",
                },
                "&:hover fieldset": {
                  borderColor: "error.main",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "error.main",
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseReport} color="inherit">
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmitReport}
            variant="contained"
            color="error"
            disabled={!reportReason.trim()}
          >
            Gửi tố cáo
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProviderCard;
