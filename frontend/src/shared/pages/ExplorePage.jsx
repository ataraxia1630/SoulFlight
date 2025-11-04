import { Box, Container, useTheme } from "@mui/material";
import { useState } from "react";
import ErrorState from "../components/ErrorState";
import ExploreHeader from "../components/explore/Header";
import Results from "../components/explore/Results";
import ExploreTabs from "../components/explore/Tabs";
import LoadingState from "../components/LoadingState";
import { mockExploreResults } from "./mockdata";

export default function ExplorePage() {
  const theme = useTheme();
  const [tab, setTab] = useState("all");
  const [results] = useState(mockExploreResults);
  const [loading] = useState(false);
  const [error] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const location = params.get("location") || "";
  const checkIn = params.get("checkIn") || "";
  const checkOut = params.get("checkOut") || "";
  const guests = params.get("guests") || "1";

  const filtered =
    !results || tab === "all" ? results : { [`${tab}s`]: results?.[`${tab}s`] || [] };

  const totalResults =
    results &&
    ["services", "rooms", "menus", "tickets", "tours"].reduce(
      (sum, key) => sum + (results[key]?.length || 0),
      0,
    );

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container>
        <ExploreHeader
          location={location}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          totalResults={totalResults}
          theme={theme}
        />

        <ExploreTabs value={tab} onChange={(_, v) => setTab(v)} />

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <Results filtered={filtered || {}} currentTab={tab} />
        )}
      </Container>
    </Box>
  );
}
