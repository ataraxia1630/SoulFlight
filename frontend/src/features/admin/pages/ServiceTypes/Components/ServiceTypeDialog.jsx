import FormatDialogActions from "@admin/components/FormatDialogActions";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import FormInput from "@/shared/components/FormInput";

export default function ServiceTypeDialog({ open, onClose, onSave, editingItem, actionLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const hasValidData = () => {
    const hasName = formData.name.trim().length > 0;
    return hasName;
  };

  const handleSave = () => {
    if (!hasValidData()) return;

    const dataToSend = {
      name: formData.name.trim(),
      description: formData.description.trim(),
    };

    onSave(dataToSend);
  };

  const handleClose = () => {
    setFormData({ name: "", description: "" });
    onClose();
  };

  useEffect(() => {
    if (open) {
      setFormData({
        name: editingItem?.name || "",
        description: editingItem?.description || "",
      });
    }
  }, [open, editingItem]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, color: "primary.main" }}>Edit Service Type</DialogTitle>
      <DialogContent>
        <FormInput
          fullWidth
          label="Tên"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          margin="normal"
          required
        />
        <FormInput
          fullWidth
          label="Mô tả"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          margin="normal"
          required
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <FormatDialogActions
          onCancel={handleClose}
          onSave={handleSave}
          isLoading={actionLoading}
          isValid={hasValidData()}
          editing={true}
          saveText="Cập nhật"
        />
      </DialogActions>
    </Dialog>
  );
}
