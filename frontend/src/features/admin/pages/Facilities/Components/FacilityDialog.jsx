import FormatDialogActions from "@admin/components/FormatDialogActions";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import FormInput from "@/shared/components/FormInput";

export default function FacilityDialog({ open, onClose, onSave, editingItem, actionLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    icon_url: "",
    file: null,
  });

  const hasValidData = () => {
    const hasName = formData.name.trim().length > 0;
    const hasFile = formData.file !== null;
    const hasUrl = formData.icon_url.trim().length > 0;

    return hasName && (hasFile || hasUrl);
  };

  const handleSave = () => {
    if (!hasValidData()) return;

    const dataToSend = {
      name: formData.name.trim(),
    };

    if (formData.file) {
      dataToSend.file = formData.file;
    } else if (formData.icon_url.trim()) {
      dataToSend.icon_url = formData.icon_url.trim();
    }

    onSave(dataToSend);
  };

  const handleClose = () => {
    setFormData({ name: "", icon_url: "", file: null });
    onClose();
  };

  useEffect(() => {
    if (open) {
      setFormData({
        name: editingItem?.name || "",
        icon_url: editingItem?.icon_url || "",
        file: null,
      });
    }
  }, [open, editingItem]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, color: "primary.main" }}>
        {editingItem ? "Edit Facility" : "Add New Facility"}
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
          type="picture"
          label="Icon"
          value={formData.icon_url}
          file={formData.file}
          onUrlChange={(url) => setFormData((prev) => ({ ...prev, icon_url: url }))}
          onFileChange={(file) =>
            setFormData((prev) => ({
              ...prev,
              file,
              icon_url: file ? "" : prev.icon_url,
            }))
          }
          placeholder="https://example.com/icon.png"
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
