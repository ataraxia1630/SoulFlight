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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchService from "@/shared/services/search.service";
import toast from "@/shared/utils/toast";
import AdvancedSearchTab from "./searchs/AdvancedSearchTab";
import BasicSearchTab from "./searchs/BasicSearchTab";

const SearchDialog = ({ open, onClose, activeField = "location", initialSearchParams = {} }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const defaultSearchParams = {
    location: "",
    priceMin: "",
    priceMax: "",
    guests: 1,
    priceMinDisplay: "",
    priceMaxDisplay: "",
  };

  const [searchParams, setSearchParams] = useState({
    ...defaultSearchParams,
    ...initialSearchParams,
  });

  const [searchMode, setSearchMode] = useState("text");
  const [searchText, setSearchText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    const payload = {};

    if (activeTab === 0) {
      payload.mode = "text";
      payload.keyword = "";
      payload.location = searchParams.location;
      payload.priceMin = searchParams.priceMin;
      payload.priceMax = searchParams.priceMax;
      payload.guests = searchParams.guests;
    } else {
      if (searchMode === "image") {
        payload.mode = "image";
        payload.file = imageFile;
        if (searchParams.location) payload.location = searchParams.location;
      } else {
        payload.mode = searchMode === "voice" ? "voice" : "text";
        payload.keyword = searchText.trim();
        if (searchParams.location) payload.location = searchParams.location;
      }
    }

    try {
      // console.log("Sending search payload:", payload);
      const results = await SearchService.searchAll(payload);
      // console.log("Search results received:", results);

      navigate("/explore", { state: { results, searchParams: payload } });
      handleClose();
    } catch {
      toast.error("Đã có lỗi xảy ra khi tìm kiếm.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event, newValue) => {
    setActiveTab(newValue);

    setImageFile(null);
    setSearchText("");
    setIsRecording(false);
    setSearchMode("text");

    setSearchParams(defaultSearchParams);
  };

  const handleClose = () => {
    setIsRecording(false);
    setImageFile(null);
    setSearchText("");
    setSearchMode("text");

    setSearchParams(defaultSearchParams);
    setActiveTab(0);

    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
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
        onChange={handleTabChange}
        centered
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          px: 2,
          "& .MuiTabs-flexContainer": {
            display: "center",
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
        <Tab label="Tìm kiếm cơ bản" />
        <Tab label="Tìm kiếm nâng cao" />
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
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            imageFile={imageFile}
            setImageFile={setImageFile}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSearch} disabled={loading}>
          {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchDialog;
