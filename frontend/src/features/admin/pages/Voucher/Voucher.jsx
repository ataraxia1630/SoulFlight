import { Alert, Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import useAuthStore from "@/app/store/authStore";
import DeleteConfirmDialog from "@/shared/components/DeleteConfirmDialog";
import LoadingState from "@/shared/components/LoadingState";
import PageHeaderWithAdd from "@/shared/components/PageHeaderWithAdd";
import CustomTable from "@/shared/components/Table";
import { voucherAPI } from "@/shared/services/voucher.service";
import toast from "@/shared/utils/toast";
import { columns } from "./columns";
import DetailDialog from "./components/DetailDialog";

export default function Voucher() {
  const { user } = useAuthStore();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteItem, setDeleteItem] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);

  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await voucherAPI.getVouchers({ businessId: user?.id });
      setVouchers(res.data || []);
    } catch (err) {
      setError(err.message || "Đã có lỗi xảy ra khi tải danh sách voucher.");
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const handleOpenCreate = () => {
    setEditingVoucher(null);
    setOpenDetailDialog(true);
  };

  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);
    setOpenDetailDialog(true);
  };

  const handleSubmitDetail = async (data) => {
    try {
      if (editingVoucher) {
        await voucherAPI.updateVoucher(editingVoucher.id, data);
        toast.success("Cập nhật voucher thành công!");
      } else {
        await voucherAPI.createVoucher(data);
        toast.success("Tạo voucher mới thành công!");
      }
      setOpenDetailDialog(false);
      fetchVouchers();
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra!");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await voucherAPI.deleteVoucher(deleteItem.id);
      toast.success("Xóa voucher thành công!");
      setOpenDeleteDialog(false);
      fetchVouchers();
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra khi xóa!");
    }
  };

  if (loading) return <LoadingState />;

  return (
    <Box sx={{ width: "100%", p: { xs: 2, sm: 3 } }}>
      <PageHeaderWithAdd title="Voucher" onAdd={handleOpenCreate} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <CustomTable
        columns={columns}
        data={vouchers}
        onEdit={handleEdit}
        onDelete={(item) => {
          setDeleteItem(item);
          setOpenDeleteDialog(true);
        }}
      />

      <DeleteConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        itemName={deleteItem?.title || deleteItem?.code}
      />

      {openDetailDialog && (
        <DetailDialog
          open={openDetailDialog}
          onClose={() => setOpenDetailDialog(false)}
          onSubmit={handleSubmitDetail}
          voucher={editingVoucher}
        />
      )}
    </Box>
  );
}
