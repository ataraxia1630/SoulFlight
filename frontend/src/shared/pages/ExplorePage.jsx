import { Box, Container, Tab, Tabs, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
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

  const urlKeyword = searchParamsUrl.get("keyword");
  const urlLocation = searchParamsUrl.get("location");
  const urlPriceMin = searchParamsUrl.get("priceMin");
  const urlPriceMax = searchParamsUrl.get("priceMax");
  const urlGuests = searchParamsUrl.get("guests");

  const hasUrlSearch = Boolean(
    urlKeyword || urlLocation || urlPriceMin || urlPriceMax || (urlGuests && urlGuests !== "1"),
  );

  const keyword = urlKeyword || state?.searchParams?.keyword || "";
  const location = urlLocation || state?.searchParams?.location || "";
  const priceMin = urlPriceMin || state?.searchParams?.priceMin || "";
  const priceMax = urlPriceMax || state?.searchParams?.priceMax || "";
  const guests = urlGuests || state?.searchParams?.guests || "1";

  const typeParam = searchParamsUrl.get("type") || "ALL";

  const [currentTab, setCurrentTab] = useState(typeParam);

  useEffect(() => {
    setCurrentTab(typeParam);
  }, [typeParam]);

  const handleTabChange = (_event, newValue) => {
    setCurrentTab(newValue);

    const newParams = {
      keyword,
      location,
      priceMin,
      priceMax,
      guests,
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

  const filteredServices = useMemo(() => {
    if (currentTab === "ALL") return servicesData;

    return servicesData.filter((service) => {
      let typeValue = "";
      if (service.type) {
        if (typeof service.type === "object") {
          typeValue = service.type.id || service.type.name || service.type.code;
        } else {
          typeValue = service.type;
        }
      }
      return typeValue?.toString().toUpperCase() === currentTab;
    });
  }, [servicesData, currentTab]);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        if (state?.results?.services && !hasUrlSearch) {
          setServicesData(state.results.services);
          setLoading(false);
          return;
        }

        const payload = {
          keyword,
          location,
          priceMin: priceMin ? Number(priceMin) : undefined,
          priceMax: priceMax ? Number(priceMax) : undefined,
          guests: Number(guests),
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
  }, [keyword, location, priceMin, priceMax, guests, state, hasUrlSearch]);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container>
        <ExploreHeader
          location={location}
          priceMin={priceMin}
          priceMax={priceMax}
          guests={guests}
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
