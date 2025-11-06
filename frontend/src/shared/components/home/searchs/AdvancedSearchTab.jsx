import { Image, Mic, TextFields } from "@mui/icons-material";
import { Box, Chip } from "@mui/material";
import ImageSearch from "./ImageSearch";
import TextSearch from "./TextSearch";
import VoiceSearch from "./VoiceSearch";

const searchModes = [
  { label: "Text", icon: <TextFields />, mode: "text" },
  { label: "Voice", icon: <Mic />, mode: "voice" },
  { label: "Image", icon: <Image />, mode: "image" },
];

const AdvancedSearchTab = (props) => {
  return (
    <Box>
      <Box sx={{ display: "flex", gap: 3, mb: 3, justifyContent: "center" }}>
        {searchModes.map(({ label, icon, mode }) => (
          <Chip
            key={mode}
            label={label}
            icon={icon}
            onClick={() => props.setSearchMode(mode)}
            variant={props.searchMode === mode ? "filled" : "outlined"}
            color={props.searchMode === mode ? "primary" : "default"}
            sx={{ cursor: "pointer", fontSize: 17, p: 1.5 }}
          />
        ))}
      </Box>

      {props.searchMode === "text" && (
        <TextSearch searchText={props.searchText} setSearchText={props.setSearchText} />
      )}
      {props.searchMode === "voice" && <VoiceSearch {...props} />}
      {props.searchMode === "image" && (
        <ImageSearch imageFile={props.imageFile} setImageFile={props.setImageFile} />
      )}
    </Box>
  );
};

export default AdvancedSearchTab;
