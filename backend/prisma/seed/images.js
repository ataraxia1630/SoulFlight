const images = [
  // ==================== ROOM IMAGES ====================
  // Khách Sạn Sunrise Grand - Phòng Deluxe View Thành Phố
  {
    service: "Khách Sạn Sunrise Grand",
    room: "Phòng Deluxe View Thành Phố",
    url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
    position: 0,
    is_main: true,
  },
  {
    service: "Khách Sạn Sunrise Grand",
    room: "Phòng Deluxe View Thành Phố",
    url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14",
    position: 1,
    is_main: false,
  },
  {
    service: "Khách Sạn Sunrise Grand",
    room: "Phòng Deluxe View Thành Phố",
    url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
    position: 2,
    is_main: false,
  },

  // Khách Sạn Sunrise Grand - Phòng Hành Động Điều Hành
  {
    service: "Khách Sạn Sunrise Grand",
    room: "Phòng Hành Động Điều Hành",
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    position: 0,
    is_main: true,
  },
  {
    service: "Khách Sạn Sunrise Grand",
    room: "Phòng Hành Động Điều Hành",
    url: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
    position: 1,
    is_main: false,
  },
  {
    service: "Khách Sạn Sunrise Grand",
    room: "Phòng Hành Động Điều Hành",
    url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c",
    position: 2,
    is_main: false,
  },

  // Khách Sạn Sunrise Grand - Phòng Presidential Suite
  {
    service: "Khách Sạn Sunrise Grand",
    room: "Phòng Presidential Suite",
    url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
    position: 0,
    is_main: true,
  },
  {
    service: "Khách Sạn Sunrise Grand",
    room: "Phòng Presidential Suite",
    url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0",
    position: 1,
    is_main: false,
  },
  {
    service: "Khách Sạn Sunrise Grand",
    room: "Phòng Presidential Suite",
    url: "https://images.unsplash.com/photo-1571624436279-b272aff752b5",
    position: 2,
    is_main: false,
  },

  // Resort Bãi Biển Sunrise - Bungalow View Biển
  {
    service: "Resort Bãi Biển Sunrise",
    room: "Bungalow View Biển",
    url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    position: 0,
    is_main: true,
  },
  {
    service: "Resort Bãi Biển Sunrise",
    room: "Bungalow View Biển",
    url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    position: 1,
    is_main: false,
  },

  // Resort Bãi Biển Sunrise - Villa Bãi Biển
  {
    service: "Resort Bãi Biển Sunrise",
    room: "Villa Bãi Biển",
    url: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1",
    position: 0,
    is_main: true,
  },
  {
    service: "Resort Bãi Biển Sunrise",
    room: "Villa Bãi Biển",
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    position: 1,
    is_main: false,
  },
  {
    service: "Resort Bãi Biển Sunrise",
    room: "Villa Bãi Biển",
    url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
    position: 2,
    is_main: false,
  },

  // Khách Sạn Boutique Sunrise - Phòng Di Sản
  {
    service: "Khách Sạn Boutique Sunrise",
    room: "Phòng Di Sản",
    url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
    position: 0,
    is_main: true,
  },
  {
    service: "Khách Sạn Boutique Sunrise",
    room: "Phòng Di Sản",
    url: "https://images.unsplash.com/photo-1540518614846-7eded433c457",
    position: 1,
    is_main: false,
  },

  // Khách Sạn Boutique Sunrise - Loft Trên Mái
  {
    service: "Khách Sạn Boutique Sunrise",
    room: "Loft Trên Mái",
    url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af",
    position: 0,
    is_main: true,
  },
  {
    service: "Khách Sạn Boutique Sunrise",
    room: "Loft Trên Mái",
    url: "https://images.unsplash.com/photo-1449844908441-8829872d2607",
    position: 1,
    is_main: false,
  },

  // Lều Núi Sunrise - Suite Núi Hạng Sang
  {
    service: "Lều Núi Sunrise",
    room: "Suite Núi Hạng Sang",
    url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39",
    position: 0,
    is_main: true,
  },
  {
    service: "Lều Núi Sunrise",
    room: "Suite Núi Hạng Sang",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    position: 1,
    is_main: false,
  },

  // ==================== PLACE IMAGES ====================
  // (Mỗi Place chỉ có 1 ảnh main, position mặc định là 0)
  {
    type: "Place",
    name: "Núi Sam",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    position: 0,
    is_main: true,
  },
  {
    type: "Place",
    name: "Rừng Tràm Trà Sư",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    position: 0,
    is_main: true,
  },
  {
    type: "Place",
    name: "Chợ nổi Cái Răng",
    url: "https://images.unsplash.com/photo-1528127269322-539801943592",
    position: 0,
    is_main: true,
  },
  {
    type: "Place",
    name: "Chợ Châu Đốc",
    url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
    position: 0,
    is_main: true,
  },
  {
    type: "Place",
    name: "Mộ Thoại Ngọc Hầu",
    url: "https://images.unsplash.com/photo-1548013146-72479768bada",
    position: 0,
    is_main: true,
  },
  {
    type: "Place",
    name: "Chùa Bà Chúa Xứ",
    url: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092",
    position: 0,
    is_main: true,
  },
];

async function seedImages(prisma) {
  console.log("Seeding images (Dynamic Lookup)...");

  for (const img of images) {
    let relatedId = null;
    let relatedType = "";

    // Xử lý logic tìm ID
    if (img.type === "Place") {
      const place = await prisma.place.findFirst({ where: { name: img.name } });
      if (place) {
        relatedId = place.id;
        relatedType = "Place";
      }
    } else {
      // Mặc định là Room nếu không khai báo type: "Place"
      const service = await prisma.service.findFirst({ where: { name: img.service } });
      if (service) {
        const room = await prisma.room.findFirst({
          where: { name: img.room, service_id: service.id },
        });
        if (room) {
          relatedId = room.id;
          relatedType = "Room";
        }
      }
    }

    if (!relatedId) {
      console.warn(
        `Target not found for image: ${img.url} (Service: ${
          img.service
        }, Room/Place: ${img.room || img.name})`,
      );
      continue;
    }

    await prisma.image.create({
      data: {
        url: img.url,
        position: img.position,
        is_main: img.is_main,
        related_id: relatedId,
        related_type: relatedType,
      },
    });
  }
  console.log(`Seeded Images.`);
}

module.exports = { seedImages };
