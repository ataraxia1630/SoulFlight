const { upsertMany } = require("./utils/upsertMany");

const serviceTypes = [
  {
    name: "stay",
    description: "Khách sạn, resort, homestay và các dịch vụ lưu trú khác",
  },
  {
    name: "fnb",
    description: "Nhà hàng, quán cà phê, quầy bar và các trải nghiệm ẩm thực",
  },
  {
    name: "tour",
    description: "Các tour du lịch có hướng dẫn, chuyến tham quan và hoạt động khám phá",
  },
  {
    name: "leisure",
    description: "Các hoạt động giải trí, thư giãn và nghỉ ngơi",
  },
];

async function seedServiceTypes(prisma) {
  console.log("Seeding service types...");
  await upsertMany(prisma, prisma.serviceType, serviceTypes, ["name"]);
  console.log(`Seeded ${serviceTypes.length} service types`);
}

module.exports = { seedServiceTypes };
