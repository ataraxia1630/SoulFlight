import { Box, Chip, Pagination, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const ResultSection = ({ title, count, children }) => {
  const childrenArray = Array.isArray(children) ? children : [children];

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(childrenArray.length / itemsPerPage);
  const startIdx = currentPage * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const visibleItems = childrenArray.slice(startIdx, endIdx);

  const handlePaginationChange = (_event, page) => {
    setCurrentPage(page - 1);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: trigger scroll on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

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
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 3,
            width: "100%",
          }}
        >
          {visibleItems.map((child, i) => (
            <Box key={child.key || `${startIdx}-${i}`}>{child}</Box>
          ))}
        </Box>

        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={currentPage + 1}
            onChange={handlePaginationChange}
            color="primary"
            size="large"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        )}
      </Box>
    </Box>
  );
};

export default ResultSection;
