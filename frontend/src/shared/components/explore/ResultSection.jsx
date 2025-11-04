import { Box, Chip, Pagination, Typography } from "@mui/material";
import React from "react";
import CarouselDots from "../CarouselDots";

const ResultSection = ({ title, count, children, currentTab }) => {
  const childrenArray = Array.isArray(children) ? children : [children];

  const itemsPerPage = currentTab === "all" ? 4 : 10;

  const [currentPage, setCurrentPage] = React.useState(0);

  const totalPages = Math.ceil(childrenArray.length / itemsPerPage);
  const startIdx = currentPage * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const visibleItems = childrenArray.slice(startIdx, endIdx);

  const handleDotClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handlePaginationChange = (_event, page) => {
    setCurrentPage(page - 1);
  };

  return (
    <Box sx={{ mb: 5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700 }}>{title}</Typography>
        <Chip
          label={count}
          size="small"
          color="primary"
          sx={{ fontWeight: 600, height: 28, fontSize: 13 }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            justifyContent: "space-between",
            gap: 3,
            width: "100%",
          }}
        >
          {visibleItems.map((child, i) => (
            <Box key={child.id || `${startIdx}-${i}`}>{child}</Box>
          ))}
        </Box>

        {totalPages > 1 && (
          <>
            currentTab·===·"all"·?·(
            <CarouselDots
              totalDots={totalPages}
              currentIndex={currentPage}
              onDotClick={handleDotClick}
              categories={childrenArray}
            />
            ) : (
            <Pagination
              count={totalPages}
              page={currentPage + 1}
              onChange={handlePaginationChange}
              color="primary"
              size="large"
            />
            )
          </>
        )}
      </Box>
    </Box>
  );
};

export default ResultSection;
