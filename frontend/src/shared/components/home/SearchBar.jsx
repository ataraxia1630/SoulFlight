import { CalendarMonth, LocationOn, People, Search } from "@mui/icons-material";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchDialog from "./SearchDialog";

const SearchBar = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeField, setActiveField] = useState("location");

  const [searchParams, setSearchParams] = useState({
    location: "",
    checkIn: null,
    checkOut: null,
    guests: null,
  });

  const fields = [
    {
      icon: <LocationOn sx={{ color: "text.secondary", fontSize: 25 }} />,
      title: "Location",
      subtitle: "Add place",
      fieldType: "location",
    },
    {
      icon: <CalendarMonth sx={{ color: "text.secondary", fontSize: 25 }} />,
      title: "Check in",
      subtitle: "Add dates",
      fieldType: "checkIn",
    },
    {
      icon: <CalendarMonth sx={{ color: "text.secondary", fontSize: 25 }} />,
      title: "Check out",
      subtitle: "Add dates",
      fieldType: "checkOut",
    },
    {
      icon: <People sx={{ color: "text.secondary", fontSize: 25 }} />,
      title: "Guests",
      subtitle: "Add guests",
      fieldType: "guests",
    },
  ];

  const handleFieldClick = (fieldType) => {
    setActiveField(fieldType);
    setDialogOpen(true);
  };

  const handleSearch = () => {
    // Navigate sang trang explore với search params
    const params = new URLSearchParams();
    if (searchParams.location) params.append("location", searchParams.location);
    if (searchParams.checkIn) params.append("checkIn", searchParams.checkIn);
    if (searchParams.checkOut) params.append("checkOut", searchParams.checkOut);
    if (searchParams.guests) params.append("guests", searchParams.guests);

    navigate(`/explore?${params.toString()}`);
    setDialogOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
        }}
      >
        {fields.map((field, index) => (
          <Box key={field.title} sx={{ display: "flex", alignItems: "center", flex: 1, gap: 0.5 }}>
            <Box
              onClick={() => handleFieldClick(field.fieldType)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                flex: 1,
                cursor: "pointer",
                p: 1,
                borderRadius: 1,
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              {field.icon}
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 0.2 }}>
                  {field.title}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  {field.subtitle}
                </Typography>
              </Box>
            </Box>

            {index < fields.length - 1 && (
              <Divider
                orientation="vertical"
                sx={{
                  height: 47,
                  alignSelf: "center",
                  borderWidth: 1.1,
                }}
              />
            )}
          </Box>
        ))}

        <IconButton
          onClick={() => {
            setActiveField("location");
            setDialogOpen(true);
          }}
          sx={{
            bgcolor: "primary.main",
            color: "text.contrast",
            width: 52,
            height: 52,
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          <Search sx={{ fontSize: 26 }} />
        </IconButton>
      </Box>

      <SearchDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        activeField={activeField}
        searchParams={searchParams}
        onSearchParamsChange={setSearchParams}
        onSearch={handleSearch}
      />
    </>
  );
};

export default SearchBar;
