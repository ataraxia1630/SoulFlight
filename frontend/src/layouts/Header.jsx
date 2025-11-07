import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/app/store";
import AuthService from "@/shared/services/auth.service";

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

const UserMenu = ({ user, t }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await AuthService.logout();
    handleClose();
  };

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };

  const handleSettings = () => {
    navigate("/settings");
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          p: 0,
          border: `2px solid ${theme.palette.divider}`,
          "&:hover": {
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        <Avatar src={user?.avatar} alt={user?.name || user?.email} sx={{ width: 40, height: 40 }}>
          {!user?.avatar && (user?.name?.[0] || user?.email?.[0])?.toUpperCase()}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: theme.shadows[3],
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {user?.name || "User"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>

        <Divider />

        <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("header.profile")}</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleSettings} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("header.settings")}</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: "error.main" }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>{t("auth.logout")}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const DrawerUserSection = ({ user, toggleDrawer, t }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    toggleDrawer();
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
    toggleDrawer();
  };

  const handleSettings = () => {
    navigate("/settings");
    toggleDrawer();
  };

  return (
    <Box sx={{ px: 3, mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          bgcolor: theme.palette.action.hover,
          borderRadius: 2,
          mb: 2,
        }}
      >
        <Avatar src={user?.avatar} alt={user?.name || user?.email} sx={{ width: 48, height: 48 }}>
          {!user?.avatar && (user?.name?.[0] || user?.email?.[0])?.toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={600} noWrap>
            {user?.name || "User"}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {user?.email}
          </Typography>
        </Box>
      </Box>

      <List disablePadding>
        <ListItemButton onClick={handleProfile} sx={{ borderRadius: 1, mb: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary={t("header.profile")} />
        </ListItemButton>

        <ListItemButton onClick={handleSettings} sx={{ borderRadius: 1, mb: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={t("header.settings")} />
        </ListItemButton>

        <Divider sx={{ my: 1 }} />

        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1, color: "error.main" }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutIcon color="error" />
          </ListItemIcon>
          <ListItemText primary={t("auth.logout")} />
        </ListItemButton>
      </List>
    </Box>
  );
};

const Header = ({ drawerWidth = 0, onToggleSidebar, showMenuIcon = false }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navItems = ["home", "explore", "trips", "news", "contact"];
  const user = useAuthStore((state) => state.user);

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
                letterSpacing: "0.3px",
                background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.third.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              SOULFLIGHT
            </Typography>
          </Box>

          {user?.role === "TRAVELER" && <DesktopNav navItems={navItems} t={t} theme={theme} />}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {user ? (
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <UserMenu user={user} t={t} />
              </Box>
            ) : (
              <AuthButtons t={t} />
            )}

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

        {user?.role === "TRAVELER" && (
          <DrawerNav navItems={navItems} toggleDrawer={toggleDrawer} t={t} />
        )}

        {user ? (
          <DrawerUserSection user={user} toggleDrawer={toggleDrawer} t={t} />
        ) : (
          <AuthButtons isDrawer toggleDrawer={toggleDrawer} t={t} />
        )}
      </Drawer>
    </>
  );
};

export default Header;
