import BookIcon from "@mui/icons-material/Book";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RecommendIcon from "@mui/icons-material/Recommend";
import {
  Avatar,
  alpha,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/app/store";

const LeftSidebar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const menuItems = [
    {
      text: "Nhật ký hành trình",
      path: "/travel-diary",
      icon: <BookIcon />,
      subtitle: "Lưu giữ kỷ niệm",
    },
    {
      text: "Gợi ý cho bạn",
      path: "/suggestions",
      icon: <RecommendIcon />,
    },
  ];

  return (
    <Box
      sx={{
        width: 280,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ pr: 3.7 }}>
        <Box
          onClick={() => navigate("/profile")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 1.5,
            borderRadius: 2,
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              bgcolor: "action.hover",
              transform: "translateY(-1px)",
              boxShadow: theme.shadows[1],
            },
          }}
        >
          <Avatar
            src={user?.avatar || user?.logo}
            alt={user?.name}
            sx={{
              width: 48,
              height: 48,
              border: `2px solid ${theme.palette.background.paper}`,
              boxShadow: theme.shadows[1],
            }}
          >
            {user?.avatar ? null : (user?.name?.[0] || "U").toUpperCase()}
          </Avatar>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ lineHeight: 1.2 }}>
              {user?.name || "Người dùng"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              Xem trang cá nhân <ChevronRightIcon sx={{ fontSize: 14, ml: 0.5 }} />
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ m: 1.5, mr: 5 }} />

      <List sx={{ pr: 3.7, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 3,
                  minHeight: 56,
                  transition: "all 0.2s",
                  "&.Mui-selected": {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                    },
                    "& .MuiListItemIcon-root": {
                      color: "primary.main",
                    },
                  },
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? "primary.main" : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  secondary={item.subtitle}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "14px",
                  }}
                  secondaryTypographyProps={{
                    fontSize: "14px",
                    sx: { mt: 0.5 },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default LeftSidebar;
