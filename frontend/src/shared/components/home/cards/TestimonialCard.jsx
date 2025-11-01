import { Avatar, Paper, Rating, Typography, useTheme } from "@mui/material";
import { useState } from "react";

const TestimonialCard = ({ name, rating, text, avatar }) => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();

  return (
    <Paper
      elevation={isHovered ? 12 : 4}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        p: 4,
        width: "570px",
        borderRadius: 3,
        textAlign: "center",
        background: isHovered
          ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.input} 100%)`
          : theme.palette.background.paper,
        border: `1px solid ${theme.palette.primary.main}1A`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.third.main})`,
          transform: isHovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.3s ease-out",
        },
      }}
    >
      <Avatar
        src={avatar}
        alt={name}
        sx={{
          width: 80,
          height: 80,
          mx: "auto",
          mb: 2.5,
          border: `4px solid ${theme.palette.primary.main}`,
          transition: "transform 0.3s ease",
          transform: isHovered ? "scale(1.08)" : "scale(1)",
        }}
      />

      <Typography variant="h4" sx={{ mb: 1 }}>
        {name}
      </Typography>

      <Rating
        value={rating}
        readOnly
        sx={{
          mb: 1.7,
          justifyContent: "center",
          fontSize: "20px",
        }}
      />

      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          lineHeight: 1.8,
        }}
      >
        {text}
      </Typography>
    </Paper>
  );
};

export default TestimonialCard;
