const { upsertMany } = require("./utils/upsertMany");

const tourPlaces = [
  // Tour 1 - Khám Phá Đồng Bằng Sông Cửu Long Nguyên Ngày
  {
    tour_id: 1,
    place_id: 3,
    description: "Sáng sớm thăm chợ nổi",
    start_time: "06:00",
    end_time: "08:30",
  },
  {
    tour_id: 1,
    place_id: 8,
    description: "Khám phá làng nổi và trang trại cá",
    start_time: "09:00",
    end_time: "11:00",
  },
  {
    tour_id: 1,
    place_id: 4,
    description: "Ăn trưa và mua sắm tại chợ",
    start_time: "11:30",
    end_time: "13:00",
  },
  {
    tour_id: 1,
    place_id: 10,
    description: "Thăm làng quê truyền thống",
    start_time: "13:30",
    end_time: "15:30",
  },

  // Tour 2 - Du Thuyền Hoàng Hôn Trên Sông Mekong
  {
    tour_id: 2,
    place_id: 7,
    description: "Du thuyền ngắm cảnh sông Cửu Long",
    start_time: "16:30",
    end_time: "19:00",
  },
  {
    tour_id: 2,
    place_id: 8,
    description: "Đi qua làng nổi",
    start_time: "17:00",
    end_time: "17:30",
  },

  // Tour 3 - Tour Đạp Xe Qua Làng Quê
  {
    tour_id: 3,
    place_id: 10,
    description: "Đạp xe qua làng quê truyền thống",
    start_time: "08:00",
    end_time: "10:00",
  },
  {
    tour_id: 3,
    place_id: 9,
    description: "Thăm thành phố Long Xuyên",
    start_time: "10:30",
    end_time: "12:00",
  },

  // Tour 4 - Hành Trình Tâm Linh Núi Sam
  {
    tour_id: 4,
    place_id: 1,
    description: "Cáp treo lên đỉnh núi",
    start_time: "08:00",
    end_time: "10:00",
  },
  {
    tour_id: 4,
    place_id: 6,
    description: "Thăm Chùa Bà Chúa Xứ",
    start_time: "10:30",
    end_time: "11:30",
  },
  {
    tour_id: 4,
    place_id: 5,
    description: "Thăm mộ lịch sử",
    start_time: "12:00",
    end_time: "13:00",
  },

  // Tour 5 - Eco Tour Rừng Tràm Trà Sư
  {
    tour_id: 5,
    place_id: 2,
    description: "Du thuyền qua rừng tràm",
    start_time: "07:00",
    end_time: "10:00",
  },
  {
    tour_id: 5,
    place_id: 2,
    description: "Quan sát chim và thăm thiên nhiên",
    start_time: "10:30",
    end_time: "12:30",
  },

  // Tour 6 - Tour Chợ Nổi Sáng Sớm
  {
    tour_id: 6,
    place_id: 3,
    description: "Trải nghiệm chợ nổi nhộn nhịp",
    start_time: "05:30",
    end_time: "08:00",
  },
  {
    tour_id: 6,
    place_id: 7,
    description: "Du thuyền trở lại trên sông Mekong",
    start_time: "08:30",
    end_time: "09:30",
  },

  // Tour 7 - Tour Ẩm Thực Phiêu Lưu
  {
    tour_id: 7,
    place_id: 4,
    description: "Nếm thử ẩm thực tại chợ",
    start_time: "09:00",
    end_time: "11:00",
  },
  {
    tour_id: 7,
    place_id: 10,
    description: "Biểu diễn nấu ăn truyền thống",
    start_time: "11:30",
    end_time: "13:30",
  },

  // Tour 8 - Trải Nghiệm Làng Nổi
  {
    tour_id: 8,
    place_id: 8,
    description: "Thăm nhà sàn và trang trại cá",
    start_time: "08:00",
    end_time: "11:00",
  },

  // Tour 9 - Khám Phá Mekong Hai Ngày
  {
    tour_id: 9,
    place_id: 3,
    description: "Ngày 1: Chợ nổi",
    start_time: "06:00",
    end_time: "09:00",
  },
  {
    tour_id: 9,
    place_id: 8,
    description: "Ngày 1: Làng nổi",
    start_time: "10:00",
    end_time: "13:00",
  },
  {
    tour_id: 9,
    place_id: 1,
    description: "Ngày 2: Núi Sam",
    start_time: "08:00",
    end_time: "12:00",
  },
  {
    tour_id: 9,
    place_id: 2,
    description: "Ngày 2: Rừng Trà Sư",
    start_time: "13:00",
    end_time: "16:00",
  },

  // Tour 10 - Tour Nhiếp Ảnh Đồng Bằng Sông Cửu Long
  {
    tour_id: 10,
    place_id: 2,
    description: "Chụp ảnh phong cảnh và chim",
    start_time: "06:00",
    end_time: "09:00",
  },
  {
    tour_id: 10,
    place_id: 8,
    description: "Chụp ảnh chân dung tại làng nổi",
    start_time: "09:30",
    end_time: "12:00",
  },
];

async function seedTourPlaces(prisma) {
  console.log("Seeding tour places...");
  await upsertMany(prisma, prisma.tourPlace, tourPlaces, ["tour_id", "place_id"]);
  console.log(`Seeded ${tourPlaces.length} tour-place associations`);
}

module.exports = { seedTourPlaces };
