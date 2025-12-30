import AddIcon from "@mui/icons-material/Add";
import { Box, Stack, Typography } from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";
import { defaultMenu } from "../defaultValues";

export default function MenuList({ onSelectMenu, selectedIndex }) {
  const { control, watch } = useFormContext();
  const { fields, append } = useFieldArray({ control, name: "menus" });

  const handleAddMenu = () => {
    append(defaultMenu);
    onSelectMenu(fields.length);
  };

  return (
    <Box display="flex" gap={3} flexWrap="wrap" justifyContent="center" mb={4}>
      {fields.map((field, index) => {
        const menu = watch(`menus.${index}`);
        const previewImg = menu.coverImage || "/placeholder-menu.jpg";

        return (
          <Stack
            key={field.id}
            alignItems="center"
            spacing={1}
            sx={{
              cursor: "pointer",
              border: selectedIndex === index ? "2px solid" : "2px dashed",
              borderColor: selectedIndex === index ? "primary.main" : "grey.300",
              borderRadius: 3,
              p: 1,
              width: 140,
              transition: "all 0.2s",
              "&:hover": { borderColor: "primary.main" },
            }}
            onClick={() => onSelectMenu(index)}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "grey.100",
              }}
            >
              <img
                src={previewImg}
                alt={menu.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
            <Typography
              variant="subtitle2"
              noWrap
              sx={{ width: 120, textAlign: "center", fontWeight: 500 }}
            >
              {menu.name || `Menu ${index + 1}`}
            </Typography>
          </Stack>
        );
      })}

      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={1}
        sx={{
          border: "2px dashed",
          borderColor: "grey.400",
          borderRadius: 3,
          width: 140,
          height: 140,
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": { borderColor: "primary.main", bgcolor: "grey.50" },
        }}
        onClick={handleAddMenu}
      >
        <AddIcon sx={{ fontSize: 40, color: "grey.500" }} />
        <Typography variant="subtitle2" color="text.secondary">
          Thêm Menu
        </Typography>
      </Stack>
    </Box>
  );
}
