const { upsertMany } = require("./utils/upsertMany");

const vouchers = [
  // Global vouchers
  {
    id: 1,
    service_id: null,
    title: "Welcome to Vietnam",
    code: "WELCOME2025",
    discount_percent: 10,
    description: "First-time booking discount for all services",
    valid_from: new Date("2025-01-01"),
    valid_to: new Date("2025-12-31"),
    is_global: true,
  },
  {
    id: 2,
    service_id: null,
    title: "Early Bird Special",
    code: "EARLYBIRD",
    discount_percent: 15,
    description: "Book 30 days in advance and save 15%",
    valid_from: new Date("2025-01-01"),
    valid_to: new Date("2025-12-31"),
    is_global: true,
  },
  {
    id: 3,
    service_id: null,
    title: "Holiday Season",
    code: "HOLIDAY2025",
    discount_percent: 20,
    description: "Special discount for holiday bookings",
    valid_from: new Date("2025-12-01"),
    valid_to: new Date("2025-12-31"),
    is_global: true,
  },

  // Sunrise Hotels vouchers
  {
    id: 4,
    service_id: 1,
    title: "Grand Opening Offer",
    code: "GRAND10",
    discount_percent: 10,
    description: "Special discount for Sunrise Grand Hotel",
    valid_from: new Date("2025-01-01"),
    valid_to: new Date("2025-06-30"),
    is_global: false,
  },
  {
    id: 5,
    service_id: 2,
    title: "Beach Resort Summer",
    code: "BEACH25",
    discount_percent: 25,
    description: "Summer special at Beach Resort",
    valid_from: new Date("2025-06-01"),
    valid_to: new Date("2025-08-31"),
    is_global: false,
  },
  {
    id: 6,
    service_id: 3,
    title: "Heritage Stay",
    code: "HERITAGE15",
    discount_percent: 15,
    description: "Experience traditional Vietnamese hospitality",
    valid_from: new Date("2025-01-01"),
    valid_to: new Date("2025-12-31"),
    is_global: false,
  },

  // Pho Corner vouchers
  {
    id: 7,
    service_id: 6,
    title: "Lunch Special",
    code: "PHOLUNCH",
    discount_percent: 10,
    description: "Discount for lunch time visits",
    valid_from: new Date("2025-01-01"),
    valid_to: new Date("2025-12-31"),
    is_global: false,
  },
  {
    id: 8,
    service_id: 8,
    title: "Rooftop Dining",
    code: "ROOFTOP20",
    discount_percent: 20,
    description: "Fine dining with a view",
    valid_from: new Date("2025-01-01"),
    valid_to: new Date("2025-12-31"),
    is_global: false,
  },

  // Tour vouchers
  {
    id: 9,
    service_id: 11,
    title: "Mekong Explorer",
    code: "MEKONG15",
    discount_percent: 15,
    description: "Discover the beauty of Mekong Delta",
    valid_from: new Date("2025-01-01"),
    valid_to: new Date("2025-12-31"),
    is_global: false,
  },
  {
    id: 10,
    service_id: 12,
    title: "Sunset Romance",
    code: "SUNSET10",
    discount_percent: 10,
    description: "Romantic cruise discount",
    valid_from: new Date("2025-02-01"),
    valid_to: new Date("2025-02-28"),
    is_global: false,
  },
  {
    id: 11,
    service_id: 14,
    title: "Mountain Adventure",
    code: "MOUNTAIN12",
    discount_percent: 12,
    description: "Spiritual journey discount",
    valid_from: new Date("2025-01-01"),
    valid_to: new Date("2025-12-31"),
    is_global: false,
  },
  {
    id: 12,
    service_id: 15,
    title: "Nature Lover",
    code: "NATURE18",
    discount_percent: 18,
    description: "Eco-tourism special offer",
    valid_from: new Date("2025-01-01"),
    valid_to: new Date("2025-12-31"),
    is_global: false,
  },
];

async function seedVouchers(prisma) {
  console.log("Seeding vouchers...");

  await upsertMany(prisma, prisma.voucher, vouchers, ["id"]);
  console.log(`Seeded ${vouchers.length} vouchers`);
}

module.exports = { seedVouchers };
