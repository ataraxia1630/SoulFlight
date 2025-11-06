// src/pages/Steps/AddRoomStep/RoomList.jsx

import AddIcon from "@mui/icons-material/Add";
import { Box, Stack, Typography } from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";

const defaultRoom = {
  name: "",
  description: "",
  price: "",
  currency: "VND",
  bedCount: 1,
  guestAdult: 1,
  guestChild: 0,
  petAllowed: false,
  images: [],
};

export default function RoomList({ onSelectRoom, selectedIndex }) {
  const { control, watch } = useFormContext();
  const { fields, append } = useFieldArray({ control, name: "rooms" });

  const handleAddRoom = () => {
    append(defaultRoom);
    onSelectRoom(fields.length); // chọn phòng mới
  };

  return (
    <Box display="flex" gap={3} flexWrap="wrap" justifyContent="center" mb={4}>
      {fields.map((field, index) => {
        const room = watch(`rooms.${index}`);
        const previewImg = room.images?.[0] || "/placeholder-room.jpg"; // fallback

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
            onClick={() => onSelectRoom(index)}
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
                alt={room.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
            <Typography
              variant="subtitle2"
              noWrap
              sx={{ width: 120, textAlign: "center", fontWeight: 500 }}
            >
              {room.name || `Phòng ${index + 1}`}
            </Typography>
          </Stack>
        );
      })}

      {/* Nút Add */}
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
        onClick={handleAddRoom}
      >
        <AddIcon sx={{ fontSize: 40, color: "grey.500" }} />
        <Typography variant="subtitle2" color="text.secondary">
          Thêm phòng
        </Typography>
      </Stack>
    </Box>
  );
}
