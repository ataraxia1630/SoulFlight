import { Box, Container, useTheme } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import ErrorState from "../components/explore/ErrorState";
import ExploreHeader from "../components/explore/Header";
import Results from "../components/explore/Results";
import LoadingState from "../components/LoadingState";
import { mockExploreResults } from "./mockdata";

export default function ExplorePage() {
  const theme = useTheme();
  const { state } = useLocation();

  // Lấy data từ state hoặc mock, fallback về rỗng nếu không có
  const results = state?.results || mockExploreResults;
  const searchParams = state?.searchParams || {};

  // Chỉ lấy danh sách services
  const servicesData = results?.services || [];

  const [loading] = useState(false);
  const [error] = useState(null);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container>
        {/* Header giữ nguyên để hiển thị bộ lọc */}
        <ExploreHeader
          location={searchParams.location || ""}
          priceMin={searchParams.priceMin || 0}
          priceMax={searchParams.priceMax || ""}
          guests={searchParams.guests || "1"}
          totalResults={servicesData.length} // Chỉ đếm services
          theme={theme}
        />

        {/* Bỏ ExploreTabs */}

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          /* Truyền thẳng list services vào Results */
          <Results services={servicesData} />
        )}
      </Container>
    </Box>
  );
}
