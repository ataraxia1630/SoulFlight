import { Image, Mic, TextFields } from "@mui/icons-material";
import { Box, Chip } from "@mui/material";
import ImageSearch from "./ImageSearch";
import TextSearch from "./TextSearch";
import VoiceSearch from "./VoiceSearch";

const searchModes = [
  { label: "Text", icon: <TextFields />, mode: "text" },
  { label: "Voice", icon: <Mic />, mode: "audio" },
  { label: "Image", icon: <Image />, mode: "image" },
];

const AdvancedSearchTab = ({
  searchMode,
  setSearchMode,
  searchText,
  setSearchText,
  audioBlob,
  setAudioBlob,
  imageFile,
  setImageFile,
  isRecording,
  setIsRecording,
  recordingTime,
  setRecordingTime,
  mediaRecorderRef,
  streamRef,
  recordingTimerRef,
}) => {
  return (
    <Box>
      <Box sx={{ display: "flex", gap: 3, mb: 3, justifyContent: "center" }}>
        {searchModes.map(({ label, icon, mode }) => (
          <Chip
            key={mode}
            label={label}
            icon={icon}
            onClick={() => setSearchMode(mode)}
            variant={searchMode === mode ? "filled" : "outlined"}
            color={searchMode === mode ? "primary" : "default"}
            sx={{
              cursor: "pointer",
              fontSize: "17px",
              p: 1.5,
              "& .MuiChip-icon": {
                fontSize: "20px",
                ml: 0.5,
              },
              "&:hover": {
                bgcolor: searchMode === mode ? "primary.dark" : "action.hover",
              },
            }}
          />
        ))}
      </Box>

      {searchMode === "text" && (
        <TextSearch searchText={searchText} setSearchText={setSearchText} />
      )}

      {searchMode === "audio" && (
        <VoiceSearch
          audioBlob={audioBlob}
          setAudioBlob={setAudioBlob}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          recordingTime={recordingTime}
          setRecordingTime={setRecordingTime}
          mediaRecorderRef={mediaRecorderRef}
          streamRef={streamRef}
          recordingTimerRef={recordingTimerRef}
        />
      )}

      {searchMode === "image" && <ImageSearch imageFile={imageFile} setImageFile={setImageFile} />}
    </Box>
  );
};

export default AdvancedSearchTab;
