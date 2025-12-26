import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BookIcon from "@mui/icons-material/Book";
import CardTravelIcon from "@mui/icons-material/CardTravel";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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
import { useId } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/app/store";

const LEFT_SIDEBAR_WIDTH = 280;
const HEADER_HEIGHT = 72;

const LeftSidebar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const gradientId = useId();

  const menuItems = [
    {
      text: "Nhật ký hành trình",
      path: "/travel-diary",
      icon: <BookIcon />,
      subtitle: "Lưu giữ kỷ niệm",
    },
    {
      text: "Lịch trình của tôi",
      path: "/itineraries",
      icon: <CardTravelIcon />,
    },
    {
      text: "AI Travel Planner",
      path: "/travel-planner",
      icon: <AutoAwesomeIcon />,
      isSpecial: true,
    },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        top: HEADER_HEIGHT,
        width: LEFT_SIDEBAR_WIDTH,
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
      }}
    >
      <Box sx={{ pr: 3.7, pt: 2 }}>
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

          const geminiGradient = "linear-gradient(90deg, #4285F4 0%, #9B72CB 50%, #D96570 100%)";

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 3,
                  minHeight: 56,
                  transition: "all 0.3s ease",
                  ...(item.isSpecial && {
                    mx: 0.5,
                    border: "1px solid",
                    borderColor: alpha("#9B72CB", 0.2),
                    background: alpha("#f0f4f9", 0.5),
                    "&:hover": {
                      background: alpha("#f0f4f9", 0.8),
                      transform: "scale(1.02)",
                      boxShadow: "0 4px 12px rgba(155, 114, 203, 0.15)",
                    },
                  }),
                  "&.Mui-selected": {
                    bgcolor: item.isSpecial
                      ? alpha("#9B72CB", 0.1)
                      : alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    ...(item.isSpecial
                      ? {
                          "& svg": {
                            fill: `url(#${gradientId})`,
                            filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))",
                          },
                        }
                      : {
                          color: isActive ? "primary.main" : "text.secondary",
                        }),
                  }}
                >
                  {item.isSpecial && (
                    <svg
                      width="0"
                      height="0"
                      style={{ position: "absolute" }}
                      aria-hidden="true"
                      focusable="false"
                    >
                      <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop stopColor="#4285F4" offset="0%" />
                        <stop stopColor="#9B72CB" offset="50%" />
                        <stop stopColor="#DB4437" offset="100%" />
                      </linearGradient>
                    </svg>
                  )}
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  secondary={item.subtitle}
                  primaryTypographyProps={{
                    fontWeight: isActive || item.isSpecial ? 700 : 500,
                    fontSize: "14px",
                    sx: item.isSpecial
                      ? {
                          background: geminiGradient,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          display: "inline-block",
                        }
                      : {},
                  }}
                  secondaryTypographyProps={{
                    fontSize: "12px",
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
