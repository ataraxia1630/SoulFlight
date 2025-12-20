import { Alert, Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import DeleteConfirmDialog from "@/shared/components/DeleteConfirmDialog";
import PageHeaderWithAdd from "@/shared/components/PageHeaderWithAdd";
import CustomTable from "@/shared/components/Table";
import ServiceTagService from "@/shared/services/serviceTag.service";
import columnConfig from "./Components/columnsConfig";
import ServiceTagDialog from "./Components/ServiceTagDialog";

export default function ServiceTags() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadServiceTags = async () => {
    try {
      setLoading(true);
      const tags = await ServiceTagService.getAll();
      setData(tags);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách tiện ích. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: loadServiceTags stable, ignore warning
  useEffect(() => {
    loadServiceTags();
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
        await ServiceTagService.update(editingItem.id, formData);
      } else {
        await ServiceTagService.create(formData);
      }

      await loadServiceTags();
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
      await ServiceTagService.delete(deletingItem.id);
      await loadServiceTags();
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
    <Box sx={{ width: "100%", p: { xs: 2, sm: 3 } }}>
      <PageHeaderWithAdd title="Tag Dịch Vụ" onAdd={() => handleOpenDialog()} />

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

      <ServiceTagDialog
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
