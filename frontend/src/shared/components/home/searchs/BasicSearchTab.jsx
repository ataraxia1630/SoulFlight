import { Add, LocationOn, People, Remove } from "@mui/icons-material";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useState } from "react";
import FormInput from "../../FormInput";

const BasicSearchTab = ({ searchParams, setSearchParams, activeField }) => {
  const formatPrice = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parsePrice = (value) => Number(value.replace(/\./g, "") || 0);

  const handlePriceChange = (name, value) => {
    const numericValue = parsePrice(value);
    if (Number.isNaN(numericValue)) return;

    setSearchParams((prev) => ({
      ...prev,
      [name]: numericValue,
      [`${name}Display`]: formatPrice(numericValue),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
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

  const [focus, setFocus] = useState({
    location: false,
    priceMin: false,
    priceMax: false,
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <LocationOn sx={{ color: "primary.main" }} />
          <Typography sx={{ fontWeight: 600 }}>Địa Điểm</Typography>
        </Box>
        <FormInput
          name="location"
          placeholder={focus.location || searchParams.location ? "" : "Bạn muốn đi đâu?"}
          value={searchParams.location || ""}
          onChange={handleChange}
          onFocus={() => setFocus((f) => ({ ...f, location: true }))}
          onBlur={() => setFocus((f) => ({ ...f, location: false }))}
          autoFocus={activeField === "location"}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <PaymentsIcon sx={{ color: "primary.main" }} />
            <Typography sx={{ fontWeight: 600 }}>Giá Nhỏ Nhất</Typography>
          </Box>
          <FormInput
            name="priceMin"
            placeholder={focus.priceMin || searchParams.priceMinDisplay ? "" : "Nhập giá nhỏ nhất"}
            value={searchParams.priceMinDisplay || ""}
            onChange={(e) => handlePriceChange("priceMin", e.target.value)}
            onFocus={() => setFocus((f) => ({ ...f, priceMin: true }))}
            onBlur={() => setFocus((f) => ({ ...f, priceMin: false }))}
            autoFocus={activeField === "priceMin"}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <PaymentsIcon sx={{ color: "primary.main" }} />
            <Typography sx={{ fontWeight: 600 }}>Giá Lớn Nhất</Typography>
          </Box>
          <FormInput
            name="priceMax"
            placeholder={focus.priceMax || searchParams.priceMaxDisplay ? "" : "Nhập giá lớn nhất"}
            value={searchParams.priceMaxDisplay || ""}
            onChange={(e) => handlePriceChange("priceMax", e.target.value)}
            onFocus={() => setFocus((f) => ({ ...f, priceMax: true }))}
            onBlur={() => setFocus((f) => ({ ...f, priceMax: false }))}
            autoFocus={activeField === "priceMax"}
          />
        </Box>
      </Box>

      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <People sx={{ color: "primary.main" }} />
          <Typography sx={{ fontWeight: 600 }}>Số Khách</Typography>
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
          <Typography>Số lượng khách</Typography>
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
              autoFocus={activeField === "guests"}
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
