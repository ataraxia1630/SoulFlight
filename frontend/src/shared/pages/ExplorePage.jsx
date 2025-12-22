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

  const results = state?.results || mockExploreResults;
  const searchParams = state?.searchParams || {};

  const servicesData = results?.services || [];

  const [loading] = useState(false);
  const [error] = useState(null);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container>
        <ExploreHeader
          location={searchParams.location || ""}
          priceMin={searchParams.priceMin || 0}
          priceMax={searchParams.priceMax || ""}
          guests={searchParams.guests || "1"}
          totalResults={servicesData.length}
          theme={theme}
        />

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <Results services={servicesData} />
        )}
      </Container>
    </Box>
  );
}
