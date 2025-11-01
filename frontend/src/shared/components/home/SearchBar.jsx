import { CalendarMonth, LocationOn, People, Search } from "@mui/icons-material";
import { Box, Divider, IconButton, Typography } from "@mui/material";

const SearchBar = () => {
  const fields = [
    {
      icon: <LocationOn sx={{ color: "text.secondary", fontSize: 25 }} />,
      title: "Location",
      subtitle: "Add place",
    },
    {
      icon: <CalendarMonth sx={{ color: "text.secondary", fontSize: 25 }} />,
      title: "Check in",
      subtitle: "Add dates",
    },
    {
      icon: <CalendarMonth sx={{ color: "text.secondary", fontSize: 25 }} />,
      title: "Check out",
      subtitle: "Add dates",
    },
    {
      icon: <People sx={{ color: "text.secondary", fontSize: 25 }} />,
      title: "Guests",
      subtitle: "Add guests",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      {fields.map((field, index) => (
        <Box key={field.title} sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, flex: 1 }}>
            {field.icon}
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 0.2 }}>{field.title}</Typography>
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
  );
};

export default SearchBar;
