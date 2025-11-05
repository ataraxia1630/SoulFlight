import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormContext } from "react-hook-form";

const CURRENCIES = ["VND", "USD"];

export default function RoomForm({ roomIndex, onConfirm }) {
  const {
    trigger,
    register,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useFormContext();
  const roomErrors = errors.rooms?.[roomIndex];

  const handleConfirm = async () => {
    const isRoomValid = await trigger(`rooms.${roomIndex}`);
    if (isRoomValid) {
      onConfirm();
    }
  };

  const isEditing = watch(`rooms.${roomIndex}.name`)?.trim();

  const images = watch(`rooms.${roomIndex}.images`) || [];

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
    setValue(`rooms.${roomIndex}.images`, [...images, ...newImages], {
      shouldValidate: true,
    });
  };

  const removeImage = (imgIndex) => {
    setValue(
      `rooms.${roomIndex}.images`,
      images.filter((_, i) => i !== imgIndex),
      { shouldValidate: true },
    );
  };

  return (
    <Box>
      <Grid container spacing={4}>
        {/* Thông tin phòng */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom>
            Room Information
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Room name"
              {...register(`rooms.${roomIndex}.name`)}
              error={!!roomErrors?.name}
              helperText={roomErrors?.name?.message}
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              {...register(`rooms.${roomIndex}.description`)}
            />

            <Box display="flex" gap={1} alignItems="center">
              <TextField
                label="Price"
                type="number"
                sx={{ flex: 1 }}
                {...register(`rooms.${roomIndex}.price`, {
                  valueAsNumber: true,
                })}
                error={!!roomErrors?.price}
                helperText={roomErrors?.price?.message}
              />
              <FormControl sx={{ minWidth: 100 }}>
                <InputLabel>Currency</InputLabel>
                <Select {...register(`rooms.${roomIndex}.currency`)} defaultValue="VND">
                  {CURRENCIES.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography color="text.secondary">per night</Typography>
            </Box>

            <TextField
              label="Bed number"
              type="number"
              {...register(`rooms.${roomIndex}.bedCount`, {
                valueAsNumber: true,
              })}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Guests
              </Typography>
              <Grid container spacing={1}>
                <Grid size={6}>
                  <TextField
                    label="Adult"
                    type="number"
                    fullWidth
                    {...register(`rooms.${roomIndex}.guestAdult`, {
                      valueAsNumber: true,
                    })}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    label="Children"
                    type="number"
                    fullWidth
                    {...register(`rooms.${roomIndex}.guestChild`, {
                      valueAsNumber: true,
                    })}
                  />
                </Grid>
              </Grid>
            </Box>

            <FormControl component="fieldset">
              <Typography variant="subtitle2">Pet allowed?</Typography>
              <RadioGroup row {...register(`rooms.${roomIndex}.petAllowed`)} defaultValue={false}>
                <FormControlLabel control={<Radio />} label="Yes" value={true} />
                <FormControlLabel control={<Radio />} label="No" value={false} />
              </RadioGroup>
            </FormControl>
          </Stack>
        </Grid>

        {/* Hình ảnh */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom>
            Room Images
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
            onClick={() => document.getElementById(`upload-${roomIndex}`).click()}
          >
            <AddPhotoAlternateIcon sx={{ fontSize: 40, color: "text.secondary" }} />
            <Typography>Click to upload images</Typography>
            <input
              id={`upload-${roomIndex}`}
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
                  <Chip
                    label={i === 0 ? "Entrance" : i === 1 ? "Bedroom" : "Bathroom"}
                    size="small"
                    sx={{ position: "absolute", bottom: 4, left: 4 }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>

          {roomErrors?.images && (
            <Typography color="error" fontSize="0.75rem" mt={1}>
              {roomErrors.images.message}
            </Typography>
          )}
        </Grid>
      </Grid>
      <Box mt={4} textAlign="right">
        <Button
          variant="contained"
          size="large"
          onClick={handleConfirm}
          disabled={!isValid && Object.keys(roomErrors || {}).length > 0}
          sx={{ minWidth: 160 }}
        >
          {isEditing ? "Cập nhật phòng" : "Thêm phòng"}
        </Button>
      </Box>
    </Box>
  );
}
