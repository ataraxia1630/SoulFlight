const express = require('express');
const prisma = require('./src/configs/prisma');
const app = express();

// Middleware
app.use(express.json());

// Route cơ bản
app.get('/', (req, res) => {
  res.send('Hello ExpressJS 🚀');
});

// Chạy server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
