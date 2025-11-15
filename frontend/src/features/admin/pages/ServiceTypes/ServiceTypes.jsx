import PageHeaderWithAdd from "@admin/components/PageHeaderWithAdd";
import ServiceTypeService from "@admin/services/serviceType.service";
import { Alert, Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import CustomTable from "@/shared/components/Table";
import columnConfig from "./Components/columnsConfig";
import ServiceTypeDialog from "./Components/ServiceTypeDialog";

export default function serviceTypes() {
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
    <Box sx={{ width: "100%", px: { xs: 3, sm: 4 } }}>
      <PageHeaderWithAdd title="Service Type" />

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
