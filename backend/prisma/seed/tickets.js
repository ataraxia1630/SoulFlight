const tickets = [
  // === Núi Sam ===
  {
    service_name: "Khu Du Lịch Núi Sam (Vé)",
    place_name: "Núi Sam",
    name: "Cáp Treo Núi Sam - Người Lớn",
    description: "Vé cáp treo khứ hồi cho người lớn",
    price: 150000,
  },
  {
    service_name: "Khu Du Lịch Núi Sam (Vé)",
    place_name: "Núi Sam",
    name: "Cáp Treo Núi Sam - Trẻ Em",
    description: "Vé cáp treo khứ hồi cho trẻ em",
    price: 80000,
  },
  {
    service_name: "Khu Du Lịch Núi Sam (Vé)",
    place_name: "Chùa Bà Chúa Xứ",
    name: "Tour Tham Quan Chùa Chiền",
    description: "Tour được hướng dẫn thăm chùa chiền",
    price: 120000,
  },
  {
    service_name: "Khu Du Lịch Núi Sam (Vé)",
    place_name: "Mộ Thoại Ngọc Hầu",
    name: "Combo Các Địa Điểm Lịch Sử",
    description: "Vé vào Mộ Thoại Ngộc Hầu và bảo tàng",
    price: 80000,
  },

  // === Trà Sư ===
  {
    service_name: "Khu Bảo Tồn Rừng Tràm Trà Sư (Vé)",
    place_name: "Rừng Tràm Trà Sư",
    name: "Vé Vào Rừng Trà Sư - Người Lớn",
    description: "Vé vào kèm du thuyền cho người lớn",
    price: 150000,
  },
  {
    service_name: "Khu Bảo Tồn Rừng Tràm Trà Sư (Vé)",
    place_name: "Rừng Tràm Trà Sư",
    name: "Vé Vào Rừng Trà Sư - Trẻ Em",
    description: "Vé vào kèm du thuyền cho trẻ em",
    price: 80000,
  },
  {
    service_name: "Khu Bảo Tồn Rừng Tràm Trà Sư (Vé)",
    place_name: "Rừng Tràm Trà Sư",
    name: "Tour Quan Sát Chim",
    description: "Tour quan sát chim được hướng dẫn",
    price: 200000,
  },
  {
    service_name: "Khu Bảo Tồn Rừng Tràm Trà Sư (Vé)",
    place_name: "Rừng Tràm Trà Sư",
    name: "Gói Nhiếp Ảnh",
    description: "Tour du thuyền cho người chụp ảnh",
    price: 250000,
  },
  {
    service_name: "Khu Bảo Tồn Rừng Tràm Trà Sư (Vé)",
    place_name: "Rừng Tràm Trà Sư",
    name: "Tour Hoàng Hôn Đặc Biệt",
    description: "Tour sáng sớm để bắt bình minh",
    price: 180000,
  },
  {
    service_name: "Khu Bảo Tồn Rừng Tràm Trà Sư (Vé)",
    place_name: "Rừng Tràm Trà Sư",
    name: "Eco Tour với Bữa Trưa",
    description: "Trải nghiệm đầy đủ bao gồm bữa trưa",
    price: 300000,
  },

  // === Hạ Long ===
  {
    service_name: "Tour Hạ Long Bay (Vé Tàu/Tham Quan)",
    place_name: "Hạ Long Bay",
    name: "Vé Du Thuyền Hạ Long - Người Lớn",
    description: "Vé du thuyền khám phá vịnh Hạ Long",
    price: 350000,
  },
  {
    service_name: "Tour Hạ Long Bay (Vé Tàu/Tham Quan)",
    place_name: "Hạ Long Bay",
    name: "Vé Du Thuyền Hạ Long - Trẻ Em",
    description: "Vé du thuyền cho trẻ em",
    price: 180000,
  },
  {
    service_name: "Tour Hạ Long Bay (Vé Tàu/Tham Quan)",
    place_name: "Hạ Long Bay",
    name: "Gói Du Thuyền Sang Trọng Hạ Long",
    description: "Gói du thuyền cao cấp",
    price: 500000,
  },

  // === Hội An ===
  {
    service_name: "Khám Phá Phố Cổ Hội An (Vé)",
    place_name: "Hội An Ancient Town",
    name: "Vé Phố Cổ Hội An",
    description: "Vé vào phố cổ Hội An - Di sản UNESCO",
    price: 120000,
  },

  // === Sapa ===
  {
    service_name: "Trekking Sapa (Vé/Dịch vụ)",
    place_name: "Sapa",
    name: "Tour Trekking Sapa - Cơ Bản",
    description: "Tour trekking núi Sapa cơ bản",
    price: 200000,
  },
  {
    service_name: "Trekking Sapa (Vé/Dịch vụ)",
    place_name: "Sapa",
    name: "Tour Trekking Sapa - Nâng Cao",
    description: "Tour trekking Sapa nâng cao",
    price: 350000,
  },
];

async function seedTickets(prisma) {
  console.log("Seeding tickets (Dynamic)...");

  for (const t of tickets) {
    const service = await prisma.service.findFirst({ where: { name: t.service_name } });
    const place = await prisma.place.findFirst({ where: { name: t.place_name } });

    if (!service || !place) {
      console.warn(`Missing Service or Place for ticket: ${t.name}`);
      continue;
    }

    const exists = await prisma.ticket.findFirst({
      where: { name: t.name, service_id: service.id },
    });

    if (!exists) {
      await prisma.ticket.create({
        data: {
          name: t.name,
          description: t.description,
          price: t.price,
          service_id: service.id,
          place_id: place.id,
          status: "AVAILABLE",
        },
      });
    }
  }
  console.log(`Seeded Tickets.`);
}

module.exports = { seedTickets };
