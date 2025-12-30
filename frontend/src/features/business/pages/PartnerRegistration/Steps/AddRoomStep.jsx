import { Box, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import RoomForm from "./AddRoomStep/RoomForm";
import RoomList from "./AddRoomStep/RoomList";

export default function AddRoomStep() {
  const theme = useTheme();
  const {
    formState: { errors },
  } = useFormContext();
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);
  const roomErrors = errors.rooms;

  const handleSelectRoom = (index) => {
    setSelectedRoomIndex(index);
  };

  const handleConfirm = () => {
    setSelectedRoomIndex(null);
    console.log("Form closed");
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

      {roomErrors && typeof roomErrors === "object" && !Array.isArray(roomErrors) && (
        <Box mb={3}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            <AlertTitle>Validation Error</AlertTitle>
            {roomErrors.message || "Please fix the errors in your rooms"}
          </Alert>
        </Box>
      )}

      <RoomList selectedIndex={selectedRoomIndex} onSelectRoom={handleSelectRoom} />

      {selectedRoomIndex !== null && (
        <Box>
          <RoomForm roomIndex={selectedRoomIndex} onConfirm={handleConfirm} />
        </Box>
      )}
    </Box>
  );
}
