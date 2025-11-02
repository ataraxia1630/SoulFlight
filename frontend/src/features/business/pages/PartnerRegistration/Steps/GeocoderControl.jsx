import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { useControl } from "react-map-gl";

function GeocoderControl(props) {
  const geocoder = new MapboxGeocoder({
    accessToken: props.mapboxAccessToken,
    marker: false,
    ...props,
  });

  geocoder.on("result", (e) => {
    if (props.onResult) {
      props.onResult(e);
    }
  });

  useControl(() => geocoder);

  return null;
}

export default GeocoderControl;
