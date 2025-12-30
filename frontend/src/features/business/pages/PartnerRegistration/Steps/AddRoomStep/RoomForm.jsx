import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import fileToBase64 from "../../fileToBase64";

const CURRENCIES = ["VND"];

export default function RoomForm({ roomIndex, onConfirm }) {
  const {
    trigger,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const roomErrors = errors.rooms?.[roomIndex];
  const images = watch(`rooms.${roomIndex}.images`) || [];

  const handleConfirm = async () => {
    console.log("=== DEBUG START ===");
    console.log("1. Room index:", roomIndex);
    console.log("2. Room data:", watch(`rooms.${roomIndex}`));
    console.log("3. All form errors:", errors);
    console.log("4. Rooms errors:", errors.rooms);

    const isRoomValid = await trigger(`rooms.${roomIndex}`);

    console.log("5. Is valid:", isRoomValid);
    console.log("6. Errors after trigger:", errors);

    if (isRoomValid) {
      console.log("✅ VALID");
      onConfirm();
    } else {
      console.log("❌ INVALID");
    }
  };

  const handleImageUpload = async (files) => {
    const fileArray = Array.from(files);
    const base64Array = [];

    for (const file of fileArray) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        continue;
      }
      const base64 = await fileToBase64(file);
      base64Array.push(base64);
    }

    setValue(`rooms.${roomIndex}.images`, [...images, ...base64Array], {
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
        {/* Left: Room Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom>
            Thông tin phòng
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Tên phòng"
              placeholder="VD: Phòng Deluxe"
              {...register(`rooms.${roomIndex}.name`)}
              error={!!roomErrors?.name}
              helperText={roomErrors?.name?.message}
              fullWidth
            />

            <TextField
              label="Mô tả"
              placeholder="Mô tả về phòng..."
              multiline
              rows={3}
              {...register(`rooms.${roomIndex}.description`)}
              fullWidth
            />

            <Box display="flex" gap={1} alignItems="center">
              <TextField
                label="Giá phòng một đêm"
                type="number"
                sx={{ flex: 1 }}
                {...register(`rooms.${roomIndex}.price`, {
                  valueAsNumber: true,
                })}
                error={!!roomErrors?.price}
                helperText={roomErrors?.price?.message}
              />
              <Typography color="text.secondary">{CURRENCIES[0]}</Typography>
            </Box>

            <TextField
              label="Tổng số phòng"
              type="number"
              {...register(`rooms.${roomIndex}.totalRooms`, {
                valueAsNumber: true,
              })}
              helperText="Số phòng cùng loại này"
            />

            <TextField
              label="Số lượng giường"
              type="number"
              {...register(`rooms.${roomIndex}.bedCount`, {
                valueAsNumber: true,
              })}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Số khách tối đa
              </Typography>
              <Grid container spacing={1}>
                <Grid size={6}>
                  <TextField
                    label="Người lớn"
                    type="number"
                    fullWidth
                    {...register(`rooms.${roomIndex}.guestAdult`, {
                      valueAsNumber: true,
                    })}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    label="Trẻ em"
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
              <Typography variant="subtitle2">Có cho phép mang thú cưng?</Typography>
              <RadioGroup
                row
                value={watch(`rooms.${roomIndex}.petAllowed`) ?? false}
                onChange={(e) =>
                  setValue(`rooms.${roomIndex}.petAllowed`, e.target.value === "true")
                }
              >
                <FormControlLabel control={<Radio />} label="Có" value={true} />
                <FormControlLabel control={<Radio />} label="Không" value={false} />
              </RadioGroup>
            </FormControl>
          </Stack>
        </Grid>

        {/* Right: Images */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom>
            Hình ảnh phòng
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
            <Typography>Chọn ảnh để tải lên</Typography>
            <Typography variant="caption" color="text.secondary">
              Max 5MB mỗi ảnh, JPG/PNG
            </Typography>
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

      <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" size="large" onClick={onConfirm}>
          Cancel
        </Button>
        <Button variant="contained" size="large" onClick={handleConfirm} sx={{ minWidth: 160 }}>
          Save Room
        </Button>
      </Box>
    </Box>
  );
}
