const { upsertMany } = require("./utils/upsertMany");

const tickets = [
  // Hành Trình Tâm Linh Núi Sam (service_id: 17)
  {
    service_id: 17,
    name: "Cáp Treo Núi Sam - Người Lớn",
    description: "Vé cáp treo khứ hồi cho người lớn",
    price: 150000,
    place_id: 1,
  },
  {
    service_id: 17,
    name: "Cáp Treo Núi Sam - Trẻ Em",
    description: "Vé cáp treo khứ hồi cho trẻ em (dưới 12 tuổi)",
    price: 80000,
    place_id: 1,
  },
  {
    service_id: 17,
    name: "Tour Tham Quan Chùa Chiền",
    description: "Tour được hướng dẫn thăm chùa chiền với thông tin văn hóa",
    price: 120000,
    place_id: 6,
  },
  {
    service_id: 17,
    name: "Combo Các Địa Điểm Lịch Sử",
    description: "Vé vào Mộ Thoại Ngộc Hầu và bảo tàng",
    price: 80000,
    place_id: 5,
  },

  // Eco Tour Rừng Tràm Trà Sư (service_id: 18)
  {
    service_id: 18,
    name: "Vé Vào Rừng Trà Sư - Người Lớn",
    description: "Vé vào kèm du thuyền cho người lớn",
    price: 150000,
    place_id: 2,
  },
  {
    service_id: 18,
    name: "Vé Vào Rừng Trà Sư - Trẻ Em",
    description: "Vé vào kèm du thuyền cho trẻ em",
    price: 80000,
    place_id: 2,
  },
  {
    service_id: 18,
    name: "Tour Quan Sát Chim",
    description: "Tour quan sát chim được hướng dẫn với ống nhòm",
    price: 200000,
    place_id: 2,
  },
  {
    service_id: 18,
    name: "Gói Nhiếp Ảnh",
    description: "Tour du thuyền kéo dài cho những người yêu thích chụp ảnh",
    price: 250000,
    place_id: 2,
  },
  {
    service_id: 18,
    name: "Tour Hoàng Hôn Đặc Biệt",
    description: "Tour sáng sớm để bắt bình minh",
    price: 180000,
    place_id: 2,
  },
  {
    service_id: 18,
    name: "Eco Tour với Bữa Trưa",
    description: "Trải nghiệm đầy đủ bao gồm bữa trưa địa phương",
    price: 300000,
    place_id: 2,
  },
  {
    service_id: 19,
    name: "Vé Du Thuyền Hạ Long - Người Lớn",
    description: "Vé du thuyền khám phá vịnh Hạ Long cho người lớn",
    price: 350000,
    place_id: 18,
  },
  {
    service_id: 19,
    name: "Vé Du Thuyền Hạ Long - Trẻ Em",
    description: "Vé du thuyền cho trẻ em",
    price: 180000,
    place_id: 18,
  },
  {
    service_id: 19,
    name: "Gói Du Thuyền Sang Trọng Hạ Long",
    description: "Gói du thuyền cao cấp với các tiện nghi sang trọng",
    price: 500000,
    place_id: 18,
  },
  {
    service_id: 20,
    name: "Vé Phố Cổ Hội An",
    description: "Vé vào phố cổ Hội An - Di sản UNESCO",
    price: 120000,
    place_id: 20,
  },
  {
    service_id: 21,
    name: "Tour Trekking Sapa - Cơ Bản",
    description: "Tour trekking núi Sapa cơ bản cho người mới bắt đầu",
    price: 200000,
    place_id: 22,
  },
  {
    service_id: 21,
    name: "Tour Trekking Sapa - Nâng Cao",
    description: "Tour trekking Sapa nâng cao cho những người có kinh nghiệm",
    price: 350000,
    place_id: 22,
  },
];

async function seedTickets(prisma) {
  console.log("Seeding tickets...");
  await upsertMany(prisma, prisma.ticket, tickets, ["service_id", "name"]);
  console.log(`Seeded ${tickets.length} tickets`);
}

module.exports = { seedTickets };
