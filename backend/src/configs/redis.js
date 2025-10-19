const { createClient } = require("redis");

const redis = createClient({
  username: "default",
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redis.on("error", (err) => console.log("Redis Client Error", err));

async function connectRedis() {
  try {
    await redis.connect();
    console.log("✅ Đã kết nối redis thành công!");
  } catch (error) {
    console.error("❌ Kết nối redis thất bại:", error.message);
  }
}

connectRedis();

module.exports = redis;
