import { Mic, Stop } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";

const VoiceSearch = ({
  isRecording,
  setIsRecording,
  recordingTime,
  setRecordingTime,
  recordingTimerRef,
  searchText,
  setSearchText,
}) => {
  const theme = useTheme();

  // Khởi tạo Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const stopRecording = useCallback(() => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  }, [recognition, isRecording, setIsRecording, recordingTimerRef]);

  useEffect(() => {
    if (!recognition) return;

    recognition.lang = "vi-VN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setSearchText(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      stopRecording();
    };

    recognition.onend = () => {
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    };

    return () => {
      if (isRecording) recognition.stop();
    };
  }, [recognition, isRecording, setSearchText, setIsRecording, stopRecording, recordingTimerRef]);

  const startRecording = useCallback(async () => {
    if (!recognition) {
      alert("Don't support Speech Recognition");
      return;
    }

    try {
      setSearchText("");
      recognition.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch (err) {
      alert("Can't start record");
      console.error(err);
    }
  }, [recognition, setSearchText, setIsRecording, setRecordingTime, recordingTimerRef]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 7,
        minHeight: 250,
        bgcolor: "background.input",
        borderRadius: 2,
        textAlign: "center",
        border: "0.2px solid",
        borderColor: "border.light",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!isRecording && !searchText && (
        <Box>
          <Typography sx={{ mb: 2, fontSize: 14, color: "text.secondary" }}>
            Tap to start recording
          </Typography>
          <IconButton
            onClick={startRecording}
            sx={{
              bgcolor: "primary.main",
              color: "text.contrast",
              width: 80,
              height: 80,
              boxShadow: theme.shadows[3],
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "primary.main",
                boxShadow: theme.shadows[6],
              },
            }}
          >
            <Mic sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>
      )}

      {isRecording && (
        <Box>
          <Typography
            sx={{
              mb: 2,
              fontSize: 14,
              color: "error.main",
              fontWeight: 600,
            }}
          >
            Listening...
          </Typography>
          <Box sx={{ mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={((recordingTime % 60) * 100) / 60}
              sx={{ mb: 1 }}
            />
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: "primary.main" }}>
              {formatTime(recordingTime)}
            </Typography>
          </Box>
          {searchText && (
            <Typography
              sx={{
                mb: 2,
                fontSize: 14,
                color: "text.primary",
                fontStyle: "italic",
                maxWidth: 400,
              }}
            >
              "{searchText}"
            </Typography>
          )}
          <IconButton
            onClick={stopRecording}
            sx={{
              bgcolor: "error.main",
              color: "text.contrast",
              width: 80,
              height: 80,
              "&:hover": { bgcolor: "error.dark" },
            }}
          >
            <Stop sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>
      )}

      {searchText && !isRecording && (
        <Box>
          <Typography
            sx={{
              mb: 2,
              fontSize: 14,
              color: "success.main",
              fontWeight: 600,
            }}
          >
            Recording: ({formatTime(recordingTime)})
          </Typography>
          <Typography
            sx={{
              mb: 3,
              fontSize: 16,
              color: "text.primary",
              fontWeight: 500,
              maxWidth: 500,
            }}
          >
            "{searchText}"
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setSearchText("");
              setRecordingTime(0);
            }}
            sx={{
              px: 3,
              py: 1,
              color: "primary.main",
              backgroundColor: "transparent",
              border: "1px solid",
              borderColor: "primary.main",
              borderRadius: "25px",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            Re-record
          </Button>
        </Box>
      )}

      {!recognition && (
        <Typography sx={{ color: "error.main", fontSize: 14 }}>
          Don't support Speech-to-Text
        </Typography>
      )}
    </Paper>
  );
};

export default VoiceSearch;
