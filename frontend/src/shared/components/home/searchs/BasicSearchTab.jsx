import { Add, CalendarMonth, LocationOn, People, Remove } from "@mui/icons-material";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useState } from "react";
import FormInput from "../../FormInput";

const BasicSearchTab = ({ searchParams, setSearchParams, activeField }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    setSearchParams((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const updateGuests = (change) => {
    setSearchParams((prev) => ({
      ...prev,
      guests: Math.max(1, Number(prev.guests || 1) + change),
    }));
  };

  const handleGuestInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!Number.isNaN(value) && value >= 1) {
      setSearchParams((prev) => ({ ...prev, guests: value }));
    }
  };

  const [isFocused, setIsFocused] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <LocationOn sx={{ color: "primary.main" }} />
          <Typography sx={{ fontWeight: 600 }}>Location</Typography>
        </Box>
        <FormInput
          name="location"
          placeholder={isFocused ? "" : "Where are you going?"}
          value={searchParams.location}
          onChange={handleChange}
          InputLabelProps={{ shrink: false }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <CalendarMonth sx={{ color: "primary.main" }} />
            <Typography sx={{ fontWeight: 600 }}>Check In</Typography>
          </Box>
          <FormInput
            type="date"
            name="checkIn"
            value={searchParams.checkIn}
            onChange={(newValue) => handleDateChange("checkIn", newValue)}
            autoFocus={activeField === "checkIn"}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <CalendarMonth sx={{ color: "primary.main" }} />
            <Typography sx={{ fontWeight: 600 }}>Check Out</Typography>
          </Box>
          <FormInput
            type="date"
            name="checkOut"
            value={searchParams.checkOut}
            onChange={(newValue) => handleDateChange("checkOut", newValue)}
            autoFocus={activeField === "checkOut"}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </Box>

      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <People sx={{ color: "primary.main" }} />
          <Typography sx={{ fontWeight: 600 }}>Guests</Typography>
        </Box>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "background.input",
            borderRadius: 1.5,
            border: 0.2,
            borderColor: "border.light",
          }}
        >
          <Typography>Number of guests</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => updateGuests(-1)}
              disabled={searchParams.guests <= 1}
              sx={{
                bgcolor: "background.default",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Remove />
            </IconButton>

            <FormInput
              name="guests"
              value={searchParams.guests}
              onChange={handleGuestInputChange}
              inputProps={{ min: 1, style: { textAlign: "center", width: 40 } }}
              size="small"
            />

            <IconButton
              size="small"
              onClick={() => updateGuests(1)}
              sx={{
                bgcolor: "background.default",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Add />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default BasicSearchTab;
