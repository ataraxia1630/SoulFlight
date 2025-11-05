import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import RoomForm from "./AddRoomStep/RoomForm";
import RoomList from "./AddRoomStep/RoomList";

export default function AddRoomStep() {
  const theme = useTheme();
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);
  const { control } = useFormContext();
  const { _fields, remove } = useFieldArray({ control, name: "rooms" });

  const handleBackToList = () => setSelectedRoomIndex(null);
  const _handleRemove = (index) => {
    remove(index);
    if (selectedRoomIndex === index) {
      setSelectedRoomIndex(null);
    }
  };

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
        Add rooms for your stay model
      </Typography>

      {selectedRoomIndex === null ? (
        <RoomList selectedIndex={selectedRoomIndex} onSelectRoom={setSelectedRoomIndex} />
      ) : (
        <Box>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBackToList} sx={{ mb: 3 }}>
            Quay lại danh sách
          </Button>
          <RoomForm roomIndex={selectedRoomIndex} onConfirm={handleBackToList} />
        </Box>
      )}
    </Box>
  );
}
