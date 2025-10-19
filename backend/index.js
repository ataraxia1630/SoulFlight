const express = require("express");
const cors = require("cors");

require("./src/configs/prisma");
require("./src/configs/redis");

const route = require("./src/routes/index");
const app = express();

// Cấu hình CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Middleware
app.use(express.json());

// Chạy server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

// Gắn các router
route(app);
console.log("new test");
