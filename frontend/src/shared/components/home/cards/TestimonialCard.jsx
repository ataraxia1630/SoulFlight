import { Avatar, Paper, Rating, Typography } from "@mui/material";

const TestimonialCard = ({ name, rating, text, avatar }) => {
  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 2,
        textAlign: "center",
        bgcolor: "rgba(255,255,255,0.95)",
      }}
    >
      <Avatar src={avatar} alt={name} sx={{ width: 80, height: 80, mx: "auto", mb: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
        {name}
      </Typography>
      <Rating value={rating} readOnly sx={{ mb: 2 }} />
      <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
        {text}
      </Typography>
    </Paper>
  );
};

export default TestimonialCard;
