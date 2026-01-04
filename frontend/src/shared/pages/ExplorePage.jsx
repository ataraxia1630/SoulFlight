import { Box, Container, Tab, Tabs, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import SearchService from "@/shared/services/search.service";
import ErrorState from "../components/explore/ErrorState";
import ExploreHeader from "../components/explore/Header";
import Results from "../components/explore/Results";
import LoadingState from "../components/LoadingState";

const SERVICE_TYPES = [
  { label: "Tất cả", value: "ALL" },
  { label: "Tour du lịch", value: "TOUR" },
  { label: "Vé tham quan", value: "LEISURE" },
  { label: "Lưu trú", value: "STAY" },
  { label: "Ẩm thực", value: "FNB" },
];

export default function ExplorePage() {
  const theme = useTheme();
  const { state } = useLocation();
  const [searchParamsUrl, setSearchParamsUrl] = useSearchParams();

  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterParams = {
    keyword: searchParamsUrl.get("keyword") || state?.searchParams?.keyword || "",
    location: searchParamsUrl.get("location") || state?.searchParams?.location || "",
    priceMin: searchParamsUrl.get("priceMin") || state?.searchParams?.priceMin || "",
    priceMax: searchParamsUrl.get("priceMax") || state?.searchParams?.priceMax || "",
    guests: searchParamsUrl.get("guests") || state?.searchParams?.guests || "1",
    type: searchParamsUrl.get("type") || "ALL",
  };

  const searchParamsString = searchParamsUrl.toString();

  const [currentTab, setCurrentTab] = useState(filterParams.type);

  useEffect(() => {
    setCurrentTab(searchParamsUrl.get("type") || "ALL");
  }, [searchParamsUrl]);

  const handleTabChange = (_event, newValue) => {
    setCurrentTab(newValue);
    const newParams = {
      keyword: filterParams.keyword,
      location: filterParams.location,
      priceMin: filterParams.priceMin,
      priceMax: filterParams.priceMax,
      guests: filterParams.guests,
      type: newValue,
    };

    if (newValue === "ALL") delete newParams.type;

    Object.keys(newParams).forEach((key) => {
      if (!newParams[key] || newParams[key] === "0") {
        delete newParams[key];
      }
    });

    setSearchParamsUrl(newParams, { replace: true });
  };

  const filteredServices = servicesData.filter((service) => {
    if (currentTab === "ALL") return true;
    let typeValue = "";
    if (service.type) {
      if (typeof service.type === "object") {
        typeValue = service.type.id || service.type.name;
      } else {
        typeValue = service.type;
      }
    }
    return typeValue?.toString().toUpperCase() === currentTab;
  });

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        if (state?.results?.services && filterParams.type === "ALL" && !searchParamsString) {
          setServicesData(state.results.services);
          setLoading(false);
          return;
        }

        const payload = {
          keyword: filterParams.keyword,
          location: filterParams.location,
          priceMin: filterParams.priceMin ? Number(filterParams.priceMin) : undefined,
          priceMax: filterParams.priceMax ? Number(filterParams.priceMax) : undefined,
          guests: Number(filterParams.guests),
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
    searchParamsString,
    filterParams.keyword,
    filterParams.location,
    filterParams.priceMin,
    filterParams.priceMax,
    filterParams.guests,
    filterParams.type,
  ]);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container>
        <ExploreHeader
          location={filterParams.location}
          priceMin={filterParams.priceMin}
          priceMax={filterParams.priceMax}
          guests={filterParams.guests}
          totalResults={filteredServices.length}
          theme={theme}
        />

        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mb: 3,
            mt: 2,
          }}
        >
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            textColor="primary"
            indicatorColor="primary"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: 16,
                fontWeight: 500,
                minHeight: 48,
              },
              "& .Mui-selected": {
                fontWeight: 700,
              },
            }}
          >
            {SERVICE_TYPES.map((type) => (
              <Tab key={type.value} label={type.label} value={type.value} />
            ))}
          </Tabs>
        </Box>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <Results services={filteredServices} />
        )}
      </Container>
    </Box>
  );
}
