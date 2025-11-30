import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/app/store";
import AuthService from "@/shared/services/auth.service";

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
        <Avatar
          src={user?.avatar || user?.logo}
          alt={user?.name || user?.email}
          sx={{ width: 48, height: 48 }}
        >
          {user?.avatar || user?.logo ? null : (user?.name?.[0] || user?.email?.[0])?.toUpperCase()}
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
        <Avatar
          src={user?.avatar || user?.logo}
          alt={user?.name || user?.email}
          sx={{ width: 48, height: 48 }}
        >
          {user?.avatar || user?.logo ? null : (user?.name?.[0] || user?.email?.[0])?.toUpperCase()}
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

export { DrawerUserSection, UserMenu };
