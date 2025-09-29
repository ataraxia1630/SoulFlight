import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

const Header = () => {
  const { t, i18n } = useTranslation();
  const navItems = ["home", "explore", "trips", "news", "contact"];

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        minWidth: "600px",
        bgcolor: "white",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 2, lg: 2 },
          py: { xs: 1, lg: 1.5 },
          flexWrap: "wrap",
          minHeight: { xs: 64, lg: 72 },
          "& > *": {
            "&:nth-child(n+2)": {
              marginLeft: "auto",
            },
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "black",
            flexShrink: 0,
          }}
        >
          LOGO
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.5, md: 3, lg: 4 },
            flexWrap: "wrap",
          }}
        >
          {navItems.map((item) => (
            <Button
              key={item}
              component={RouterLink}
              to={item === "home" ? "/" : `/${item}`}
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

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, md: 1.5, lg: 2 },
            flexShrink: 0,
          }}
        >
          <TextField
            size="small"
            sx={{
              width: { xs: 150, md: 180, lg: 220 },
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, lg: 1.5 },
            }}
          >
            {/* <Avatar sx={{ width: 32, height: 32, bgcolor: "#4CAF50" }}>
              <Typography sx={{ fontSize: "14px", color: "white" }}>
                U
              </Typography>
            </Avatar> */}

            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              sx={{
                minWidth: { xs: 50, md: 60 },
                height: "32px",
                borderRadius: "20px",
                border: "1px solid #1E9BCD",
                color: "#1E9BCD",
                px: { xs: 1, md: 2 },
                "&:hover": {
                  backgroundColor: "rgba(14, 165, 233, 0.08)",
                  border: "1px solid #1E9BCD",
                },
              }}
            >
              {t("auth.login")}
            </Button>

            <Button
              component={RouterLink}
              to="/signup/traveler"
              variant="contained"
              sx={{
                minWidth: { xs: 50, md: 60 },
                height: "32px",
                borderRadius: "20px",
                backgroundColor: "#1E9BCD",
                color: "white",
                px: { xs: 1, md: 2 },
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#0284c7",
                  boxShadow: "none",
                },
              }}
            >
              {t("auth.signup")}
            </Button>

            <Select
              value={i18n.language}
              onChange={handleChange}
              size="small"
              variant="standard"
              disableUnderline
              IconComponent={KeyboardArrowDownIcon}
              sx={{
                color: "black",
                "& .MuiSelect-select": {
                  padding: { xs: "4px 20px 4px 4px", md: "4px 24px 4px 8px" },
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
