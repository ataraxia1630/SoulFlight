// import AssessmentIcon from "@mui/icons-material/Assessment";
import BarChartIcon from "@mui/icons-material/BarChart";
import CategoryIcon from "@mui/icons-material/Category";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ClassIcon from "@mui/icons-material/Class";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
// import DashboardIcon from "@mui/icons-material/Dashboard";
import HandymanIcon from "@mui/icons-material/Handyman";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ReportIcon from "@mui/icons-material/Report";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import TagIcon from "@mui/icons-material/Tag";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_COLLAPSED = 85;

const AdminSidebar = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const menuItems = [
    {
      text: t("sidebar.review_service"),
      icon: <RateReviewIcon />,
      path: "/admin/partner-registration",
    },
    {
      text: t("sidebar.facilities"),
      icon: <HandymanIcon />,
      path: "/admin/facilities",
    },
    {
      text: t("sidebar.service_type"),
      icon: <CategoryIcon />,
      path: "/admin/service_type",
    },
    {
      text: t("sidebar.tag"),
      icon: <TagIcon />,
      path: "/admin/tag",
    },
    {
      text: "Tổng quan dịch vụ",
      icon: <ClassIcon />,
      path: "/admin/service_overview",
    },
    {
      text: "Chi tiết dịch vụ",
      icon: <RoomServiceIcon />,
      path: "/admin/service",
    },
    {
      text: "Địa điểm du lịch",
      icon: <PlaceIcon />,
      path: "/admin/place",
    },
    {
      text: t("sidebar.voucher"),
      icon: <ConfirmationNumberIcon />,
      path: "/admin/voucher",
    },

    {
      text: "Quản lý booking",
      icon: <PaymentIcon />,
      path: "/admin/booking",
    },
    {
      text: t("sidebar.report"),
      icon: <BarChartIcon />,
      path: "/admin/statistic",
    },
    {
      text: "Tố cáo",
      icon: <ReportIcon />,
      path: "/admin/report",
    },
    {
      text: "Người dùng",
      icon: <PersonIcon />,
      path: "/admin/user",
    },
  ];

  return (
    <Box>
      <Drawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        open={open}
        onClose={onToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
          flexShrink: 0,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "& .MuiDrawer-paper": {
            width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
            bgcolor: "background.paper",
            boxSizing: "border-box",

            scrollbarWidth: "thin",
            scrollbarColor: "#e0e0e0 transparent",

            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#e0e0e0",
              borderRadius: "20px",
              border: "transparent",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#a0a0a0",
            },
          },
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: open ? "flex-end" : "center",
              px: open ? 2 : 0,
              minHeight: { xs: 64, lg: 72 },
            }}
          >
            <IconButton onClick={onToggle} sx={{ borderRadius: 30 }}>
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Box>

          <Divider />

          <List sx={{ px: 1.5, pt: 2, pb: 2 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={!open ? item.text : ""} placement="right" arrow>
                  <ListItemButton
                    onClick={() => {
                      navigate(item.path);
                      if (isSmallScreen) onToggle();
                    }}
                    selected={location.pathname === item.path}
                    sx={{
                      minHeight: 48,
                      borderRadius: 2,
                      justifyContent: open ? "initial" : "center",
                      px: open ? 2.5 : 0,
                      "&.Mui-selected": {
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        "& .MuiListItemIcon-root": {
                          color: "primary.contrastText",
                        },
                        "&:hover": { bgcolor: "primary.dark" },
                      },
                      "&:hover": {
                        bgcolor: location.pathname === item.path ? "primary.dark" : "action.hover",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 0,
                        color: "inherit",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{ variant: "body1" }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export const DRAWER_WIDTH_OPEN = DRAWER_WIDTH;
export const DRAWER_WIDTH_CLOSE = DRAWER_WIDTH_COLLAPSED;

export default AdminSidebar;
