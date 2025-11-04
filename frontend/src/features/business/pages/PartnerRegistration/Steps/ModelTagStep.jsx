import TagService from "@business/services/tag.service";
import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function ModelTagStep() {
  const theme = useTheme();
  const { setValue, watch } = useFormContext();
  const selected = watch("modelTag") || "";
  const type = watch("model");
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!type) {
      setModels([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    TagService.getByType({ type: type, mode: "model" })
      .then((data) => setModels(data.models || []))
      .catch(() => alert("Load model tags failed"))
      .finally(() => setLoading(false));
  }, [type]);

  const handleSelect = (modelId) => {
    setValue("modelTag", modelId, { shouldValidate: true });
  };

  if (!type) {
    return (
      <Box textAlign="center" py={5}>
        <Typography color="text.secondary">Vui lòng chọn loại dịch vụ trước.</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box textAlign="center" py={5}>
        <Typography>Đang tải trang...</Typography>
      </Box>
    );
  }

  if (models.length === 0) {
    return (
      <Box textAlign="center" py={5}>
        <Typography color="text.secondary">Không có mô hình nào cho loại dịch vụ này.</Typography>
      </Box>
    );
  }

  return (
    <Box
      width="100%"
      bgcolor="white"
      borderRadius={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "30px 100px 60px 100px",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: theme.palette.text.dark,
          fontWeight: 600,
          textAlign: "center",
          mb: 4,
        }}
      >
        Your service model is more likely to be?
      </Typography>

      <Box flexGrow={1} bgcolor="white" px={{ xs: 2, sm: 4, md: 6 }} py={3} alignItems="center">
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={5}>
          {models.map((tag) => {
            const isSelected = selected === tag.id;

            return (
              <Box
                key={tag.id}
                onClick={() => handleSelect(tag.id)}
                sx={{
                  height: 80,
                  borderRadius: 3,
                  border: `2px solid ${isSelected ? theme.palette.primary.main : "#e0e0e0"}`,
                  backgroundColor: isSelected ? `${theme.palette.primary.main}10` : "white",
                  color: isSelected ? theme.palette.primary.main : "text.primary",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 1.5,
                  px: 2,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                  fontWeight: isSelected ? 600 : 500,

                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: `${theme.palette.primary.main}08`,
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                  },

                  "& .icon": {
                    fontSize: 28,
                    color: isSelected ? theme.palette.primary.main : "inherit",
                  },
                }}
              >
                <Box className="icon" sx={{ display: "flex", alignItems: "center" }}>
                  {tag.icon}
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    fontWeight: "inherit",
                  }}
                >
                  {tag.display || tag.name}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
