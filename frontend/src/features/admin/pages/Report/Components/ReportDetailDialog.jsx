import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArticleIcon from "@mui/icons-material/Article";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { formatDateTime } from "@/shared/utils/formatDate";
import StatusChip from "./StatusChip";

const ReportDetailDialog = ({ open, onClose, report, onUpdateStatus, actionLoading }) => {
  if (!report) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="h6" fontWeight={700}>
            Tố cáo
          </Typography>
          <StatusChip status={report.status} />
        </Box>
        <IconButton aria-label="close" onClick={onClose} size="medium" sx={{ color: "grey.500" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, mt: 1.5 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <PersonIcon fontSize="small" color="primary" />
                <Typography
                  variant="caption"
                  fontWeight={600}
                  fontSize="14px"
                  color="text.secondary"
                >
                  Người tố cáo
                </Typography>
              </Box>
              <Box sx={{ pl: 3.5 }}>
                <Typography variant="subtitle1" fontWeight={550} lineHeight={1.2}>
                  {report.reporter_name || "Ẩn danh"}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <StoreIcon fontSize="small" color="error" />
                <Typography
                  variant="caption"
                  fontWeight={600}
                  fontSize="14px"
                  color="text.secondary"
                >
                  Nhà cung cấp bị tố cáo
                </Typography>
              </Box>
              <Box sx={{ pr: 3.5, textAlign: "right" }}>
                <Typography variant="subtitle1" fontWeight={550} lineHeight={1.2}>
                  {report.provider_name || "Không rõ"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <ArticleIcon fontSize="small" color="action" />
              <Typography variant="caption" fontWeight={600} fontSize="14px" color="text.secondary">
                Nội dung chi tiết
              </Typography>
            </Box>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: "#fff5f5",
                borderColor: "#ffcdd2",
                borderRadius: 2,
                minHeight: "80px",
              }}
            >
              <Typography
                variant="body1"
                sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6, color: "text.primary" }}
              >
                {report.content}
              </Typography>
            </Paper>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Box display="flex" alignItems="center" gap={0.5}>
              <AccessTimeIcon sx={{ fontSize: 17, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                Đã gửi: <b>{formatDateTime(report.created_at)}</b>
              </Typography>
            </Box>

            {report.status !== "PENDING" && report.updated_at && (
              <Box display="flex" alignItems="center" gap={0.5}>
                <CheckCircleIcon sx={{ fontSize: 17, color: "success.main" }} />
                <Typography variant="caption" color="text.primary" fontWeight={500}>
                  Xử lý: <b>{formatDateTime(report.updated_at)}</b>
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, mt: -2 }}>
        {report.status === "PENDING" ? (
          <>
            <Button
              variant="contained"
              color="error"
              onClick={() => onUpdateStatus("REJECTED")}
              disabled={actionLoading}
              sx={{ px: 3 }}
            >
              Từ chối
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onUpdateStatus("RESOLVED")}
              disabled={actionLoading}
              sx={{ px: 3, boxShadow: 2 }}
            >
              {actionLoading ? "Đang xử lý..." : "Xác nhận vi phạm"}
            </Button>
          </>
        ) : (
          <Button onClick={onClose} variant="outlined" color="inherit">
            Đóng
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ReportDetailDialog;
