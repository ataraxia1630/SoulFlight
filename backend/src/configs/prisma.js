const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Đã kết nối database thành công!");
  } catch (error) {
    console.error("❌ Kết nối database thất bại:", error.message);
    process.exit(1);
  }
}

connectDB();

module.exports = prisma;
