import { Card, CardContent, Typography, useTheme } from "@mui/material";

export default function InfoCard({ title, content, highlightColor }) {
  const theme = useTheme();
  const color = highlightColor || theme.palette.primary.main;

  return (
    <Card
      sx={{
        borderRadius: "16px",
        border: "0.1px solid #E5E7EB",
        borderLeft: `4px solid ${color}`,
        boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
        minWidth: "150px",
        width: "220px",
        height: "102px",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
        },
        display: "flex",
        flexDirection: "center",
        alignItems: "center",
        color: "white",
        flexGrow: 1,
      }}
    >
      <CardContent
        sx={{
          padding: "20px 24px",
        }}
      >
        <Typography variant="body1" color="text.secondary" fontSize={12} gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" fontWeight="700" color="text.primary">
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
}
