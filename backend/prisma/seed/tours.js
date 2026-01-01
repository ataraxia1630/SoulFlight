// tạo date động từ ngày chạy seed
const getDynamicDate = (daysFromNow, hour = 7, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, minute, 0, 0);
  return date;
};

// Tours với thời gian ĐỘNG (tính từ ngày chạy seed)
const getTours = () => [
  // === Service: Khám Phá Đồng Bằng Sông Cửu Long ===
  // 🔥 3 TOURS BẮT ĐẦU HÔM NAY (ngày 0)
  {
    service_name: "Khám Phá Đồng Bằng Sông Cửu Long",
    name: "Khám Phá Đồng Bằng Sông Cửu Long Nguyên Ngày",
    description: "Tour toàn ngày khám phá chợ nổi, làng quê và nghề thủ công truyền thống",
    service_price: 850000,
    total_price: 1200000,
    status: "AVAILABLE",
    tourguide_id: 1,
    start_time: getDynamicDate(0, 7, 0), // HÔM NAY, 7:00
    end_time: getDynamicDate(0, 17, 0), // HÔM NAY, 17:00
  },
  {
    service_name: "Khám Phá Đồng Bằng Sông Cửu Long",
    name: "Tour Chợ Nổi Sáng Sớm",
    description: "Sáng sớm thăm chợ nổi Cái Răng nhộn nhịp",
    service_price: 420000,
    total_price: 580000,
    status: "AVAILABLE",
    tourguide_id: 2,
    start_time: getDynamicDate(0, 5, 0), // HÔM NAY, 5:00
    end_time: getDynamicDate(0, 9, 30), // HÔM NAY, 9:30
  },
  {
    service_name: "Khám Phá Đồng Bằng Sông Cửu Long",
    name: "Tour Ẩm Thực Phiêu Lưu",
    description: "Tour nếm thử đặc sản tại các chợ địa phương và nhà hàng",
    service_price: 550000,
    total_price: 800000,
    status: "AVAILABLE",
    tourguide_id: 5,
    start_time: getDynamicDate(0, 10, 0), // HÔM NAY, 10:00
    end_time: getDynamicDate(0, 18, 0), // HÔM NAY, 18:00
  },
  {
    service_name: "Khám Phá Đồng Bằng Sông Cửu Long",
    name: "Trải Nghiệm Làng Nổi",
    description: "Thăm nhà sàn truyền thống và trang trại cá trên sông",
    service_price: 380000,
    total_price: 520000,
    status: "AVAILABLE",
    tourguide_id: 3,
    start_time: getDynamicDate(38, 7, 0),
    end_time: getDynamicDate(38, 16, 0),
  },
  {
    service_name: "Khám Phá Đồng Bằng Sông Cửu Long",
    name: "Khám Phá Mekong Hai Ngày",
    description: "Tour mở rộng khám phá nhiều tỉnh với lưu trú tại nhà dân",
    service_price: 1800000,
    total_price: 2500000,
    status: "AVAILABLE",
    tourguide_id: 1,
    start_time: getDynamicDate(42, 7, 0),
    end_time: getDynamicDate(43, 16, 0), // Kết thúc ngày hôm sau
  },

  // === Service: Du Thuyền Hoàng Hôn ===
  {
    service_name: "Du Thuyền Hoàng Hôn",
    name: "Du Thuyền Hoàng Hôn Trên Sông Mekong",
    description: "Tour tối lãng mạn với tàu du thuyền, ăn tối và nhạc sống trên sông Cửu Long",
    service_price: 650000,
    total_price: 900000,
    status: "AVAILABLE",
    tourguide_id: 2,
    start_time: getDynamicDate(19, 17, 0),
    end_time: getDynamicDate(19, 21, 0),
  },

  // === Service: Tour Đạp Xe Qua Làng Quê ===
  {
    service_name: "Tour Đạp Xe Qua Làng Quê",
    name: "Tour Đạp Xe Qua Làng Quê",
    description: "Khám phá cuộc sống nông thôn bằng xe đạp với dừng chân ở các nhà dân",
    service_price: 450000,
    total_price: 600000,
    status: "AVAILABLE",
    tourguide_id: 3,
    start_time: getDynamicDate(21, 8, 0),
    end_time: getDynamicDate(21, 12, 0),
  },

  // === Service: Hành Trình Tâm Linh Núi Sam (Tour) ===
  {
    service_name: "Hành Trình Tâm Linh Núi Sam (Tour)",
    name: "Hành Trình Tâm Linh Núi Sam",
    description: "Thăm các chùa chiền và tháp trên Núi Sam linh thiêng",
    service_price: 380000,
    total_price: 550000,
    status: "AVAILABLE",
    tourguide_id: 1,
    start_time: getDynamicDate(24, 6, 0),
    end_time: getDynamicDate(24, 12, 0),
  },

  // === Service: Eco Tour Rừng Tràm Trà Sư ===
  {
    service_name: "Eco Tour Rừng Tràm Trà Sư",
    name: "Eco Tour Rừng Tràm Trà Sư",
    description: "Quan sát chim và khám phá thiên nhiên trong rừng tràm",
    service_price: 520000,
    total_price: 750000,
    status: "AVAILABLE",
    tourguide_id: 4,
    start_time: getDynamicDate(27, 6, 30),
    end_time: getDynamicDate(27, 17, 0),
  },
  {
    service_name: "Eco Tour Rừng Tràm Trà Sư",
    name: "Tour Nhiếp Ảnh Đồng Bằng Sông Cửu Long",
    description: "Chuyên chụp ảnh với hướng dẫn của chuyên gia tại Đồng bằng Sông Cửu Long",
    service_price: 680000,
    total_price: 950000,
    status: "AVAILABLE",
    tourguide_id: 4,
    start_time: getDynamicDate(48, 6, 0),
    end_time: getDynamicDate(48, 18, 0),
  },
  {
    service_name: "Du Thuyền Hoàng Hôn",
    name: "Tour Hoàng Hôn Đặc Biệt VIP",
    description: "Tour VIP với du thuyền sang trọng và bữa tối 5 sao",
    service_price: 1200000,
    total_price: 1800000,
    status: "NO_LONGER_PROVIDED",
    tourguide_id: 2,
    start_time: getDynamicDate(15, 18, 0),
    end_time: getDynamicDate(15, 22, 0),
  },
  {
    service_name: "Tour Đạp Xe Qua Làng Quê",
    name: "Tour Đạp Xe Đêm Qua Cánh Đồng",
    description: "Tour đạp xe buổi tối với đèn pin khám phá đồng lúa",
    service_price: 350000,
    total_price: 480000,
    status: "NO_LONGER_PROVIDED",
    tourguide_id: 3,
    start_time: getDynamicDate(18, 19, 0),
    end_time: getDynamicDate(18, 22, 0),
  },
];

async function seedTours(prisma) {
  console.log("Seeding tours (Dynamic dates)...");

  const tours = getTours();

  for (const tour of tours) {
    const service = await prisma.service.findFirst({
      where: { name: tour.service_name },
    });

    if (!service) {
      console.warn(`Service not found for tour: ${tour.name}`);
      continue;
    }

    // Kiểm tra tên và id dịch vụ để tránh trùng
    const exists = await prisma.tour.findFirst({
      where: { name: tour.name, service_id: service.id },
    });

    if (!exists) {
      await prisma.tour.create({
        data: {
          name: tour.name,
          description: tour.description,
          service_price: tour.service_price,
          total_price: tour.total_price,
          status: tour.status,
          service_id: service.id,
          tourguide_id: tour.tourguide_id,
          start_time: tour.start_time,
          end_time: tour.end_time,
        },
      });
      console.log(`Created: ${tour.name} (${tour.start_time.toLocaleDateString()})`);
    } else {
      console.log(`Skipped (exists): ${tour.name}`);
    }
  }

  console.log(`Seeded ${tours.length} tours.`);
}

module.exports = { seedTours };
