const express = require("express");
const cors = require("cors");

require("./src/configs/prisma");
require("./src/configs/redis");
require("./src/configs/gemini");

const route = require("./src/routes/index");
const { startBookingCleanupCron, stopBookingCleanupCron } = require("./src/schedules");

const app = express();

// Cấu hình CORS
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["http://localhost:5173"];
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".ngrok-free.dev")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Middleware
app.use(express.json());

startBookingCleanupCron();

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\nNhận tín hiệu ${signal}. Đang dừng server và cron job...`);
  stopBookingCleanupCron();
  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Chạy server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

// Gắn các router
route(app);
