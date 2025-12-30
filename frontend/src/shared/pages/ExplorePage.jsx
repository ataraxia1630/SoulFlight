import { Box, Container, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import SearchService from "@/shared/services/search.service";
import ErrorState from "../components/explore/ErrorState";
import ExploreHeader from "../components/explore/Header";
import Results from "../components/explore/Results";
import LoadingState from "../components/LoadingState";

export default function ExplorePage() {
  const theme = useTheme();
  const { state } = useLocation();
  const [searchParamsUrl] = useSearchParams();

  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterParams = {
    location: searchParamsUrl.get("location") || state?.searchParams?.location || "",
    priceMin: searchParamsUrl.get("priceMin") || state?.searchParams?.priceMin || 0,
    priceMax: searchParamsUrl.get("priceMax") || state?.searchParams?.priceMax || "",
    guests: searchParamsUrl.get("guests") || state?.searchParams?.guests || "1",
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        if (state?.results?.services) {
          // console.log("Using results from navigation state");
          setServicesData(state.results.services);
          setLoading(false);
          return;
        }

        // console.log("Fetching fresh data...");
        const payload = {
          keyword: searchParamsUrl.get("keyword") || "",
          location: filterParams.location,
          priceMin: filterParams.priceMin,
          priceMax: filterParams.priceMax,
          guests: filterParams.guests,
          mode: "text",
        };

        const res = await SearchService.searchAll(payload);
        const data = res.services || res || [];
        setServicesData(data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách dịch vụ. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [
    state,
    searchParamsUrl,
    filterParams.location,
    filterParams.priceMin,
    filterParams.priceMax,
    filterParams.guests,
  ]);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container>
        <ExploreHeader
          location={filterParams.location}
          priceMin={filterParams.priceMin}
          priceMax={filterParams.priceMax}
          guests={filterParams.guests}
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
