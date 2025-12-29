const cron = require("node-cron");
const prisma = require("../configs/prisma");

let cleanupTask = null;

const startBookingCleanupCron = () => {
  if (cleanupTask) {
    console.log("Booking cleanup cron đã được khởi động trước đó");
    return;
  }

  cleanupTask = cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();
      const result = await prisma.booking.deleteMany({
        where: {
          status: "PENDING",
          expiry_time: {
            lt: now,
          },
        },
      });

      if (result.count > 0) {
        console.log(`[Cron] Đã xóa ${result.count} booking hết hạn (PENDING)`);
      }
    } catch (error) {
      console.error("[Cron Error] Lỗi khi dọn dẹp booking hết hạn:", error);
    }
  });

  cleanupTask.start();
  console.log(`Booking cleanup cron đã khởi động – chạy mỗi 5 phút`);
};

const stopBookingCleanupCron = () => {
  if (cleanupTask) {
    cleanupTask.stop();
    cleanupTask = null;
    console.log("Booking cleanup cron đã được dừng");
  }
};

module.exports = {
  startBookingCleanupCron,
  stopBookingCleanupCron,
};
