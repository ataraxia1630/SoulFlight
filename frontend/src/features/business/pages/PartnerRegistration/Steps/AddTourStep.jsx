import { Box, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import TourForm from "./AddTourStep/TourForm";
import TourList from "./AddTourStep/TourList";

export default function AddTourStep() {
  const theme = useTheme();
  const { watch } = useFormContext();
  const [selectedTourIndex, setSelectedTourIndex] = useState(null);
  const tours = watch("tours") || [];

  const handleSelectTour = (index) => {
    setSelectedTourIndex(index);
  };

  const handleConfirm = () => {
    setSelectedTourIndex(null);
  };

  return (
    <Box
      width="100%"
      bgcolor="white"
      borderRadius={3}
      sx={{
        display: "flex",
        flexDirection: "column",
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
        Add Your Tour Packages
      </Typography>

      <TourList onSelectTour={handleSelectTour} selectedIndex={selectedTourIndex} />

      {selectedTourIndex !== null && (
        <Box mt={4}>
          <TourForm tourIndex={selectedTourIndex} onConfirm={handleConfirm} />
        </Box>
      )}

      {tours.length === 0 && selectedTourIndex === null && (
        <Box textAlign="center" py={5}>
          <Typography color="text.secondary">
            Click "Add Tour" to create your first tour package
          </Typography>
        </Box>
      )}
    </Box>
  );
}
