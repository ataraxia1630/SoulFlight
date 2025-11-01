import { Box, Typography } from "@mui/material";

const CategoryCard = ({ name, image }) => {
  return (
    <Box
      sx={{
        width: 193,
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: 260,
          borderRadius: "15px",
          overflow: "hidden",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover img": {
            transform: "scale(1.1)",
            filter: "brightness(0.75)",
          },
        }}
      >
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "all 0.5s ease",
          }}
        />
        <Box
          className="overlay"
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        />
      </Box>
      <Typography
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "14.5px",
          letterSpacing: "1.5px",
          color: "text.tertiary",
          mt: 1.7,
          textTransform: "uppercase",
        }}
      >
        {name}
      </Typography>
    </Box>
  );
};

export default CategoryCard;
