import { AddCircleOutline } from "@mui/icons-material";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import useAuthStore from "@/app/store/authStore";
import DeleteConfirmDialog from "@/shared/components/DeleteConfirmDialog";
import CustomTable from "@/shared/components/Table";
import ServiceService from "@/shared/services/service.service";
import toast from "@/shared/utils/toast";
import columnsConfig from "./Components/columnsConfig";
import ProviderServiceDialog from "./Components/ProviderServiceDialog";

export default function ProviderServiceOverview() {
  const { user } = useAuthStore();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [isViewMode, setIsViewMode] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadServices = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await ServiceService.getByProvider(user.id);
      const services = Array.isArray(res) ? res : res.data || res.items || [];
      setData(services);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách dịch vụ của bạn.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

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
      toast.success("Cập nhật dịch vụ thành công!");
      await loadServices();
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
      toast.success("Xóa dịch vụ thành công!");
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
          Dịch Vụ Của Tôi
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && data.length === 0 && !error ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            bgcolor: "grey.50",
            borderRadius: 2,
            border: "1px dashed #ccc",
            mt: 2,
          }}
        >
          <AddCircleOutline sx={{ fontSize: 60, color: "text.secondary", mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary">
            Bạn chưa có dịch vụ nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vui lòng liên hệ quản trị viên hoặc đăng ký dịch vụ mới.
          </Typography>
        </Box>
      ) : (
        <CustomTable
          columns={columnsConfig}
          data={data}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={(item) => {
            setSelectedItem(item);
            setOpenDeleteDialog(true);
          }}
        />
      )}

      <ProviderServiceDialog
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
