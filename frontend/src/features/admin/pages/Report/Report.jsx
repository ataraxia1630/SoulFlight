import { Alert, Box, CircularProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import PageHeaderWithAdd from "@/shared/components/PageHeaderWithAdd";
import CustomTable from "@/shared/components/Table";
import ReportService from "@/shared/services/report.service";
import toast from "@/shared/utils/toast";
import columnConfig from "./Components/columnsConfig";
import ReportDetailDialog from "./Components/ReportDetailDialog";

export default function Report() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ReportService.getAll();
      setData(res.data);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách tố cáo. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleOpenDialog = (item) => {
    setSelectedReport(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReport(null);
  };

  const handleUpdateStatus = async (status) => {
    if (actionLoading || !selectedReport) return;

    setActionLoading(true);
    try {
      await ReportService.updateStatus(selectedReport.id, status);
      await loadReports();
      handleCloseDialog();
    } catch (err) {
      toast.error("Cập nhật thất bại!");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: { xs: 2, sm: 3 } }}>
      <PageHeaderWithAdd title="Tố Cáo" />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <CustomTable columns={columnConfig} data={data} onEdit={handleOpenDialog} />

      <ReportDetailDialog
        open={openDialog}
        onClose={handleCloseDialog}
        report={selectedReport}
        onUpdateStatus={handleUpdateStatus}
        actionLoading={actionLoading}
      />
    </Box>
  );
}
