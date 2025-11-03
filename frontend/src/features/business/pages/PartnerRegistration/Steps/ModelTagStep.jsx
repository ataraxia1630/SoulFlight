import ApartmentIcon from "@mui/icons-material/Apartment";
import CottageIcon from "@mui/icons-material/Cottage";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import HomeIcon from "@mui/icons-material/Home";
import HotelIcon from "@mui/icons-material/Hotel";
import HouseIcon from "@mui/icons-material/House";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ParkIcon from "@mui/icons-material/Park";
import VillaIcon from "@mui/icons-material/Villa";
import { Box, Typography, useTheme } from "@mui/material";
import { useFormContext } from "react-hook-form";

const MODEL_OPTIONS = [
  { label: "Khách sạn", icon: <HotelIcon />, value: "hotel" },
  { label: "Khu nghỉ dưỡng", icon: <CottageIcon />, value: "resort" },
  { label: "Homestay", icon: <HomeIcon />, value: "homestay" },
  { label: "Căn hộ", icon: <ApartmentIcon />, value: "apartment" },
  { label: "Biệt thự", icon: <VillaIcon />, value: "villa" },
  { label: "Nhà nghỉ (Motel)", icon: <MeetingRoomIcon />, value: "motel" },
  { label: "Nhà trọ", icon: <HouseIcon />, value: "guesthouse" },
  { label: "Lều/Cắm trại", icon: <ParkIcon />, value: "camping" },
  { label: "Du thuyền/Thuyền", icon: <DirectionsBoatIcon />, value: "boat" },
];

export default function ModelTagStep() {
  const theme = useTheme();
  const { setValue, watch } = useFormContext();
  const selected = watch("modelTag") || "";

  const handleSelect = (model) => {
    setValue("modelTag", model, { shouldValidate: true });
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
        Your service model is more likely to be?
      </Typography>

      <Box flexGrow={1} bgcolor="white" px={{ xs: 2, sm: 4, md: 6 }} py={3} alignItems="center">
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={5}>
          {MODEL_OPTIONS.map((tag) => {
            const isSelected = selected === tag.value;

            return (
              <Box
                key={tag.value}
                onClick={() => handleSelect(tag.value)}
                sx={{
                  height: 80,
                  borderRadius: 3,
                  border: `2px solid ${isSelected ? theme.palette.primary.main : "#e0e0e0"}`,
                  backgroundColor: isSelected ? `${theme.palette.primary.main}10` : "white",
                  color: isSelected ? theme.palette.primary.main : "text.primary",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 1.5,
                  px: 2,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                  fontWeight: isSelected ? 600 : 500,

                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: `${theme.palette.primary.main}08`,
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                  },

                  "& .icon": {
                    fontSize: 28,
                    color: isSelected ? theme.palette.primary.main : "inherit",
                  },
                }}
              >
                <Box className="icon" sx={{ display: "flex", alignItems: "center" }}>
                  {tag.icon}
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    fontWeight: "inherit",
                  }}
                >
                  {tag.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
