import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import PlaceService from "../../../../../../shared/services/place.service";

export default function TicketForm({ ticketIndex, onConfirm }) {
  const {
    trigger,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const ticketErrors = errors.tickets?.[ticketIndex];
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectedPlaceId = watch(`tickets.${ticketIndex}.placeId`);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const response = await PlaceService.getAll();
        setPlaces(response.data || []);
      } catch (error) {
        console.error("Failed to fetch places:", error);
        setPlaces([
          { id: 1, name: "Vịnh Hạ Long" },
          { id: 2, name: "Phố cổ Hội An" },
          { id: 3, name: "Đền Angkor Wat" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const handleConfirm = async () => {
    const isTicketValid = await trigger(`tickets.${ticketIndex}`);
    if (isTicketValid) {
      onConfirm();
    }
  };

  const selectedPlace = places.find((p) => p.id === selectedPlaceId);

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom>
            Ticket Information
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Ticket Name"
              {...register(`tickets.${ticketIndex}.name`)}
              error={!!ticketErrors?.name}
              helperText={ticketErrors?.name?.message}
              placeholder="e.g., Adult Entry Ticket, VIP Pass"
            />

            <TextField
              label="Description"
              multiline
              rows={4}
              {...register(`tickets.${ticketIndex}.description`)}
              placeholder="Describe what's included, any restrictions, validity period..."
            />

            <TextField
              label="Price"
              type="number"
              {...register(`tickets.${ticketIndex}.price`, {
                valueAsNumber: true,
              })}
              error={!!ticketErrors?.price}
              helperText={ticketErrors?.price?.message}
            />

            <Autocomplete
              options={places}
              getOptionLabel={(option) => option.name}
              loading={loading}
              value={selectedPlace || null}
              onChange={(_, value) => {
                setValue(`tickets.${ticketIndex}.placeId`, value?.id || null, {
                  shouldValidate: true,
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Place/Attraction"
                  error={!!ticketErrors?.placeId}
                  helperText={
                    ticketErrors?.placeId?.message || "Choose the attraction this ticket is for"
                  }
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom>
            Ticket Guidelines
          </Typography>
          <Box
            sx={{
              p: 3,
              bgcolor: "grey.50",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "grey.300",
            }}
          >
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Tips for creating ticket listings:</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li>Include what's covered in the ticket price</li>
                <li>Specify any age restrictions or requirements</li>
                <li>Mention validity period (e.g., valid for 1 day)</li>
                <li>Note if advance booking is required</li>
                <li>Include cancellation policy if applicable</li>
                <li>List any excluded items or additional costs</li>
              </ul>
            </Typography>
          </Box>

          {selectedPlace && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: "primary.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "primary.main",
              }}
            >
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Selected Place
              </Typography>
              <Typography variant="body2">{selectedPlace.name}</Typography>
              {selectedPlace.address && (
                <Typography variant="caption" color="text.secondary">
                  {selectedPlace.address}
                </Typography>
              )}
            </Box>
          )}
        </Grid>
      </Grid>

      <Box mt={4} textAlign="right">
        <Button variant="contained" size="large" onClick={handleConfirm} sx={{ minWidth: 160 }}>
          Confirm Ticket
        </Button>
      </Box>
    </Box>
  );
}
