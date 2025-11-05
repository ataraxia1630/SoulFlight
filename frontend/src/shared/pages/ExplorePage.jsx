import { Box, Container, useTheme } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import ErrorState from "../components/explore/ErrorState";
import ExploreHeader from "../components/explore/Header";
import LoadingState from "../components/explore/LoadingState";
import Results from "../components/explore/Results";
import ExploreTabs from "../components/explore/Tabs";
import { mockExploreResults } from "./mockdata";

export default function ExplorePage() {
  const theme = useTheme();
  const { state } = useLocation();
  const results = state?.results || mockExploreResults;
  const searchParams = state?.searchParams || {};

  const [tab, setTab] = useState("all");
  const [loading] = useState(false);
  const [error] = useState(null);

  const filtered = tab === "all" ? results : { [`${tab}s`]: results?.[`${tab}s`] || [] };

  const totalResults = ["services", "rooms", "menus", "tickets", "tours"].reduce(
    (sum, key) => sum + (results[key]?.length || 0),
    0,
  );

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container>
        <ExploreHeader
          location={searchParams.location || ""}
          priceMin={searchParams.priceMin || 0}
          priceMax={searchParams.priceMax || ""}
          guests={searchParams.guests || "1"}
          totalResults={totalResults}
          theme={theme}
        />

        <ExploreTabs value={tab} onChange={(_, v) => setTab(v)} />

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <Results filtered={filtered} currentTab={tab} />
        )}
      </Container>
    </Box>
  );
}
