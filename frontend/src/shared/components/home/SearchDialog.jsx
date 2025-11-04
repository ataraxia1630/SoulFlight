import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
} from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdvancedSearchTab from "./searchs/AdvancedSearchTab";
import BasicSearchTab from "./searchs/BasicSearchTab";

const SearchDialog = ({ open, onClose, activeField = "location", initialSearchParams = {} }) => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    location: initialSearchParams.location || "",
    checkIn: initialSearchParams.checkIn || "",
    checkOut: initialSearchParams.checkOut || "",
    guests: initialSearchParams.guests || 1,
  });

  // Advanced search states
  const [searchText, setSearchText] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [searchMode, setSearchMode] = useState("text");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const recordingTimerRef = useRef(null);

  const handleSearch = () => {
    const params = new URLSearchParams({
      location: searchParams.location,
      checkIn: searchParams.checkIn || "",
      checkOut: searchParams.checkOut || "",
      guests: searchParams.guests.toString(),
    });

    if (searchText) params.append("q", searchText);
    if (audioBlob) params.append("audio", "recording");
    if (imageFile) params.append("image", imageFile.name);
    params.append("searchMode", searchMode);

    navigate(`/explore?${params.toString()}`);
    handleClose();
  };

  const handleClose = () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
    setSearchText("");
    setAudioBlob(null);
    setImageFile(null);
    setSearchMode("text");
    setRecordingTime(0);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: "background.default",
        },
      }}
    >
      <DialogTitle
        variant="h4"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "primary.main",
          color: "text.contrast",
        }}
      >
        Search
        <IconButton size="medium" onClick={handleClose} sx={{ color: "inherit" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <Tabs
        value={activeTab}
        onChange={(_e, newValue) => setActiveTab(newValue)}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          px: 2,
          "& .MuiTabs-flexContainer": {
            display: "flex",
            justifyContent: "space-between",
          },
          "& .MuiTab-root": {
            flex: 1,
            textAlign: "center",
            fontWeight: 600,
            fontSize: "16px",
            textTransform: "none",
            color: "text.secondary",
          },
          "& .Mui-selected": {
            color: "primary.main",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "primary.main",
            height: 3,
            borderRadius: 2,
          },
        }}
      >
        <Tab label="Basic Search" />
        <Tab label="Advanced Search" />
      </Tabs>

      <DialogContent sx={{ pt: 3 }}>
        {activeTab === 0 && (
          <BasicSearchTab
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            activeField={activeField}
          />
        )}

        {activeTab === 1 && (
          <AdvancedSearchTab
            searchMode={searchMode}
            setSearchMode={setSearchMode}
            searchText={searchText}
            setSearchText={setSearchText}
            audioBlob={audioBlob}
            setAudioBlob={setAudioBlob}
            imageFile={imageFile}
            setImageFile={setImageFile}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            recordingTime={recordingTime}
            setRecordingTime={setRecordingTime}
            mediaRecorderRef={mediaRecorderRef}
            streamRef={streamRef}
            recordingTimerRef={recordingTimerRef}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSearch} variant="contained" sx={{ color: "text.contrast" }}>
          Search
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchDialog;
