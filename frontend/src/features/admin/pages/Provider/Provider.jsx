import { Alert, Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeaderWithAdd from "@/shared/components/PageHeaderWithAdd";
import CustomTable from "@/shared/components/Table";
import ProviderService from "@/shared/services/provider.service";
import columnConfig from "./Components/columnsConfig";
import ProviderDialog from "./Components/ProviderDialog";

export default function Provider() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadProvider = async () => {
    try {
      setLoading(true);
      const provider = await ProviderService.getAll();
      setData(provider);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách người dùng. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: loadServiceTags stable, ignore warning
  useEffect(() => {
    loadProvider();
  }, []);

  const handleView = (row) => {
    navigate(`/users/${row.id}`);
  };

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
      await ProviderService.adminUpdateProvider(editingItem.id, formData);
      await loadProvider();
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
      <PageHeaderWithAdd title="Provider" />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <CustomTable
        columns={columnConfig}
        data={data}
        onEdit={handleOpenDialog}
        onView={handleView}
      />

      <ProviderDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSave}
        editingItem={editingItem}
        actionLoading={actionLoading}
      />
    </Box>
  );
}
