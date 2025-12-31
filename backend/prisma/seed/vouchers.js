const { upsertMany } = require("./utils/upsertMany");

const vouchers = [
  // Global vouchers
  {
    service_id: null,
    title: "Chào Mừng Đến Việt Nam",
    code: "WELCOME2025",
    discount_percent: 10,
    description: "Chiết khấu lần đầu đặt cho tất cả dịch vụ",
    valid_from: new Date("2025-01-01"),
    valid_to: new Date("2025-12-31"),
    is_global: true,
  },
  {
    service_id: null,
    title: "Ưu Đãi Xuân Sớm",
    code: "EARLYBIRD",
    discount_percent: 15,
    description: "Đặt 30 ngày trước và tiết kiệm 15%",
    valid_from: new Date("2025-01-01"),
    valid_to: new Date("2025-12-31"),
    is_global: true,
  },
  {
    service_id: null,
    title: "Mùa Lễ Hội",
    code: "HOLIDAY2025",
    discount_percent: 20,
    description: "Chiết khấu đặc biệt cho đặt ngày lễ",
    valid_from: new Date("2025-12-01"),
    valid_to: new Date("2025-12-31"),
    is_global: true,
  },

  // Sunrise Hotels vouchers
  {
    service_id: 1,
    title: "Ưu Đãi Khai Trương",
    code: "GRAND10",
    discount_percent: 10,
    description: "Chiết khấu đặc biệt cho Khách Sạn Sunrise Grand",
    valid_from: new Date("2025-01-01"),
    valid_to: new Date("2025-06-30"),
    is_global: false,
  },
  {
    service_id: 2,
    title: "Hè Resort Bãi Biển",
    code: "BEACH25",
    discount_percent: 25,
    description: "Ưu đãi mùa hè tại Resort Bãi Biển",
    valid_from: new Date("2025-06-01"),
    valid_to: new Date("2025-08-31"),
    is_global: false,
  },
  {
    service_id: 3,
    title: "Lưu Trú Di Sản",
    code: "HERITAGE15",
    discount_percent: 15,
    description: "Trải nghiệm hiếp khách Việt Nam truyền thống",
    valid_from: new Date("2025-01-01"),
    valid_to: new Date("2025-12-31"),
    is_global: false,
  },

  // Pho Corner vouchers
  {
    service_id: 6,
    title: "Ưu Đãi Bữa Trưa",
    code: "PHOLUNCH",
    discount_percent: 10,
    description: "Chiết khấu cho lượt ghé vào buổi trưa",
    valid_from: new Date("2025-01-01"),
    valid_to: new Date("2025-12-31"),
    is_global: false,
  },
  {
    service_id: 8,
    title: "Ăn Uống Sân Thượng",
    code: "ROOFTOP20",
    discount_percent: 20,
    description: "Ẩm thực tinh tế với view đẹp",
    valid_from: new Date("2025-01-01"),
    valid_to: new Date("2025-12-31"),
    is_global: false,
  },

  // Tour vouchers
  {
    service_id: 1,
    title: "Nhà Thám Hiểm Mekong",
    code: "MEKONG15",
    discount_percent: 15,
    description: "Khám phá vẻ đẹp Đồng Bằng Sông Cửu Long",
    valid_from: new Date("2025-01-01"),
    valid_to: new Date("2025-12-31"),
    is_global: false,
  },
  {
    service_id: 2,
    title: "Lãng Mạn Hoàng Hôn",
    code: "SUNSET10",
    discount_percent: 10,
    description: "Chiết khấu du thuyền lãng mạn",
    valid_from: new Date("2025-02-01"),
    valid_to: new Date("2025-02-28"),
    is_global: false,
  },
  {
    service_id: 4,
    title: "Phiêu Lưu Núi",
    code: "MOUNTAIN12",
    discount_percent: 12,
    description: "Chiết khấu hành trình tâm linh",
    valid_from: new Date("2025-01-01"),
    valid_to: new Date("2025-12-31"),
    is_global: false,
  },
  {
    service_id: 5,
    title: "Yêu Thiên Nhiên",
    code: "NATURE18",
    discount_percent: 18,
    description: "Ưu đãi đặc biệt du lịch sinh thái",
    valid_from: new Date("2025-01-01"),
    valid_to: new Date("2025-12-31"),
    is_global: false,
  },
];

async function seedVouchers(prisma) {
  console.log("Seeding vouchers...");
  await upsertMany(prisma, prisma.voucher, vouchers, ["code"]);
  console.log(`Seeded ${vouchers.length} vouchers`);
}

module.exports = { seedVouchers };
