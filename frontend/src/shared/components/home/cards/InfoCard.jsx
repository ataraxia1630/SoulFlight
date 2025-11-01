import { ChevronRight } from "@mui/icons-material";
import { Box, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const InfoCard = ({ title, description, onClick, actionText = "See details" }) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        border: "1px solid",
        borderColor: theme.palette.border.light,
        p: 2,
        borderRadius: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ pt: 2 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "15px",
            mb: 1,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "13px",
            lineHeight: 1.7,
          }}
        >
          {description}
        </Typography>
      </Box>

      {onClick && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            mt: 2,
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateX(4px)",
            },
          }}
          onClick={onClick}
        >
          <Typography
            sx={{
              color: theme.palette.primary.main,
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {actionText}
          </Typography>
          <ChevronRight sx={{ fontSize: 20, color: theme.palette.primary.main }} />
        </Box>
      )}
    </Paper>
  );
};

export default InfoCard;
