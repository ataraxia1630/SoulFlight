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
import SearchService from "@/shared/services/search.service";
import AdvancedSearchTab from "./searchs/AdvancedSearchTab";
import BasicSearchTab from "./searchs/BasicSearchTab";

const SearchDialog = ({ open, onClose, activeField = "location", initialSearchParams = {} }) => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    location: initialSearchParams.location || "",
    priceMin: initialSearchParams.checkIn || 0,
    priceMax: initialSearchParams.checkOut || "",
    guests: initialSearchParams.guests || 1,
  });

  const [searchText, setSearchText] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [searchMode, setSearchMode] = useState("text");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const recordingTimerRef = useRef(null);

  const handleSearch = async () => {
    setLoading(true);

    const payload = { mode: "text" };

    // Basic Search
    if (activeTab === 0) {
      if (searchParams.location) {
        payload.keyword = searchParams.location;
        payload.location = searchParams.location;
      }
      if (searchParams.priceMin) payload.priceMin = searchParams.priceMin;
      if (searchParams.priceMax) payload.priceMax = searchParams.priceMax;
      if (searchParams.guests) payload.guests = searchParams.guests;
    }

    // Advaced search
    if (activeTab === 1) {
      if (searchMode === "text" && searchText.trim()) {
        payload.keyword = searchText.trim();
        payload.mode = "text";
      } else if (searchMode === "voice" && audioBlob) {
        payload.mode = "voice";
        payload.file = audioBlob;
      } else if (searchMode === "image" && imageFile) {
        payload.mode = "image";
        payload.file = imageFile;
      }
      if (searchParams.location) payload.location = searchParams.location;
    }

    try {
      console.log(payload);
      const results = await SearchService.searchAll(payload);
      console.log(results);
      navigate("/explore", { state: { results, searchParams: payload } });
      handleClose();
    } catch (error) {
      console.error("Search failed:", error);
      alert("Search failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
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
          bgcolor: "primary.main",
          color: "text.contrast",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Search
        <IconButton size="medium" onClick={handleClose} sx={{ color: "inherit" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <Tabs
        value={activeTab}
        onChange={(_e, v) => setActiveTab(v)}
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
        <Tab label="Basic search" />
        <Tab label="Advanced search" />
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
        <Button
          onClick={handleSearch}
          variant="contained"
          disabled={loading}
          sx={{ color: "text.contrast" }}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchDialog;
