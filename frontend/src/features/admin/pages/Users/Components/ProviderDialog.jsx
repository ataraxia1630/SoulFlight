import FormatDialogActions from "@admin/components/FormatDialogActions";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import FormInput from "@/shared/components/FormInput";

const statusOptions = [
  { value: "ACTIVE", label: "Hoạt động" },
  { value: "LOCKED", label: "Đã khóa" },
];

export default function ProviderDialog({ open, onClose, onSave, editingItem, actionLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "UNVERIFIED",
  });

  useEffect(() => {
    if (open && editingItem) {
      setFormData({
        name: editingItem.name || "",
        email: editingItem.email || "",
        status: editingItem.status || "UNVERIFIED",
      });
    }
  }, [open, editingItem]);

  useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        email: "",
        status: "UNVERIFIED",
      });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, color: "primary.main" }}>
        Chỉnh Sửa Nhà Cung Cấp
      </DialogTitle>

      <DialogContent>
        <FormInput
          label="Tên"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <FormInput
          label="Email"
          name="email"
          value={formData.email}
          fullWidth
          margin="normal"
          disabled
        />

        <FormInput
          type="select"
          label="Trạng thái"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
          fullWidth
          margin="normal"
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <FormatDialogActions
          onCancel={onClose}
          onSave={handleSubmit}
          isLoading={actionLoading}
          isValid={true}
          saveText="Cập nhật"
        />
      </DialogActions>
    </Dialog>
  );
}
