const express = require('express');
const prisma = require('./src/configs/prisma');
const route = require('./src/routes/index');
const app = express();

// Middleware
app.use(express.json());

// Chạy server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

// Gắn các router
route(app);
