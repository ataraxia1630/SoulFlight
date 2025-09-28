import { Outlet } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Avatar,
  Button,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useTranslation } from "react-i18next";

const MainLayout = () => {
  const { i18n } = useTranslation();

  const handleChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Box>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: "1px solid #e0e0e0", bgcolor: "white" }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "black" }}>
            LOGO
          </Typography>

          <Box sx={{ display: "flex", gap: 4 }}>
            <Button
              sx={{ color: "black", textTransform: "none", fontSize: "14px" }}
            >
              Home
            </Button>
            <Button
              sx={{ color: "black", textTransform: "none", fontSize: "14px" }}
            >
              Explore
            </Button>
            <Button
              sx={{ color: "black", textTransform: "none", fontSize: "14px" }}
            >
              My Trips
            </Button>
            <Button
              sx={{ color: "black", textTransform: "none", fontSize: "14px" }}
            >
              News
            </Button>
            <Button
              sx={{ color: "black", textTransform: "none", fontSize: "14px" }}
            >
              Contact
            </Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              size="small"
              placeholder=""
              sx={{
                width: 220,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "30px",
                  bgcolor: "#f5f5f5",
                  "& fieldset": {
                    border: "1px solid #e0e0e0",
                  },
                  "&:hover fieldset": {
                    border: "1.2px solid #d0d0d0",
                  },
                  "&.Mui-focused fieldset": {
                    border: "1.5px solid black",
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
                <Typography sx={{ fontSize: "14px", color: "white" }}>
                  U
                </Typography>
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
      <Box sx={{ p: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
