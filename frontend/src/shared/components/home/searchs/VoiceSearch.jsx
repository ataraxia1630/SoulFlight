import { Mic, Stop } from "@mui/icons-material";
import { Box, IconButton, LinearProgress, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import toast from "@/shared/utils/toast";

const VoiceSearch = ({ searchText, setSearchText, isRecording, setIsRecording }) => {
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "vi-VN";

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setSearchText(transcript);
      };

      recognition.onerror = (e) => {
        console.error("Voice error:", e.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [setSearchText, setIsRecording]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return toast.error("Trình duyệt không hỗ trợ");

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setSearchText("");
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch {
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current.start();
          setIsRecording(true);
        }, 100);
      }
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        minHeight: 280,
        bgcolor: "background.input",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "0.2px solid",
        borderColor: "divider",
      }}
    >
      {!isRecording && !searchText ? (
        <>
          <Typography color="text.secondary" mb={2}>
            Nhấn để nói
          </Typography>
          <IconButton
            onClick={toggleRecording}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              width: 70,
              height: 70,
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            <Mic fontSize="large" />
          </IconButton>
        </>
      ) : (
        <>
          <Typography color="primary" fontWeight="bold" mb={1}>
            {isRecording ? "Đang nghe..." : "Kết quả:"}
          </Typography>
          {isRecording && <LinearProgress sx={{ width: "100%", maxWidth: 200, mb: 2 }} />}
          <Typography variant="h6" sx={{ fontStyle: "italic", mb: 3 }}>
            "{searchText}"
          </Typography>
          <IconButton
            onClick={toggleRecording}
            sx={{
              bgcolor: isRecording ? "error.main" : "primary.main",
              color: "white",
              width: 60,
              height: 60,
              "&:hover": {
                bgcolor: isRecording ? "error.main" : "primary.main",
              },
            }}
          >
            {isRecording ? <Stop /> : <Mic />}
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default VoiceSearch;
