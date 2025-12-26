import { Box, Container, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchService from "@/shared/services/search.service";
import ErrorState from "../components/explore/ErrorState";
import ExploreHeader from "../components/explore/Header";
import Results from "../components/explore/Results";
import LoadingState from "../components/LoadingState";

export default function ExplorePage() {
  const theme = useTheme();
  const [searchParamsUrl] = useSearchParams();

  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterParams = {
    location: searchParamsUrl.get("location") || "",
    priceMin: searchParamsUrl.get("priceMin") || 0,
    priceMax: searchParamsUrl.get("priceMax") || "",
    guests: searchParamsUrl.get("guests") || "1",
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await SearchService.searchAll({
          keyword: " ",
        });
        console.log(res);
        const data = res.services || [];
        setServicesData(data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách dịch vụ. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

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
