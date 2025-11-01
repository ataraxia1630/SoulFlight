import { Box } from "@mui/material";

const CarouselDots = ({ totalDots, currentIndex, onDotClick, categories }) => {
  return (
    <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
      {Array.from({ length: totalDots }).map((_, index) => {
        const groupStart = index * 3;
        const keyId = categories[groupStart]?.id || `dot-${index}`;

        return (
          <Box
            key={`dot-${keyId}`}
            onClick={() => onDotClick(index)}
            sx={(theme) => ({
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor:
                currentIndex === index ? theme.palette.primary.darkest : theme.palette.border.main,
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor:
                  currentIndex === index
                    ? theme.palette.primary.darkest
                    : theme.palette.primary.darker,
              },
            })}
          />
        );
      })}
    </Box>
  );
};

export default CarouselDots;
