import AddIcon from "@mui/icons-material/Add";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import PlaceService from "../../../../../../shared/services/place.service";
import fileToBase64 from "../../fileToBase64";

export default function TourForm({ tourIndex, onConfirm }) {
  const {
    trigger,
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `tours.${tourIndex}.places`,
  });

  const tourErrors = errors.tours?.[tourIndex];
  const images = watch(`tours.${tourIndex}.images`) || [];
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoadingPlaces(true);
      try {
        const response = await PlaceService.getAll();
        setAvailablePlaces(response.data || []);
      } catch (error) {
        console.error("Failed to fetch places:", error);
        setAvailablePlaces([
          { id: 1, name: "Vịnh Hạ Long" },
          { id: 2, name: "Phố cổ Hội An" },
          { id: 3, name: "Đền Angkor Wat" },
        ]);
      } finally {
        setLoadingPlaces(false);
      }
    };

    fetchPlaces();
  }, []);

  const handleConfirm = async () => {
    const isTourValid = await trigger(`tours.${tourIndex}`);
    if (isTourValid) {
      onConfirm();
    }
  };

  const handleImageUpload = async (files) => {
    const fileArray = Array.from(files);
    const base64Array = await Promise.all(fileArray.map((file) => fileToBase64(file)));

    setValue(`tours.${tourIndex}.images`, [...images, ...base64Array], {
      shouldValidate: true,
    });
  };

  const removeImage = (imgIndex) => {
    setValue(
      `tours.${tourIndex}.images`,
      images.filter((_, i) => i !== imgIndex),
      { shouldValidate: true },
    );
  };

  const addPlace = () => {
    append({
      place_id: null,
      description: "",
      start_time: "",
      end_time: "",
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Grid container spacing={4}>
          {/* Tour Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom>
              Tour Information
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Tour Name"
                {...register(`tours.${tourIndex}.name`)}
                error={!!tourErrors?.name}
                helperText={tourErrors?.name?.message}
              />

              <TextField
                label="Description"
                multiline
                rows={4}
                {...register(`tours.${tourIndex}.description`)}
              />

              <TextField
                label="Price per Person"
                type="number"
                {...register(`tours.${tourIndex}.price`, {
                  valueAsNumber: true,
                })}
                error={!!tourErrors?.price}
                helperText={tourErrors?.price?.message}
              />

              <DateTimePicker
                label="Start Time"
                value={watch(`tours.${tourIndex}.startTime`) || null}
                onChange={(newValue) =>
                  setValue(`tours.${tourIndex}.startTime`, newValue, {
                    shouldValidate: true,
                  })
                }
                slotProps={{
                  textField: {
                    error: !!tourErrors?.startTime,
                    helperText: tourErrors?.startTime?.message,
                  },
                }}
              />

              <DateTimePicker
                label="End Time"
                value={watch(`tours.${tourIndex}.endTime`) || null}
                onChange={(newValue) =>
                  setValue(`tours.${tourIndex}.endTime`, newValue, {
                    shouldValidate: true,
                  })
                }
                slotProps={{
                  textField: {
                    error: !!tourErrors?.endTime,
                    helperText: tourErrors?.endTime?.message,
                  },
                }}
              />

              <TextField
                label="Max Participants"
                type="number"
                {...register(`tours.${tourIndex}.maxParticipants`, {
                  valueAsNumber: true,
                })}
                error={!!tourErrors?.maxParticipants}
                helperText={tourErrors?.maxParticipants?.message}
              />
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Tour Places */}
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Tour Itinerary
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addPlace}
                  size="small"
                  disabled={loadingPlaces}
                >
                  Add Place
                </Button>
              </Box>

              {loadingPlaces ? (
                <Box display="flex" justifyContent="center" p={2}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Stack spacing={2}>
                  {fields.map((field, index) => (
                    <Box
                      key={field.id}
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "grey.300",
                        borderRadius: 2,
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid size={12}>
                          <Autocomplete
                            options={availablePlaces}
                            getOptionLabel={(option) => option.name}
                            value={
                              availablePlaces.find(
                                (p) =>
                                  p.id === watch(`tours.${tourIndex}.places.${index}.place_id`),
                              ) || null
                            }
                            onChange={(_, value) => {
                              setValue(
                                `tours.${tourIndex}.places.${index}.place_id`,
                                value?.id || null,
                                { shouldValidate: true },
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Place"
                                error={!!tourErrors?.places?.[index]?.place_id}
                                helperText={tourErrors?.places?.[index]?.place_id?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid size={12}>
                          <TextField
                            label="Activity Description"
                            fullWidth
                            multiline
                            rows={2}
                            {...register(`tours.${tourIndex}.places.${index}.description`)}
                            placeholder="What will participants do at this location?"
                          />
                        </Grid>
                        <Grid size={6}>
                          <TextField
                            label="Start Time (e.g., 09:00)"
                            fullWidth
                            {...register(`tours.${tourIndex}.places.${index}.start_time`)}
                            placeholder="HH:MM"
                          />
                        </Grid>
                        <Grid size={6}>
                          <TextField
                            label="End Time (e.g., 12:00)"
                            fullWidth
                            {...register(`tours.${tourIndex}.places.${index}.end_time`)}
                            placeholder="HH:MM"
                          />
                        </Grid>
                        <Grid size={12}>
                          <Button
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => remove(index)}
                            size="small"
                          >
                            Remove Place
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Grid>

          {/* Images */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom>
              Tour Images
            </Typography>

            <Box
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": { borderColor: "primary.main" },
              }}
              onClick={() => document.getElementById(`tour-upload-${tourIndex}`).click()}
            >
              <AddPhotoAlternateIcon sx={{ fontSize: 40, color: "text.secondary" }} />
              <Typography>Click to upload images</Typography>
              <Typography variant="caption" color="text.secondary">
                Upload tour highlights and attractions
              </Typography>
              <input
                id={`tour-upload-${tourIndex}`}
                type="file"
                multiple
                accept="image/*"
                hidden
                onChange={(e) => handleImageUpload(e.target.files)}
              />
            </Box>

            <Grid container spacing={1} mt={1}>
              {images.map((img, i) => (
                <Grid key={img} size={4}>
                  <Box position="relative" borderRadius={2} overflow="hidden">
                    <img
                      src={img}
                      alt=""
                      style={{ width: "100%", height: 100, objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "rgba(0,0,0,0.5)",
                        color: "white",
                      }}
                      onClick={() => removeImage(i)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Box mt={4} textAlign="right">
          <Button variant="contained" size="large" onClick={handleConfirm} sx={{ minWidth: 160 }}>
            Confirm Tour
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
