import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const SectionHeader = ({ title, gradient = ["primary.main", "third.main"], align = "left" }) => {
  const theme = useTheme();

  return (
    <Box sx={{ textAlign: align, mb: 4 }}>
      <Typography
        variant="h3"
        sx={{
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          width: 125,
          height: 4,
          background: `linear-gradient(90deg, ${
            theme.palette[gradient[0].split(".")[0]][gradient[0].split(".")[1]]
          }, ${theme.palette[gradient[1].split(".")[0]][gradient[1].split(".")[1]]})`,
          borderRadius: 3,
          mt: 1.7,
          mx: align === "center" ? "auto" : 0,
        }}
      />
    </Box>
  );
};

export default SectionHeader;
