import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  AppBar,
  Box,
  Button,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

const Header = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
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
        bgcolor: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.border.divider}`,
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
            color: theme.palette.text.primary,
            flexShrink: 0,
          }}
        >
          SOULFLIGHT
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
                style: { color: `${theme.palette.primary.light}80` },
              }}
              sx={{
                color: theme.palette.text.primary,
                "&:active": {
                  backgroundColor: `${theme.palette.primary.main}33`,
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, lg: 1.5 },
            }}
          >
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              sx={{
                minWidth: { xs: 50, md: 60 },
                height: "32px",
                borderRadius: "20px",
                border: `1px solid ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
                px: { xs: 1, md: 2 },
                "&:hover": {
                  backgroundColor: `${theme.palette.primary.main}14`,
                  border: `1px solid ${theme.palette.primary.main}`,
                },
              }}
            >
              {t("auth.login")}
            </Button>

            <Button
              component={RouterLink}
              to="/traveler/signup"
              variant="contained"
              sx={{
                minWidth: { xs: 50, md: 60 },
                height: "32px",
                borderRadius: "20px",
                backgroundColor: theme.palette.primary.main,
                color: "white",
                px: { xs: 1, md: 2 },
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
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
                color: theme.palette.text.primary,
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
