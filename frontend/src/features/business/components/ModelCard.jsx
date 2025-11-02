import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PRIMARY_COLOR = "#1E9BCD";
const GREEN_CHECK_COLOR = "#15B136";

export default function ModelCard({ config }) {
  const {
    name,
    icon,
    color = PRIMARY_COLOR,
    list,
    buttonText = "Provide this",
    expanded = false,
    to = "",
  } = config;

  const [isExpanded, setIsExpanded] = useState(expanded);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    navigate(`${location.pathname}/${to}`);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "45px",
        padding: { xs: "16px", md: "20px" },
        display: "flex",
        flexDirection: "column",
        width: "460px",
        minWidth: "300px",
        boxSizing: "border-box",
        pb: 0,
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={handleToggle}
        aria-expanded={isExpanded}
        aria-controls={`model-card-content-${name}`}
      >
        <Avatar
          sx={{
            backgroundColor: color,
            color: "white",
            width: "40px",
            height: "40px",
            mr: 2,
          }}
        >
          {icon}
        </Avatar>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "600",
            fontSize: "24px",
          }}
        >
          {name}
        </Typography>
      </Box>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit id={`model-card-content-${name}`}>
        <Typography variant="body1" sx={{ pl: 2, pt: 2, fontWeight: "500" }}>
          Your business provide:
        </Typography>

        <List sx={{ pl: 2 }}>
          {list.map((item) => (
            <ListItem key={item} sx={{ paddingLeft: 0, alignItems: "flex-start" }}>
              <ListItemIcon
                sx={{
                  minWidth: "auto",
                  mr: 1.5,
                }}
              >
                <CheckCircleIcon sx={{ color: GREEN_CHECK_COLOR }} />
              </ListItemIcon>
              <ListItemText
                primary={item}
                sx={{
                  "& .MuiTypography-root": { fontSize: "14px" },
                  color: "text.secondary",
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            sx={{
              borderRadius: "40px",
              padding: "8px 20px",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: "bold",
            }}
            onClick={() => handleClick()}
          >
            {buttonText}
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
}
