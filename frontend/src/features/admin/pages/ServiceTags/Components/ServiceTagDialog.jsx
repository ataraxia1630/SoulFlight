import FormatDialogActions from "@admin/components/FormatDialogActions";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import FormInput from "@/shared/components/FormInput";
import ServiceTypeService from "@/shared/services/serviceType.service";

export default function ServiceTagDialog({ open, onClose, onSave, editingItem, actionLoading }) {
  const [serviceTypeOptions, setServiceTypeOptions] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    serviceType: "",
    categoryName: "",
  });

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const data = await ServiceTypeService.getAll();

        if (Array.isArray(data)) {
          const options = data.map((item) => ({
            value: item.name,
            label: item.name,
          }));
          setServiceTypeOptions(options);
        }
      } catch (error) {
        console.error("Failed to fetch service types", error);
      }
    };

    if (open) {
      fetchServiceTypes();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      if (editingItem) {
        const splitCategory = editingItem.category ? editingItem.category.split("/") : ["", ""];

        setFormData({
          name: editingItem?.name || "",
          serviceType: splitCategory[0] || "",
          categoryName: splitCategory[1] || splitCategory[0] || "",
        });
      } else {
        setFormData({ name: "", serviceType: "", categoryName: "" });
      }
    }
  }, [open, editingItem]);

  const hasValidData = () => {
    const hasName = formData.name.trim().length > 0;
    const hasServiceType = formData.serviceType.trim().length > 0;
    const hasCategoryName = formData.categoryName.trim().length > 0;

    return hasName && hasServiceType && hasCategoryName;
  };

  const handleSave = () => {
    if (!hasValidData()) return;

    const finalCategory = `${formData.serviceType}/${formData.categoryName.trim()}`;

    const dataToSend = {
      name: formData.name.trim(),
      category: finalCategory,
    };

    onSave(dataToSend);
  };

  const handleClose = () => {
    setFormData({ name: "", serviceType: "", categoryName: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, color: "primary.main" }}>
        {editingItem ? "Cập nhật tag" : "Thêm tag"}
      </DialogTitle>
      <DialogContent>
        <FormInput
          fullWidth
          label="Tên tag"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          margin="normal"
          required
        />

        <FormInput
          type="select"
          fullWidth
          label="Loại dịch vụ"
          placeholder="Chọn loại dịch vụ"
          value={formData.serviceType}
          onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
          options={serviceTypeOptions}
          margin="normal"
          required
        />

        <FormInput
          fullWidth
          label="Danh mục"
          placeholder="ví dụ: nature, luxury..."
          value={formData.categoryName}
          onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
          margin="normal"
          required
          helperText={`Danh mục đầy đủ: ${
            formData.serviceType ? `${formData.serviceType}/` + "/" : ""
          }${formData.categoryName}`}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <FormatDialogActions
          onCancel={handleClose}
          onSave={handleSave}
          isLoading={actionLoading}
          isValid={hasValidData()}
          saveText={editingItem ? "Cập nhật" : "Thêm"}
          editing={!!editingItem}
        />
      </DialogActions>
    </Dialog>
  );
}
