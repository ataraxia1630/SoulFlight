import { Mic, Stop } from "@mui/icons-material";
import { Box, IconButton, LinearProgress, Paper, Typography, useTheme } from "@mui/material";
import PrimaryButton from "../../PrimaryButton";

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
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (_error) {
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const theme = useTheme();

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 7,
          minHeight: "250px",
          bgcolor: "background.input",
          borderRadius: 2,
          textAlign: "center",
          border: 0.2,
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
              variant=""
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
              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "primary.main",
                }}
              >
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
                justifyContent: "center",
                gap: 2,
                flexWrap: "wrap",
                mt: 2,
              }}
            >
              <PrimaryButton
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
                    boxShadow: (theme) => theme.shadows[2],
                  },
                }}
              >
                Re-record
              </PrimaryButton>

              {audioBlob && (
                <Box
                  component="audio"
                  src={URL.createObjectURL(audioBlob)}
                  controls
                  sx={{
                    maxWidth: 260,
                    borderRadius: 2,
                  }}
                />
              )}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default VoiceSearch;
