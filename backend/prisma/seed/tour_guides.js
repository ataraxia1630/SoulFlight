const { upsertMany } = require("./utils/upsertMany");

const tourGuides = [
  {
    name: "Nguyễn Văn An",
    phone: "+84978123456",
    description:
      "Hướng dẫn viên có kinh nghiệm 10 năm trong du lịch Đồng Bằng Sông Cửu Long. Thành thạo tiếng Anh, Pháp và Việt.",
    image_url: "https://i.pravatar.cc/400?img=15",
  },
  {
    name: "Trần Thị Bình",
    phone: "+84989234567",
    description:
      "Chuyên gia địa phương về tour văn hóa và làng quê truyền thống. Nói tiếng Anh và Nhật Bản.",
    image_url: "https://i.pravatar.cc/400?img=45",
  },
  {
    name: "Lê Minh Châu",
    phone: "+84967345678",
    description:
      "Chuyên gia tour phiêu lưu với kinh nghiệm xe đạp và du lịch sinh thái. Nói tiếng Anh và Đức.",
    image_url: "https://i.pravatar.cc/400?img=52",
  },
  {
    name: "Phạm Thanh Đạt",
    phone: "+84956456789",
    description:
      "Hướng dẫn nhiếp ảnh và thiên nhiên chuyên quan sát chim và tour động vật hoang dã.",
    image_url: "https://i.pravatar.cc/400?img=13",
  },
  {
    name: "Hoàng Thị Em",
    phone: "+84945567890",
    description: "Chuyên gia tour ẩm thực với kiến thức sâu về nấu ăn truyền thống địa phương.",
    image_url: "https://i.pravatar.cc/400?img=48",
  },
];

async function seedTourGuides(prisma) {
  console.log("Seeding tour guides...");
  await upsertMany(prisma, prisma.tourGuide, tourGuides, ["name", "phone"]);
  console.log(`Seeded ${tourGuides.length} tour guides`);
}

module.exports = { seedTourGuides };
