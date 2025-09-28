import { AppBar, Toolbar, Typography, Box, Select, MenuItem, TextField, InputAdornment, Avatar, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t, i18n } = useTranslation();
  const navItems = ["home", "explore", "trips", "news", "contact"];

  const handleChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        bgcolor: "white",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "black" }}>
          LOGO
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          {navItems.map((item) => (
            <Button
              key={item}
              TouchRippleProps={{
                style: { color: "rgba(30, 155, 205, 0.5)" },
              }}
              sx={{
                color: "black",
                "&:active": {
                  backgroundColor: "rgba(30, 155, 205, 0.2)",
                },
              }}
            >
              {t(`header.${item}`)}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            size="small"
            placeholder=""
            sx={{
              width: 220,
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                height: "35px",
                "& fieldset": {
                  border: "1px solid #626262ff",
                },
                "&:hover fieldset": {
                  border: "1.2px solid #3d3d3dff",
                },
                "&.Mui-focused fieldset": {
                  border: "1px solid black",
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: "gray", fontSize: "20px" }} />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "#4CAF50" }}>
              <Typography sx={{ fontSize: "14px", color: "white" }}>U</Typography>
            </Avatar>

            <Select
              value={i18n.language}
              onChange={handleChange}
              size="small"
              variant="standard"
              disableUnderline
              IconComponent={KeyboardArrowDownIcon}
              sx={{
                fontSize: "14px",
                color: "black",
                "& .MuiSelect-select": {
                  padding: "4px 24px 4px 8px",
                },
              }}
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="vi">VI</MenuItem>
            </Select>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
