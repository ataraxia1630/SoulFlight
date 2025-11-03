import PlaceIcon from "@mui/icons-material/Place";
import { Box, CircularProgress, Grid, Stack, Typography, useTheme } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import MapGL, { GeolocateControl, Marker, NavigationControl } from "react-map-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import TextInput from "@/shared/components/input/TextInput";
import GeocoderControl from "./GeocoderControl";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const defaultCenter = {
  latitude: 10.7769,
  longitude: 106.7009,
};

export default function ServiceInfoStep() {
  const theme = useTheme();
  const { setValue, watch } = useFormContext();

  const location = watch("location");
  const formattedAddress = watch("formattedAddress") || "";
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  const [viewState, setViewState] = useState({
    ...defaultCenter,
    zoom: 12,
  });

  useEffect(() => {
    setViewState((prev) => ({
      ...prev,
      latitude: location.lat,
      longitude: location.lng,
    }));
  }, [location.lat, location.lng]);

  const reverseGeocode = useCallback(
    async (lat, lng) => {
      if (!MAPBOX_TOKEN) return;

      setIsReverseGeocoding(true);
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=address&language=vi`,
        );
        const data = await response.json();
        const addr =
          data.features[0]?.place_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
        setValue("formattedAddress", addr, { shouldValidate: true });
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        setValue("formattedAddress", `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
      } finally {
        setIsReverseGeocoding(false);
      }
    },
    [setValue],
  );

  const onMarkerDragEnd = useCallback(
    (e) => {
      const lat = e.lngLat.lat;
      const lng = e.lngLat.lng;
      setValue("location", { lat, lng }, { shouldValidate: true });
      setValue("formattedAddress", "");
      reverseGeocode(lat, lng);
      setViewState({ ...viewState, latitude: lat, longitude: lng, zoom: 15 });
    },
    [setValue, reverseGeocode, viewState],
  );

  const handleGeocoderResult = useCallback(
    (e) => {
      const [lng, lat] = e.result.geometry.coordinates;
      setValue("location", { lat, lng }, { shouldValidate: true });
      setValue("formattedAddress", e.result.place_name, {
        shouldValidate: true,
      });
      setViewState({ latitude: lat, longitude: lng, zoom: 15 });
    },
    [setValue],
  );

  const displayAddress = useMemo(() => {
    if (isReverseGeocoding) return <>Đang lấy địa chỉ...</>;
    return formattedAddress || `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`;
  }, [formattedAddress, location, isReverseGeocoding]);

  return (
    <Box
      width="100%"
      bgcolor="white"
      borderRadius={3}
      boxShadow="0 1px 3px rgba(0,0,0,0.1)"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "30px 100px 60px 100px",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: theme.palette.text.dark,
          fontWeight: 600,
          textAlign: "center",
          mb: 4,
        }}
      >
        Complete your basic service information
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack spacing={2} height="100%">
            <TextInput name="serviceName" label="Tên dịch vụ" placeholder="VD: Quán phở 24h" />

            <TextInput
              name="description"
              label="Mô tả"
              placeholder="Phở bò truyền thống, nước dùng ngọt thanh..."
              multiline
              rows={5}
            />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1.5,
              gap: 1,
              p: 1.5,
              bgcolor: "background.paper",
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
              minHeight: 56,
            }}
          >
            <PlaceIcon color="primary" />
            <Typography variant="body1" sx={{ flex: 1 }}>
              {displayAddress}
            </Typography>
            {isReverseGeocoding && <CircularProgress size={16} />}
          </Box>

          <Box
            sx={{
              height: 400,
              width: "100%",
              position: "relative",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: 3,
            }}
          >
            <MapGL
              {...viewState}
              onMove={(evt) => setViewState(evt.viewState)}
              mapboxAccessToken={MAPBOX_TOKEN}
              mapStyle="mapbox://styles/mapbox/streets-v12"
            >
              <Marker
                latitude={location.lat}
                longitude={location.lng}
                draggable
                onDragEnd={onMarkerDragEnd}
                anchor="bottom"
              >
                <PlaceIcon
                  sx={{
                    fontSize: 40,
                    color: theme.palette.primary.main,
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                    animation: "pulse 2s infinite",
                  }}
                />
              </Marker>

              <GeocoderControl
                mapboxAccessToken={MAPBOX_TOKEN}
                onResult={handleGeocoderResult}
                position="top-left"
                placeholder="Tìm kiếm địa chỉ..."
              />

              <NavigationControl position="top-right" />
              <GeolocateControl position="top-right" />
            </MapGL>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Kéo biểu tượng để điều chỉnh chính xác vị trí
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
