import FormatDialogActions from "@admin/components/FormatDialogActions";
import { AccessTime, Category, Update } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import FormInput from "@/shared/components/FormInput";
import { formatDateTime } from "@/shared/utils/formatDate";

const formatPriceDisplay = (value) => {
  if (!value && value !== 0) return "";
  const number = Number(value);
  return Number.isNaN(number) ? "" : new Intl.NumberFormat("vi-VN").format(number);
};

const MetaRow = ({ icon, label, value }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      py: 0.5,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
      {icon}
      <Typography variant="body2">{label}</Typography>
    </Box>
    <Typography variant="body2" fontWeight={600} color="text.primary">
      {value ? formatDateTime(value) : "-"}
    </Typography>
  </Box>
);

export default function ProviderServiceDialog({
  open,
  onClose,
  onSave,
  editingItem,
  actionLoading,
  isViewMode,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    price_min: 0,
    price_max: 0,
    type_id: "",
  });

  useEffect(() => {
    if (open && editingItem) {
      setFormData({
        name: editingItem.name || "",
        description: editingItem.description || "",
        location: editingItem.location || "",
        price_min: editingItem.price_min || 0,
        price_max: editingItem.price_max || 0,
        type_id: editingItem.type?.id || "",
      });
    }
  }, [open, editingItem]);

  const handleSave = () => {
    const dataToSend = {
      ...formData,
      price_min: Number(formData.price_min),
      price_max: Number(formData.price_max),
    };
    onSave(dataToSend);
  };

  const handlePriceChange = (field, value) => {
    const rawValue = value.replace(/\./g, "");
    if (rawValue === "" || /^\d+$/.test(rawValue)) {
      setFormData((prev) => ({ ...prev, [field]: rawValue }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 700,
          color: "primary.main",
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "grey.50",
        }}
      >
        {isViewMode ? `Chi tiết dịch vụ` : `Cập nhật dịch vụ`}
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: "#f8f9fa" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            minHeight: "100%",
          }}
        >
          <Box sx={{ flex: 7, p: 3, borderRight: { md: "1px solid #e0e0e0" } }}>
            <Typography
              variant="h6"
              fontWeight={600}
              mb={2}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              Thông tin dịch vụ
            </Typography>

            <Stack spacing={2}>
              <FormInput
                fullWidth
                label="Tên dịch vụ"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isViewMode}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <FormInput
                  fullWidth
                  label="Giá thấp nhất (VNĐ)"
                  type="text"
                  value={formatPriceDisplay(formData.price_min)}
                  onChange={(e) => handlePriceChange("price_min", e.target.value)}
                  disabled={isViewMode}
                />
                <FormInput
                  fullWidth
                  label="Giá cao nhất (VNĐ)"
                  type="text"
                  value={formatPriceDisplay(formData.price_max)}
                  onChange={(e) => handlePriceChange("price_max", e.target.value)}
                  disabled={isViewMode}
                />
              </Box>

              <FormInput
                fullWidth
                label="Địa điểm"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={isViewMode}
              />

              <FormInput
                fullWidth
                label="Mô tả chi tiết"
                multiline
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isViewMode}
              />
            </Stack>
          </Box>

          <Box
            sx={{
              flex: 3,
              p: 3,
              bgcolor: "white",
            }}
          >
            <Box
              sx={{
                position: "sticky",
                top: 24,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  borderColor: "primary.light",
                }}
              >
                <Stack spacing={1}>
                  <MetaRow
                    icon={<AccessTime sx={{ fontSize: 18 }} />}
                    label="Ngày tạo:"
                    value={editingItem?.created_at}
                  />
                  <Divider sx={{ borderStyle: "dashed" }} />
                  <MetaRow
                    icon={<Update sx={{ fontSize: 18 }} />}
                    label="Cập nhật:"
                    value={editingItem?.updated_at}
                  />
                </Stack>
              </Paper>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  fontWeight={700}
                  mb={1}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Category fontSize="small" /> Phân loại
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Chip
                      label={editingItem?.type?.name || "Chưa phân loại"}
                      color="info"
                      size="small"
                      variant="filled"
                      sx={{ fontWeight: "bold" }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: "italic", fontSize: "0.85rem" }}
                  >
                    {editingItem?.type?.description}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}>
        {isViewMode ? (
          <Button variant="outlined" onClick={onClose} color="inherit">
            Đóng
          </Button>
        ) : (
          <FormatDialogActions
            onCancel={onClose}
            onSave={handleSave}
            isLoading={actionLoading}
            isValid={true}
            saveText="Lưu"
            cancelText="Hủy"
            editing={true}
          />
        )}
      </DialogActions>
    </Dialog>
  );
}
