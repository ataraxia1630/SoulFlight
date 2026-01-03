const { upsertMany } = require("./utils/upsertMany");

const getVoucherDate = (monthsFromNow) => {
  const date = new Date();
  date.setMonth(date.getMonth() + monthsFromNow);
  return date;
};

const vouchers = [
  // ========== GLOBAL VOUCHERS (service_id: null) ==========
  {
    service_id: null,
    title: "Chào Mừng Đến Việt Nam",
    code: "WELCOME2026",
    discount_percent: 10,
    description: "Chiết khấu lần đầu đặt cho tất cả dịch vụ",
    valid_from: new Date(),
    valid_to: getVoucherDate(12), // Còn hạn 1 năm
    is_global: true,
    max_uses: 10000,
  },
  {
    service_id: null,
    title: "Ưu Đãi Xuân Sớm",
    code: "EARLYBIRD2026",
    discount_percent: 15,
    description: "Đặt 30 ngày trước và tiết kiệm 15%",
    valid_from: new Date(),
    valid_to: getVoucherDate(6), // Còn hạn 6 tháng
    is_global: true,
    max_uses: 10000,
  },
  {
    service_id: null,
    title: "Khuyến Mãi Tết 2026",
    code: "TET2026",
    discount_percent: 20,
    description: "Chiết khấu đặc biệt dịp Tết Nguyên Đán",
    valid_from: new Date(),
    valid_to: getVoucherDate(3), // Còn hạn 3 tháng
    is_global: true,
    max_uses: 5000,
  },

  // ========== ACCOMMODATION VOUCHERS (Service 1-7) ==========
  // Service 1: Khách Sạn Sunrise Grand
  {
    service_id: 1,
    title: "Ưu Đãi Khách Sạn 5 Sao",
    code: "GRAND15",
    discount_percent: 15,
    description: "Chiết khấu đặc biệt cho Khách Sạn Sunrise Grand",
    valid_from: new Date(),
    valid_to: getVoucherDate(6),
    is_global: false,
    max_uses: 500,
  },

  // Service 2: Resort Bãi Biển Sunrise
  {
    service_id: 2,
    title: "Hè Resort Bãi Biển",
    code: "BEACH25",
    discount_percent: 25,
    description: "Ưu đãi nghỉ dưỡng tại Resort Bãi Biển",
    valid_from: new Date(),
    valid_to: getVoucherDate(8),
    is_global: false,
    max_uses: 300,
  },

  // Service 3: Khách Sạn Boutique Sunrise
  {
    service_id: 3,
    title: "Lưu Trú Di Sản",
    code: "HERITAGE15",
    discount_percent: 15,
    description: "Trải nghiệm khách sạn Việt Nam truyền thống",
    valid_from: new Date(),
    valid_to: getVoucherDate(12),
    is_global: false,
    max_uses: 400,
  },

  // Service 6: Resort Hạ Long
  {
    service_id: 6,
    title: "Ưu Đãi Hạ Long",
    code: "HALONG20",
    discount_percent: 20,
    description: "Khám phá vịnh Hạ Long với giá ưu đãi",
    valid_from: new Date(),
    valid_to: getVoucherDate(9),
    is_global: false,
    max_uses: 600,
  },

  // ========== DINING VOUCHERS (Service 8-14) ==========
  // Service 8: Phở Góc Trung Tâm
  {
    service_id: 8,
    title: "Ưu Đãi Phở Truyền Thống",
    code: "PHO10",
    discount_percent: 10,
    description: "Chiết khấu cho món phở ngon tại Phở Góc",
    valid_from: new Date(),
    valid_to: getVoucherDate(6),
    is_global: false,
    max_uses: 1000,
  },

  // Service 9: Nhà Hàng Phở Góc
  {
    service_id: 9,
    title: "Ưu Đãi Bữa Trưa",
    code: "LUNCH15",
    discount_percent: 15,
    description: "Chiết khấu cho bữa trưa tại Nhà Hàng Phở Góc",
    valid_from: new Date(),
    valid_to: getVoucherDate(4),
    is_global: false,
    max_uses: 800,
  },

  // Service 10: Phở Góc Sân Thượng
  {
    service_id: 10,
    title: "Ăn Uống Sân Thượng",
    code: "ROOFTOP20",
    discount_percent: 20,
    description: "Ẩm thực tinh tế với view đẹp trên rooftop",
    valid_from: new Date(),
    valid_to: getVoucherDate(5),
    is_global: false,
    max_uses: 500,
  },

  // Service 11: Quán Cà Phê Phở Góc
  {
    service_id: 11,
    title: "Giờ Cà Phê Vàng",
    code: "COFFEE12",
    discount_percent: 12,
    description: "Thưởng thức cà phê Việt Nam với giá ưu đãi",
    valid_from: new Date(),
    valid_to: getVoucherDate(6),
    is_global: false,
    max_uses: 1200,
  },

  // ========== TOUR VOUCHERS (Service 15-19) ==========
  // Service 15: Khám Phá Đồng Bằng Sông Cửu Long
  {
    service_id: 15,
    title: "Nhà Thám Hiểm Mekong",
    code: "MEKONG15",
    discount_percent: 15,
    description: "Khám phá vẻ đẹp Đồng Bằng Sông Cửu Long",
    valid_from: new Date(),
    valid_to: getVoucherDate(10),
    is_global: false,
    max_uses: 300,
  },

  // Service 16: Du Thuyền Hoàng Hôn
  {
    service_id: 16,
    title: "Lãng Mạn Hoàng Hôn",
    code: "SUNSET18",
    discount_percent: 18,
    description: "Chiết khấu du thuyền hoàng hôn lãng mạn",
    valid_from: new Date(),
    valid_to: getVoucherDate(8),
    is_global: false,
    max_uses: 200,
  },

  // Service 17: Tour Đạp Xe Qua Làng Quê
  {
    service_id: 17,
    title: "Khám Phá Làng Quê",
    code: "CYCLING10",
    discount_percent: 10,
    description: "Trải nghiệm cuộc sống nông thôn Việt Nam",
    valid_from: new Date(),
    valid_to: getVoucherDate(7),
    is_global: false,
    max_uses: 250,
  },

  // Service 18: Hành Trình Tâm Linh Núi Sam (Tour)
  {
    service_id: 18,
    title: "Phiêu Lưu Núi Sam",
    code: "NUSAM12",
    discount_percent: 12,
    description: "Chiết khấu hành trình tâm linh Núi Sam",
    valid_from: new Date(),
    valid_to: getVoucherDate(12),
    is_global: false,
    max_uses: 400,
  },

  // Service 19: Eco Tour Rừng Tràm Trà Sư
  {
    service_id: 19,
    title: "Yêu Thiên Nhiên",
    code: "TRASU20",
    discount_percent: 20,
    description: "Ưu đãi đặc biệt du lịch sinh thái Trà Sư",
    valid_from: new Date(),
    valid_to: getVoucherDate(9),
    is_global: false,
    max_uses: 350,
  },

  // ========== TICKET/LEISURE VOUCHERS (Service 20-24) ==========
  // Service 20: Khu Du Lịch Núi Sam (Vé)
  {
    service_id: 20,
    title: "Vé Núi Sam Tiết Kiệm",
    code: "NUSAMVIP15",
    discount_percent: 15,
    description: "Chiết khấu vé cáp treo và tham quan Núi Sam",
    valid_from: new Date(),
    valid_to: getVoucherDate(11),
    is_global: false,
    max_uses: 500,
  },

  // Service 21: Khu Bảo Tồn Rừng Tràm Trà Sư (Vé)
  {
    service_id: 21,
    title: "Vé Eco Tour Ưu Đãi",
    code: "TRASUVOUCHER",
    discount_percent: 18,
    description: "Chiết khấu đặc biệt cho vé vào rừng Trà Sư",
    valid_from: new Date(),
    valid_to: getVoucherDate(10),
    is_global: false,
    max_uses: 600,
  },

  // Service 22: Tour Hạ Long Bay (Vé Tàu/Tham Quan)
  {
    service_id: 22,
    title: "Vịnh Hạ Long Giảm Giá",
    code: "HALONGBAY25",
    discount_percent: 25,
    description: "Ưu đãi lớn cho du thuyền vịnh Hạ Long",
    valid_from: new Date(),
    valid_to: getVoucherDate(6),
    is_global: false,
    max_uses: 400,
  },

  // Service 23: Khám Phá Phố Cổ Hội An (Vé)
  {
    service_id: 23,
    title: "Phố Cổ Hội An",
    code: "HOIAN10",
    discount_percent: 10,
    description: "Khám phá di sản UNESCO Hội An",
    valid_from: new Date(),
    valid_to: getVoucherDate(12),
    is_global: false,
    max_uses: 700,
  },

  // Service 24: Trekking Sapa (Vé/Dịch vụ)
  {
    service_id: 24,
    title: "Trekking Sapa Ưu Đãi",
    code: "SAPA20",
    discount_percent: 20,
    description: "Chiết khấu tour trekking Sapa",
    valid_from: new Date(),
    valid_to: getVoucherDate(8),
    is_global: false,
    max_uses: 450,
  },
];

async function seedVouchers(prisma) {
  console.log("Seeding vouchers with correct service mapping...");
  await upsertMany(prisma, prisma.voucher, vouchers, ["code"]);
  console.log(`✅ Seeded ${vouchers.length} vouchers`);
}

module.exports = { seedVouchers };
