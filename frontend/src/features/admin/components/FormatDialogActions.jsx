import { Button, CircularProgress } from "@mui/material";

export default function FormatDialogActions({
  onCancel,
  onSave,
  isLoading = false,
  isValid = true,
  cancelText = "Hủy",
  saveText = "Lưu",
  editing = false,
}) {
  return (
    <>
      <Button onClick={onCancel} sx={{ textTransform: "none" }} disabled={isLoading}>
        {cancelText}
      </Button>
      <Button
        onClick={onSave}
        variant="contained"
        disabled={!isValid || isLoading}
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        sx={{
          backgroundColor: "primary.main",
          "&:hover": { backgroundColor: "primary.dark" },
          textTransform: "none",
          minWidth: 100,
        }}
      >
        {isLoading ? (editing ? "Đang tải..." : "Đang tải...") : editing ? "Cập nhật" : saveText}
      </Button>
    </>
  );
}
