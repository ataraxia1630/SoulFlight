import { Box, CircularProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteConfirmDialog from "@/shared/components/DeleteConfirmDialog";
import PageHeaderWithAdd from "@/shared/components/PageHeaderWithAdd";
import CustomTable from "@/shared/components/Table";
import PlaceService from "@/shared/services/place.service";
import toast from "@/shared/utils/toast";
import columnConfig from "./Components/columnConfig";

export default function Place() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const loadPlaces = useCallback(async () => {
    try {
      setLoading(true);
      const res = await PlaceService.getAll();
      setData(res.data);
    } catch {
      toast.error("Lỗi tải danh sách địa điểm");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  const handleAdd = () => {
    navigate("/admin/place/create");
  };

  const handleView = (item) => {
    navigate(`/admin/place/${item.id}`);
  };

  const handleEdit = (item) => {
    navigate(`/admin/place/edit/${item.id}`);
  };

  const handleDeleteClick = (item) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;

    try {
      await PlaceService.delete(deleteItem.id);
      toast.success("Xóa địa điểm thành công");
      loadPlaces();
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setDeleteOpen(false);
      setDeleteItem(null);
    }
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <PageHeaderWithAdd title="Địa điểm" onAdd={handleAdd} />

      {loading ? (
        <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />
      ) : (
        <CustomTable
          columns={columnConfig}
          data={data}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDeleteClick}
        />
      )}

      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName={deleteItem?.name}
      />
    </Box>
  );
}
