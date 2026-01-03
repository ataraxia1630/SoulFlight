import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import DeleteConfirmDialog from "@/shared/components/DeleteConfirmDialog";
import CustomTable from "@/shared/components/Table";
import ServiceService from "@/shared/services/service.service";
import toast from "@/shared/utils/toast";
import columnConfig from "./Components/columnsConfig";
import ServiceDetailDialog from "./Components/ServiceDetailDialog";

export default function ServiceOverview() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ServiceService.getAll();
      const services = Array.isArray(res) ? res : res.data || [];
      setData(services);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách dịch vụ. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleView = (item) => {
    setSelectedItem(item);
    setIsViewMode(true);
    setOpenDialog(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsViewMode(false);
    setOpenDialog(true);
  };

  const handleUpdate = async (formData) => {
    if (actionLoading || !selectedItem) return;

    setActionLoading(true);
    try {
      await ServiceService.update(selectedItem.id, formData);
      await loadServices();
      toast.success("Cập nhật thành công!");
      setOpenDialog(false);
      setSelectedItem(null);
    } catch (err) {
      toast.error("Cập nhật thất bại!");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await ServiceService.delete(selectedItem.id);
      await loadServices();
      toast.success("Xóa thành công!");
      setOpenDeleteDialog(false);
      setSelectedItem(null);
    } catch (err) {
      toast.error("Xóa thất bại!");
      console.error(err);
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
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight={700} color="primary">
          Quản Lý Dịch Vụ
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <CustomTable
        columns={columnConfig}
        data={data}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={(item) => {
          setSelectedItem(item);
          setOpenDeleteDialog(true);
        }}
      />

      <ServiceDetailDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedItem(null);
        }}
        onSave={handleUpdate}
        editingItem={selectedItem}
        isViewMode={isViewMode}
        actionLoading={actionLoading}
      />

      <DeleteConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDelete}
        itemName={selectedItem?.name}
      />
    </Box>
  );
}
