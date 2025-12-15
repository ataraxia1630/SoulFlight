import { AutoAwesome, Flight, Map as MapIcon, Restaurant } from "@mui/icons-material";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const TIPS = [
  "AI đang phân tích điểm đến của bạn...",
  "Đang tìm kiếm các địa điểm thú vị...",
  "Đang lựa chọn nhà hàng ngon nhất...",
  "Đang tối ưu lịch trình theo ngân sách...",
  "Đang thêm những gợi ý từ local...",
  "Sắp xong rồi, chờ tí nhé! ✨",
];

export default function LoadingScreen({ destination }) {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % TIPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: 8,
      }}
    >
      <Stack spacing={4} alignItems="center">
        <Box sx={{ position: "relative", width: 120, height: 120 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <CircularProgress size={120} thickness={2} />
          </motion.div>

          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <AutoAwesome sx={{ fontSize: 48, color: "primary.main" }} />
            </motion.div>
          </Box>
        </Box>

        <Stack spacing={2} alignItems="center">
          <Typography variant="h5" fontWeight={700}>
            Đang tạo lịch trình cho {destination}
          </Typography>

          <motion.div
            key={currentTip}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="body1" color="text.secondary">
              {TIPS[currentTip]}
            </Typography>
          </motion.div>
        </Stack>

        <Stack direction="row" spacing={3}>
          {[
            { icon: Flight, delay: 0 },
            { icon: MapIcon, delay: 0.2 },
            { icon: Restaurant, delay: 0.4 },
          ].map(({ icon: Icon, delay }, _idx) => (
            <motion.div
              key={Icon.displayName || Icon.name}
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut",
              }}
            >
              <Icon sx={{ fontSize: 36, color: "text.secondary", opacity: 0.6 }} />
            </motion.div>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
