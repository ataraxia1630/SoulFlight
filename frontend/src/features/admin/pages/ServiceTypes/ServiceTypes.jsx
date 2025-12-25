import { Alert, Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeaderWithAdd from "@/shared/components/PageHeaderWithAdd";
import CustomTable from "@/shared/components/Table";
import ServiceTypeService from "@/shared/services/serviceType.service";
import columnConfig from "./Components/columnsConfig";
import ServiceTypeDialog from "./Components/ServiceTypeDialog";

export default function ServiceTypes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadServiceTypes = async () => {
    try {
      setLoading(true);
      const serviceTypes = await ServiceTypeService.getAll();
      setData(serviceTypes);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách tiện ích. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: loadServiceTypes stable, ignore warning
  useEffect(() => {
    loadServiceTypes();
  }, []);

  const handleOpenDialog = (item) => {
    setEditingItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
  };

  const handleSave = async (formData) => {
    if (actionLoading) return;

    setActionLoading(true);
    try {
      await ServiceTypeService.update(editingItem.id, formData);

      await loadServiceTypes();
      handleCloseDialog();
    } catch (err) {
      alert("Cập nhật thất bại!");
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
      <PageHeaderWithAdd title="Loại Dịch Vụ" />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <CustomTable columns={columnConfig} data={data} onEdit={handleOpenDialog} />

      <ServiceTypeDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSave}
        editingItem={editingItem}
        actionLoading={actionLoading}
      />
    </Box>
  );
}
