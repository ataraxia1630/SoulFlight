import FormatDialogActions from "@admin/components/FormatDialogActions";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import FormInput from "@/shared/components/FormInput";

export default function ServiceTagDialog({ open, onClose, onSave, editingItem, actionLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
  });

  const hasValidData = () => {
    const hasName = formData.name.trim().length > 0;
    const hasCategory = formData.category.trim().length > 0;

    return hasName && hasCategory;
  };

  const handleSave = () => {
    if (!hasValidData()) return;

    const dataToSend = {
      name: formData.name.trim(),
      category: formData.category.trim(),
    };

    onSave(dataToSend);
  };

  const handleClose = () => {
    setFormData({ name: "", category: "" });
    onClose();
  };

  useEffect(() => {
    if (open) {
      setFormData({
        name: editingItem?.name || "",
        category: editingItem?.category || "",
      });
    }
  }, [open, editingItem]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, color: "primary.main" }}>
        {editingItem ? "Edit Tag" : "Add New Tag"}
      </DialogTitle>
      <DialogContent>
        <FormInput
          fullWidth
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          margin="normal"
          required
        />
        <FormInput
          fullWidth
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
          saveText="Add"
          editing={!!editingItem}
        />
      </DialogActions>
    </Dialog>
  );
}
