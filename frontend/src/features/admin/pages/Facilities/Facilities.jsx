import PageHeaderWithAdd from "@admin/components/PageHeaderWithAdd";
import FacilityService from "@admin/services/facility.service";
import { Alert, Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import DeleteConfirmDialog from "@/shared/components/DeleteConfirmDialog";
import CustomTable from "@/shared/components/Table";
import columnConfig from "./Components/columnsConfig";
import FacilityDialog from "./Components/FacilityDialog";

export default function Facility() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadFacilities = async () => {
    try {
      setLoading(true);
      const facilities = await FacilityService.getAll();
      setData(facilities);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách tiện ích. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: loadFacilities stable, ignore warning
  useEffect(() => {
    loadFacilities();
  }, []);

  const handleOpenDialog = (item = null) => {
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
      if (editingItem) {
        await FacilityService.update(editingItem.id, formData);
      } else {
        await FacilityService.create(formData);
      }

      await loadFacilities();
      handleCloseDialog();
    } catch (err) {
      alert(editingItem ? "Cập nhật thất bại!" : "Thêm mới thất bại!");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await FacilityService.delete(deletingItem.id);
      await loadFacilities();
      setOpenDeleteDialog(false);
      setDeletingItem(null);
    } catch (err) {
      alert("Xóa thất bại!");
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
    <Box sx={{ width: "100%", px: { xs: 3, sm: 4 } }}>
      <PageHeaderWithAdd title="Facility" onAdd={() => handleOpenDialog()} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <CustomTable
        columns={columnConfig}
        data={data}
        onEdit={handleOpenDialog}
        onDelete={(item) => {
          setDeletingItem(item);
          setOpenDeleteDialog(true);
        }}
      />

      <FacilityDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSave}
        editingItem={editingItem}
        actionLoading={actionLoading}
      />

      <DeleteConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDelete}
        itemName={deletingItem?.name}
      />
    </Box>
  );
}
