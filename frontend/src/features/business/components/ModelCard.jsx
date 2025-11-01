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
        padding: { xs: "20px", md: "28px" },
        display: "flex",
        flexDirection: "column",
        width: "580px",
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
            width: "52px",
            height: "52px",
            mr: 2,
          }}
        >
          {icon}
        </Avatar>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "600",
            fontSize: "32px",
          }}
        >
          {name}
        </Typography>
      </Box>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit id={`model-card-content-${name}`}>
        <Typography variant="body1" sx={{ mb: 1, pl: 2, pt: 2, fontWeight: "500" }}>
          Your business provide:
        </Typography>

        <List sx={{ pl: 2, mb: 2 }}>
          {list.map((item) => (
            <ListItem key={item} sx={{ paddingLeft: 0, alignItems: "flex-start" }}>
              <ListItemIcon
                sx={{
                  minWidth: "auto",
                  mr: 1.5,
                  mt: "4px",
                }}
              >
                <CheckCircleIcon sx={{ color: GREEN_CHECK_COLOR }} />
              </ListItemIcon>
              <ListItemText
                primary={item}
                sx={{
                  "& .MuiTypography-root": { fontSize: "1rem" },
                  color: "text.secondary",
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ mb: 3, mt: 1 }} />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            sx={{
              borderRadius: "50px",
              padding: "10px 30px",
              textTransform: "none",
              fontSize: "1rem",
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
