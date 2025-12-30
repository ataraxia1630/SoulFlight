const prisma = require("../middleware");
const { seedTourTagsV2 } = require("./tour.tags.v2");
const { seedLeisureTags } = require("./ticket.tour");

async function run() {
  try {
    console.log("🚀 Đang chạy seed riêng cho Tour và Leisure...");

    await seedTourTagsV2(prisma);

    await seedLeisureTags(prisma);

    console.log("✅ Hoàn thành!");
  } catch (error) {
    console.error("❌ Lỗi khi chạy seed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
