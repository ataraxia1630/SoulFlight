import AssessmentIcon from "@mui/icons-material/Assessment";
import BarChartIcon from "@mui/icons-material/BarChart";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaymentIcon from "@mui/icons-material/Payment";
import RateReviewIcon from "@mui/icons-material/RateReview";
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
const DRAWER_WIDTH_COLLAPSED = 72;

const AdminSidebar = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const menuItems = [
    {
      text: t("sidebar.dashboard"),
      icon: <DashboardIcon />,
      path: "/admin/dashboard",
    },
    {
      text: t("sidebar.review_service"),
      icon: <RateReviewIcon />,
      path: "admin/partner-registration",
    },
    {
      text: t("sidebar.service"),
      icon: <RoomServiceIcon />,
      path: "/admin/service",
    },
    {
      text: t("sidebar.voucher"),
      icon: <ConfirmationNumberIcon />,
      path: "/admin/voucher",
    },
    {
      text: t("sidebar.tag"),
      icon: <TagIcon />,
      path: "/admin/tag",
    },
    {
      text: t("sidebar.payment"),
      icon: <PaymentIcon />,
      path: "/admin/payment",
    },
    {
      text: t("sidebar.assessment"),
      icon: <AssessmentIcon />,
      path: "/admin/assessment",
    },
    {
      text: t("sidebar.report"),
      icon: <BarChartIcon />,
      path: "/admin/report",
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
