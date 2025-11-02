import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

// import Logo from "@/assets/logo";

const NavButton = ({ item, onClick, theme, t }) => (
  <Button
    component={RouterLink}
    to={item === "home" ? "/" : `/${item}`}
    onClick={onClick}
    sx={{
      color: theme.palette.text.primary,
      fontWeight: 500,
      textTransform: "capitalize",
      "&:hover": { backgroundColor: theme.palette.action.hover },
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
    }}
  >
    {t(`header.${item}`)}
  </Button>
);

const AuthButton = ({ to, label, variant, sx, onClick, t }) => (
  <Button
    component={RouterLink}
    to={to}
    variant={variant}
    onClick={onClick}
    sx={{
      height: 40,
      borderRadius: "8px",
      flexShrink: 0,
      ...sx,
    }}
  >
    {t(label)}
  </Button>
);

const DesktopNav = ({ navItems, t, theme }) => (
  <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 2 }}>
    {navItems.map((item) => (
      <NavButton key={item} item={item} theme={theme} t={t} />
    ))}
  </Box>
);

const DrawerNav = ({ navItems, toggleDrawer, t }) => (
  <List>
    {navItems.map((item) => (
      <ListItem key={item} disablePadding>
        <ListItemButton
          component={RouterLink}
          to={item === "home" ? "/" : `/${item}`}
          onClick={toggleDrawer}
          sx={{ py: 1.5, px: 3 }}
        >
          <Typography textTransform="capitalize" fontWeight={500}>
            {t(`header.${item}`)}
          </Typography>
        </ListItemButton>
      </ListItem>
    ))}
  </List>
);

const AuthButtons = ({ isDrawer = false, toggleDrawer, t }) => (
  <Box
    sx={{
      display: isDrawer ? "flex" : { xs: "none", sm: "flex" },
      flexDirection: isDrawer ? "column" : "row",
      gap: 1.5,
      ...(isDrawer && { px: 3, mt: 2 }),
    }}
  >
    <AuthButton
      to="/login"
      label="auth.login"
      variant="outlined"
      t={t}
      sx={{ border: "1.5px solid" }}
      onClick={isDrawer ? toggleDrawer : undefined}
    />
    <AuthButton
      to="/traveler/signup"
      label="auth.signup"
      variant="contained"
      t={t}
      sx={{ boxShadow: "none", "&:hover": { boxShadow: "none" } }}
      onClick={isDrawer ? toggleDrawer : undefined}
    />
  </Box>
);

const Header = ({ drawerWidth = 0, onToggleSidebar, showMenuIcon = false }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navItems = ["home", "explore", "trips", "news", "contact"];

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <>
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          width: { lg: `calc(100% - ${drawerWidth}px)`, xs: "100%" },
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            gap: 2,
            minHeight: { xs: 64, lg: 72 },
            px: { xs: 1.5, sm: 3, lg: 4 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {showMenuIcon && (
              <IconButton
                onClick={onToggleSidebar}
                sx={{
                  display: { xs: "flex", lg: "none" },
                  mr: 1.5,
                  borderRadius: "30px",
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            )}

            {/* <Logo /> */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                letterSpacing: "0.1px",
                background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.third.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              SOULFLIGHT
            </Typography>
          </Box>

          <DesktopNav navItems={navItems} t={t} theme={theme} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <AuthButtons t={t} toggleDrawer={toggleDrawer} />

            <Select
              value={i18n.language}
              onChange={handleLanguageChange}
              IconComponent={KeyboardArrowDownIcon}
              sx={{
                height: 40,
                flexShrink: 0,
                borderRadius: "8px",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderWidth: "1px",
                },
              }}
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="vi">VI</MenuItem>
            </Select>

            <IconButton onClick={toggleDrawer} sx={{ display: { lg: "none" } }}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": { width: 280, pt: 2 },
        }}
      >
        <Box
          sx={{
            px: 2,
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h3">Menu</Typography>
          <IconButton onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DrawerNav navItems={navItems} toggleDrawer={toggleDrawer} t={t} />
        <AuthButtons isDrawer toggleDrawer={toggleDrawer} t={t} />
      </Drawer>
    </>
  );
};

export default Header;
