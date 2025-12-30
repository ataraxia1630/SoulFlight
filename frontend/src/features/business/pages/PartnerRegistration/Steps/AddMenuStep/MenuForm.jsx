import AddIcon from "@mui/icons-material/Add";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";
import fileToBase64 from "../../fileToBase64";

const UNIT_TYPES = [
  { value: "PORTION", label: "Portion" },
  { value: "SERVING", label: "Serving" },
  { value: "PIECE", label: "Piece" },
  { value: "SLICE", label: "Slice" },
  { value: "SET", label: "Set" },
  { value: "BOX", label: "Box" },
  { value: "TRAY", label: "Tray" },
  { value: "PACK", label: "Pack" },
  { value: "CUP", label: "Cup" },
  { value: "BOTTLE", label: "Bottle" },
  { value: "CAN", label: "Can" },
  { value: "DISH", label: "Dish" },
  { value: "BOWL", label: "Bowl" },
  { value: "GLASS", label: "Glass" },
  { value: "JAR", label: "Jar" },
];

export default function MenuForm({ menuIndex, onConfirm }) {
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
    name: `menus.${menuIndex}.items`,
  });

  const menuErrors = errors.menus?.[menuIndex];
  const coverImage = watch(`menus.${menuIndex}.coverImage`);

  const handleConfirm = async () => {
    const isMenuValid = await trigger(`menus.${menuIndex}`);
    if (isMenuValid) {
      onConfirm();
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      const base64 = await fileToBase64(file);
      setValue(`menus.${menuIndex}.coverImage`, base64, {
        shouldValidate: true,
      });
    }
  };

  const handleItemImageUpload = async (itemIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }
      const base64 = await fileToBase64(file);
      setValue(`menus.${menuIndex}.items.${itemIndex}.image`, base64);
    }
  };

  const addMenuItem = () => {
    append({
      name: "",
      description: "",
      price: "",
      unit: "PORTION",
      image: "",
    });
  };

  const itemsCount = fields.length;
  const hasItems = itemsCount > 0;

  return (
    <Box>
      <Grid container spacing={4}>
        {/* Left: Menu Information */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Thông tin Menu
              </Typography>

              <Stack spacing={2.5}>
                <TextField
                  label="Tên menu"
                  placeholder="e.g., Breakfast Menu, Lunch Special"
                  {...register(`menus.${menuIndex}.name`)}
                  error={!!menuErrors?.name}
                  helperText={menuErrors?.name?.message}
                  fullWidth
                />

                <TextField
                  label="Mô tả"
                  placeholder="Brief description of this menu..."
                  multiline
                  rows={3}
                  {...register(`menus.${menuIndex}.description`)}
                  fullWidth
                />

                <Divider />

                {/* Cover Image Section */}
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Ảnh bìa
                  </Typography>

                  {!coverImage ? (
                    <Box
                      sx={{
                        border: "2px dashed",
                        borderColor: "grey.300",
                        borderRadius: 2,
                        p: 3,
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: "grey.50",
                        },
                      }}
                      onClick={() => document.getElementById(`menu-cover-${menuIndex}`).click()}
                    >
                      <AddPhotoAlternateIcon sx={{ fontSize: 40, color: "grey.400", mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Chọn ảnh để tải lên
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Max 5MB, JPG/PNG
                      </Typography>
                    </Box>
                  ) : (
                    <Box position="relative">
                      <Box
                        component="img"
                        src={coverImage}
                        alt="Menu cover"
                        sx={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                          borderRadius: 2,
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "rgba(0,0,0,0.6)",
                          color: "white",
                          "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                        }}
                        onClick={() => setValue(`menus.${menuIndex}.coverImage`, "")}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}

                  <input
                    id={`menu-cover-${menuIndex}`}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleCoverUpload}
                  />
                </Box>

                {/* Items Summary */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: hasItems ? "primary.50" : "grey.50",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: hasItems ? "primary.main" : "grey.300",
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <RestaurantIcon sx={{ color: hasItems ? "primary.main" : "grey.500" }} />
                    <Typography variant="body2" fontWeight={600}>
                      {itemsCount} Menu Item{itemsCount !== 1 ? "s" : ""}
                    </Typography>
                  </Stack>
                  {!hasItems && (
                    <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                      Thêm ít nhất 1 món vào menu
                    </Typography>
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Menu Items */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight={600}>
                Danh sách các món
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={addMenuItem}
                variant="contained"
                size="small"
              >
                Thêm món
              </Button>
            </Box>

            {fields.length === 0 ? (
              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: "grey.300",
                  borderRadius: 2,
                  p: 4,
                  textAlign: "center",
                }}
              >
                <RestaurantIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
                <Typography variant="body1" color="text.secondary" mb={1}>
                  Chưa có món nào
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Bắt đầu thêm món vào menu
                </Typography>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={addMenuItem}>
                  Thêm món đầu tiên
                </Button>
              </Box>
            ) : (
              <Stack spacing={2} maxHeight={600} overflow="auto" pr={1}>
                {fields.map((field, index) => {
                  const itemImage = watch(`menus.${menuIndex}.items.${index}.image`);
                  const itemErrors = menuErrors?.items?.[index];

                  return (
                    <Card key={field.id} variant="outlined">
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={2}
                        >
                          <Chip
                            label={`Item ${index + 1}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => remove(index)}
                            title="Remove item"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        <Grid container spacing={2}>
                          {/* Item Image */}
                          <Grid size={12}>
                            {!itemImage ? (
                              <Box
                                sx={{
                                  border: "1px dashed",
                                  borderColor: "grey.300",
                                  borderRadius: 1,
                                  p: 2,
                                  textAlign: "center",
                                  cursor: "pointer",
                                  bgcolor: "grey.50",
                                  "&:hover": { borderColor: "primary.main" },
                                }}
                                onClick={() =>
                                  document
                                    .getElementById(`item-image-${menuIndex}-${index}`)
                                    .click()
                                }
                              >
                                <AddPhotoAlternateIcon sx={{ fontSize: 24, color: "grey.400" }} />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  Add item image (optional)
                                </Typography>
                              </Box>
                            ) : (
                              <Box position="relative" display="inline-block">
                                <Box
                                  component="img"
                                  src={itemImage}
                                  alt=""
                                  sx={{
                                    width: "100%",
                                    height: 120,
                                    objectFit: "cover",
                                    borderRadius: 1,
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    bgcolor: "rgba(0,0,0,0.6)",
                                    color: "white",
                                    "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                                  }}
                                  onClick={() =>
                                    setValue(`menus.${menuIndex}.items.${index}.image`, "")
                                  }
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                            <input
                              id={`item-image-${menuIndex}-${index}`}
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={(e) => handleItemImageUpload(index, e)}
                            />
                          </Grid>

                          {/* Item Name */}
                          <Grid size={12}>
                            <TextField
                              label="Item Name"
                              placeholder="e.g., Caesar Salad"
                              fullWidth
                              {...register(`menus.${menuIndex}.items.${index}.name`)}
                              error={!!itemErrors?.name}
                              helperText={itemErrors?.name?.message}
                            />
                          </Grid>

                          {/* Description */}
                          <Grid size={12}>
                            <TextField
                              label="Description"
                              placeholder="Ingredients, preparation, etc."
                              fullWidth
                              multiline
                              rows={2}
                              {...register(`menus.${menuIndex}.items.${index}.description`)}
                            />
                          </Grid>

                          {/* Price & Unit */}
                          <Grid size={6}>
                            <TextField
                              label="Price"
                              type="number"
                              fullWidth
                              {...register(`menus.${menuIndex}.items.${index}.price`, {
                                valueAsNumber: true,
                              })}
                              error={!!itemErrors?.price}
                              helperText={itemErrors?.price?.message}
                            />
                          </Grid>

                          <Grid size={6}>
                            <FormControl fullWidth>
                              <InputLabel>Unit</InputLabel>
                              <Select
                                {...register(`menus.${menuIndex}.items.${index}.unit`)}
                                defaultValue="PORTION"
                                label="Unit"
                              >
                                {UNIT_TYPES.map((unit) => (
                                  <MenuItem key={unit.value} value={unit.value}>
                                    {unit.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            )}

            {menuErrors?.items &&
              typeof menuErrors.items === "object" &&
              !Array.isArray(menuErrors.items) && (
                <Typography color="error" fontSize="0.75rem" mt={2}>
                  {menuErrors.items.message}
                </Typography>
              )}
          </Box>
        </Grid>
      </Grid>

      <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" size="large" onClick={onConfirm}>
          Cancel
        </Button>
        <Button variant="contained" size="large" onClick={handleConfirm} sx={{ minWidth: 160 }}>
          Save
        </Button>
      </Box>
    </Box>
  );
}
