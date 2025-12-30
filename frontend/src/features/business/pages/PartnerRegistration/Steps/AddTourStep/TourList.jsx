import AddIcon from "@mui/icons-material/Add";
import TourIcon from "@mui/icons-material/Tour";
import { Box, Stack, Typography } from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";
import { defaultTour } from "../defaultValues";

export default function TourList({ onSelectTour, selectedIndex }) {
  const { control, watch } = useFormContext();
  const { fields, append } = useFieldArray({ control, name: "tours" });

  const handleAddTour = () => {
    append(defaultTour);
    onSelectTour(fields.length);
  };

  return (
    <Box display="flex" gap={3} flexWrap="wrap" justifyContent="center" mb={4}>
      {fields.map((field, index) => {
        const tour = watch(`tours.${index}`);
        const previewImg = tour.images?.[0] || null;
        const hasPlaces = tour.places?.length > 0;

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
              "&:hover": {
                borderColor: "primary.main",
                transform: "translateY(-2px)",
                boxShadow: 2,
              },
            }}
            onClick={() => onSelectTour(index)}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: previewImg ? "transparent" : "grey.100",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {previewImg ? (
                <img
                  src={previewImg}
                  alt={tour.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <TourIcon sx={{ fontSize: 40, color: "grey.400" }} />
              )}
            </Box>

            <Typography
              variant="subtitle2"
              noWrap
              sx={{ width: 120, textAlign: "center", fontWeight: 500 }}
            >
              {tour.name || `Tour ${index + 1}`}
            </Typography>

            {tour.price && (
              <Typography variant="caption" color="primary.main" fontWeight={600}>
                ${tour.price}
              </Typography>
            )}

            {hasPlaces && (
              <Typography variant="caption" color="text.secondary">
                {tour.places.length} stop{tour.places.length > 1 ? "s" : ""}
              </Typography>
            )}
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
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "grey.50",
            transform: "translateY(-2px)",
          },
        }}
        onClick={handleAddTour}
      >
        <AddIcon sx={{ fontSize: 40, color: "grey.500" }} />
        <Typography variant="subtitle2" color="text.secondary">
          Add Tour
        </Typography>
      </Stack>
    </Box>
  );
}
