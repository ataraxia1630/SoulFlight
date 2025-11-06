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

const VoiceSearch = ({
  audioBlob,
  setAudioBlob,
  isRecording,
  setIsRecording,
  recordingTime,
  setRecordingTime,
  mediaRecorderRef,
  streamRef,
  recordingTimerRef,
}) => {
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((t) => {
          t.stop();
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch {
      alert("Can't access micro.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const theme = useTheme();

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
      {!isRecording && !audioBlob && (
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
            Recording...
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

      {audioBlob && !isRecording && (
        <Box>
          <Typography
            sx={{
              mb: 2,
              fontSize: 14,
              color: "success.main",
              fontWeight: 600,
            }}
          >
            Recording saved ({formatTime(recordingTime)})
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mt: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setAudioBlob(null);
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

            <audio
              src={URL.createObjectURL(audioBlob)}
              controls
              aria-label="Voice recording preview"
              style={{ maxWidth: 260, borderRadius: 8 }}
            >
              <track kind="captions" label="No captions available" />
            </audio>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default VoiceSearch;
