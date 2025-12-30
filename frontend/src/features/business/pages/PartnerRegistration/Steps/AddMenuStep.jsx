import { Alert, AlertTitle, Box, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import MenuForm from "./AddMenuStep/MenuForm";
import MenuList from "./AddMenuStep/MenuList";

export default function AddMenuStep() {
  const theme = useTheme();
  const {
    watch,
    formState: { errors },
  } = useFormContext();
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(null);
  const menus = watch("menus") || [];
  const menuErrors = errors.menus;

  const handleSelectMenu = (index) => {
    setSelectedMenuIndex(index);
  };

  const handleConfirm = () => {
    setSelectedMenuIndex(null);
  };

  const hasMenus = menus.length > 0;
  const completedMenus = menus.filter((m) => m.name && m.items?.length > 0).length;
  const incompleteMenus = menus.length - completedMenus;

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
      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          color: theme.palette.text.dark,
          fontWeight: 600,
          textAlign: "center",
          mb: 1,
        }}
      >
        Create Your Restaurant Menus
      </Typography>

      <Typography
        sx={{
          textAlign: "center",
          color: "text.secondary",
          mb: 3,
          fontSize: "0.95rem",
        }}
      >
        Add your menus and items to showcase your culinary offerings to customers
      </Typography>

      {/* Progress Alert */}
      {hasMenus && (
        <Box mb={3}>
          {incompleteMenus > 0 ? (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              <AlertTitle>Incomplete Menus</AlertTitle>
              {incompleteMenus} menu{incompleteMenus > 1 ? "s" : ""} need
              {incompleteMenus === 1 ? "s" : ""} more items. Each menu should have at least one
              item.
            </Alert>
          ) : (
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              <AlertTitle>Great! All Menus Complete</AlertTitle>
              You have {completedMenus} menu{completedMenus > 1 ? "s" : ""} ready with items.
            </Alert>
          )}
        </Box>
      )}

      {/* Validation Error */}
      {menuErrors && typeof menuErrors === "object" && !Array.isArray(menuErrors) && (
        <Box mb={3}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            <AlertTitle>Validation Error</AlertTitle>
            {menuErrors.message || "Please fix the errors in your menus"}
          </Alert>
        </Box>
      )}

      {/* Menu List */}
      <MenuList onSelectMenu={handleSelectMenu} selectedIndex={selectedMenuIndex} />

      {selectedMenuIndex !== null && (
        <Box mt={4}>
          <MenuForm menuIndex={selectedMenuIndex} onConfirm={handleConfirm} />
        </Box>
      )}

      {/* Empty State */}
      {menus.length === 0 && selectedMenuIndex === null && (
        <Box
          textAlign="center"
          py={6}
          sx={{
            border: "2px dashed",
            borderColor: "grey.300",
            borderRadius: 3,
            bgcolor: "grey.50",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "primary.50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <Typography variant="h2">🍽️</Typography>
          </Box>
          <Typography color="text.primary" variant="h6" mb={1} fontWeight={600}>
            No menus yet
          </Typography>
          <Typography color="text.secondary" variant="body2" mb={2}>
            Click "Add Menu" above to create your first menu and start adding delicious items
          </Typography>
          <Box
            component="ul"
            sx={{
              display: "inline-block",
              textAlign: "left",
              pl: 2,
              mt: 2,
              "& li": {
                color: "text.secondary",
                fontSize: "0.875rem",
                mb: 0.5,
              },
            }}
          >
            <li>Create multiple menus (Breakfast, Lunch, Dinner, etc.)</li>
            <li>Add cover images to make them more appealing</li>
            <li>Include detailed item descriptions and prices</li>
            <li>Upload item photos to showcase your dishes</li>
          </Box>
        </Box>
      )}

      {/* Tips */}
      {hasMenus && selectedMenuIndex === null && (
        <Box
          mt={4}
          p={3}
          bgcolor="info.50"
          borderRadius={2}
          border="1px solid"
          borderColor="info.main"
        >
          <Typography variant="subtitle2" fontWeight={600} color="info.main" mb={1}>
            💡 Tips for Great Menus
          </Typography>
          <Box
            component="ul"
            sx={{
              m: 0,
              pl: 2,
              "& li": {
                color: "text.secondary",
                fontSize: "0.875rem",
                mb: 0.5,
              },
            }}
          >
            <li>Use high-quality images that make your food look appetizing</li>
            <li>Write clear descriptions with key ingredients and preparation methods</li>
            <li>Organize items logically (appetizers, mains, desserts, drinks)</li>
            <li>Keep prices competitive and clearly displayed with units</li>
            <li>Update your menu regularly with seasonal items and specials</li>
          </Box>
        </Box>
      )}
    </Box>
  );
}
