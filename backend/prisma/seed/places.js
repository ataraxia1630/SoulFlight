const { upsertMany } = require("./utils/upsertMany");

const places = [
  // ========== Mekong Delta / South ==========
  {
    name: "Núi Sam",
    description: "Núi linh thiêng với tầm nhìn toàn cảnh Đồng bằng sông Cửu Long",
    address: "Núi Sam, Châu Đốc, An Giang",
    opening_hours: {
      monday: [{ open: "06:00", close: "18:00" }],
      tuesday: [{ open: "06:00", close: "18:00" }],
      wednesday: [{ open: "06:00", close: "18:00" }],
      thursday: [{ open: "06:00", close: "18:00" }],
      friday: [{ open: "06:00", close: "18:00" }],
      saturday: [{ open: "06:00", close: "18:00" }],
      sunday: [{ open: "06:00", close: "18:00" }],
    },
    entry_fee: 50000,
  },
  {
    name: "Rừng Tràm Trà Sư",
    description: "Rừng ngập mặn đẹp và khu bảo tồn chim",
    address: "Huyện Tịnh Biên, An Giang",
    opening_hours: {
      monday: [{ open: "06:30", close: "17:30" }],
      tuesday: [{ open: "06:30", close: "17:30" }],
      wednesday: [{ open: "06:30", close: "17:30" }],
      thursday: [{ open: "06:30", close: "17:30" }],
      friday: [{ open: "06:30", close: "17:30" }],
      saturday: [{ open: "06:30", close: "17:30" }],
      sunday: [{ open: "06:30", close: "17:30" }],
    },
    entry_fee: 100000,
  },
  {
    name: "Chợ nổi Cái Răng",
    description: "Chợ nổi lớn nhất Đồng bằng sông Cửu Long",
    address: "Cái Răng, Cần Thơ",
    opening_hours: {
      monday: [{ open: "05:00", close: "09:00" }],
      tuesday: [{ open: "05:00", close: "09:00" }],
      wednesday: [{ open: "05:00", close: "09:00" }],
      thursday: [{ open: "05:00", close: "09:00" }],
      friday: [{ open: "05:00", close: "09:00" }],
      saturday: [{ open: "05:00", close: "09:00" }],
      sunday: [{ open: "05:00", close: "09:00" }],
    },
    entry_fee: 0,
  },
  {
    name: "Chợ Châu Đốc",
    description: "Chợ truyền thống Việt Nam với các sản phẩm địa phương",
    address: "Phố Chi Lăng, Châu Đốc",
    opening_hours: {
      monday: [
        { open: "05:00", close: "12:00" },
        { open: "14:00", close: "19:00" },
      ],
      tuesday: [
        { open: "05:00", close: "12:00" },
        { open: "14:00", close: "19:00" },
      ],
      wednesday: [
        { open: "05:00", close: "12:00" },
        { open: "14:00", close: "19:00" },
      ],
      thursday: [
        { open: "05:00", close: "12:00" },
        { open: "14:00", close: "19:00" },
      ],
      friday: [
        { open: "05:00", close: "12:00" },
        { open: "14:00", close: "19:00" },
      ],
      saturday: [
        { open: "05:00", close: "12:00" },
        { open: "14:00", close: "19:00" },
      ],
      sunday: [{ open: "08:00", close: "18:00" }],
    },
    entry_fee: 0,
  },
  {
    name: "Mộ Thoại Ngộc Hầu",
    description: "Lăng mộ tướng Việt nổi tiếng",
    address: "Núi Sam, Châu Đốc",
    opening_hours: {
      monday: [{ open: "07:00", close: "17:00" }],
      tuesday: [{ open: "07:00", close: "17:00" }],
      wednesday: [{ open: "07:00", close: "17:00" }],
      thursday: [{ open: "07:00", close: "17:00" }],
      friday: [{ open: "07:00", close: "17:00" }],
      saturday: [{ open: "07:00", close: "17:00" }],
      sunday: [{ open: "07:00", close: "17:00" }],
    },
    entry_fee: 20000,
  },
  {
    name: "Chùa Bà Chúa Xứ",
    description: "Chùa cổ thờ Nữ thần của đất nước",
    address: "Núi Sam, Châu Đốc",
    opening_hours: {
      monday: [{ open: "06:00", close: "18:00" }],
      tuesday: [{ open: "06:00", close: "18:00" }],
      wednesday: [{ open: "06:00", close: "18:00" }],
      thursday: [{ open: "06:00", close: "18:00" }],
      friday: [{ open: "06:00", close: "18:00" }],
      saturday: [{ open: "06:00", close: "18:00" }],
      sunday: [{ open: "06:00", close: "18:00" }],
    },
    entry_fee: 0,
  },
  {
    name: "Sông Cửu Long",
    description: "Dòng sông lớn chảy qua Đông Nam Á",
    address: "Châu Đốc, An Giang",
    opening_hours: null,
    entry_fee: 0,
  },
  {
    name: "Làng nổi Châu Giang",
    description: "Nhà sàn truyền thống và trang trại cá",
    address: "Châu Giang, Châu Đốc",
    opening_hours: {
      monday: [{ open: "06:00", close: "18:00" }],
      tuesday: [{ open: "06:00", close: "18:00" }],
      wednesday: [{ open: "06:00", close: "18:00" }],
      thursday: [{ open: "06:00", close: "18:00" }],
      friday: [{ open: "06:00", close: "18:00" }],
      saturday: [{ open: "06:00", close: "18:00" }],
      sunday: [{ open: "06:00", close: "18:00" }],
    },
    entry_fee: 30000,
  },

  // ========== Central Vietnam ==========
  {
    name: "Thành phố Hội An",
    description: "Phố cổ nổi tiếng với kiến trúc Việt-Pháp",
    address: "Hội An, Quảng Nam",
    opening_hours: null,
    entry_fee: 0,
  },
  {
    name: "Chùa Cầu Hội An",
    description: "Chùa cổ nhất Hội An, kết hợp kiến trúc Nhật-Trung-Việt",
    address: "1 Tran Phu, Hoi An",
    opening_hours: {
      monday: [{ open: "08:00", close: "18:00" }],
      tuesday: [{ open: "08:00", close: "18:00" }],
      wednesday: [{ open: "08:00", close: "18:00" }],
      thursday: [{ open: "08:00", close: "18:00" }],
      friday: [{ open: "08:00", close: "18:00" }],
      saturday: [{ open: "08:00", close: "18:00" }],
      sunday: [{ open: "08:00", close: "18:00" }],
    },
    entry_fee: 40000,
  },
  {
    name: "Hội An Ancient Town",
    description: "Khu phố cổ Hội An - Di sản thế giới UNESCO",
    address: "Hội An, Quảng Nam",
    opening_hours: null,
    entry_fee: 120000,
  },

  // ========== North Vietnam ==========
  {
    name: "Hạ Long Bay",
    description: "Vịnh Hạ Long - Di sản thế giới với hàng nghìn hòn đảo",
    address: "Hạ Long, Quảng Ninh",
    opening_hours: null,
    entry_fee: 250000,
  },
  {
    name: "Hang Sơn Đoòng",
    description: "Hang động lớn nhất thế giới",
    address: "Quảng Bình",
    opening_hours: {
      monday: [{ open: "07:00", close: "17:00" }],
      tuesday: [{ open: "07:00", close: "17:00" }],
      wednesday: [{ open: "07:00", close: "17:00" }],
      thursday: [{ open: "07:00", close: "17:00" }],
      friday: [{ open: "07:00", close: "17:00" }],
      saturday: [{ open: "07:00", close: "17:00" }],
      sunday: [{ open: "07:00", close: "17:00" }],
    },
    entry_fee: 500000,
  },
  {
    name: "Sapa",
    description: "Thị trấn vùng cao có khí hậu mát mẻ và cảnh sắc tuyệt đẹp",
    address: "Sapa, Lào Cai",
    opening_hours: null,
    entry_fee: 0,
  },
  {
    name: "Thác Bạc",
    description: "Thác nước nổi tiếng ở Sapa",
    address: "Sapa, Lào Cai",
    opening_hours: {
      monday: [{ open: "07:00", close: "17:00" }],
      tuesday: [{ open: "07:00", close: "17:00" }],
      wednesday: [{ open: "07:00", close: "17:00" }],
      thursday: [{ open: "07:00", close: "17:00" }],
      friday: [{ open: "07:00", close: "17:00" }],
      saturday: [{ open: "07:00", close: "17:00" }],
      sunday: [{ open: "07:00", close: "17:00" }],
    },
    entry_fee: 50000,
  },
  {
    name: "Hà Nội",
    description: "Thủ đô của Việt Nam với lịch sử hơn 1000 năm",
    address: "Hà Nội",
    opening_hours: null,
    entry_fee: 0,
  },
  {
    name: "Hồ Gươm",
    description: "Hồ nước trung tâm thành phố Hà Nội",
    address: "Hoàn Kiếm, Hà Nội",
    opening_hours: null,
    entry_fee: 0,
  },

  // ========== South Coast ==========
  {
    name: "Phú Quốc",
    description: "Đảo du lịch nổi tiếng với bãi biển đẹp",
    address: "Phú Quốc, Kiên Giang",
    opening_hours: null,
    entry_fee: 0,
  },
  {
    name: "Bãi Dài Phú Quốc",
    description: "Bãi biển dài nhất Phú Quốc",
    address: "Bãi Dài, Phú Quốc",
    opening_hours: null,
    entry_fee: 0,
  },
  {
    name: "Nha Trang",
    description: "Thành phố du lịch biển nổi tiếng",
    address: "Nha Trang, Khánh Hòa",
    opening_hours: null,
    entry_fee: 0,
  },
  {
    name: "Bãi Biển Nha Trang",
    description: "Bãi biển trắng cát mịn",
    address: "Nha Trang, Khánh Hòa",
    opening_hours: null,
    entry_fee: 0,
  },

  // ========== Central Highlands ==========
  {
    name: "Đà Lạt",
    description: "Thành phố ngàn hoa với khí hậu mát mẻ",
    address: "Đà Lạt, Lâm Đồng",
    opening_hours: null,
    entry_fee: 0,
  },
  {
    name: "Thung lũng tình yêu",
    description: "Khu du lịch lãng mạn ở Đà Lạt",
    address: "Đà Lạt, Lâm Đồng",
    opening_hours: {
      monday: [{ open: "07:00", close: "18:00" }],
      tuesday: [{ open: "07:00", close: "18:00" }],
      wednesday: [{ open: "07:00", close: "18:00" }],
      thursday: [{ open: "07:00", close: "18:00" }],
      friday: [{ open: "07:00", close: "18:00" }],
      saturday: [{ open: "07:00", close: "18:00" }],
      sunday: [{ open: "07:00", close: "18:00" }],
    },
    entry_fee: 80000,
  },

  // ========== Ho Chi Minh City ==========
  {
    name: "Thành phố Hồ Chí Minh",
    description: "Thành phố lớn nhất Việt Nam",
    address: "Hồ Chí Minh",
    opening_hours: null,
    entry_fee: 0,
  },
  {
    name: "Dinh Độc Lập",
    description: "Công trình kiến trúc lịch sử",
    address: "Quận 1, TP HCM",
    opening_hours: {
      monday: [
        { open: "07:30", close: "11:00" },
        { open: "13:00", close: "16:00" },
      ],
      tuesday: [
        { open: "07:30", close: "11:00" },
        { open: "13:00", close: "16:00" },
      ],
      wednesday: [
        { open: "07:30", close: "11:00" },
        { open: "13:00", close: "16:00" },
      ],
      thursday: [
        { open: "07:30", close: "11:00" },
        { open: "13:00", close: "16:00" },
      ],
      friday: [
        { open: "07:30", close: "11:00" },
        { open: "13:00", close: "16:00" },
      ],
      saturday: [
        { open: "07:30", close: "11:00" },
        { open: "13:00", close: "16:00" },
      ],
      sunday: [
        { open: "07:30", close: "11:00" },
        { open: "13:00", close: "16:00" },
      ],
    },
    entry_fee: 40000,
  },
  {
    name: "Nhà thờ Đức Bà",
    description: "Nhà thờ Công giáo nổi tiếng Sài Gòn",
    address: "Quận 1, TP HCM",
    opening_hours: {
      monday: [
        { open: "08:00", close: "11:00" },
        { open: "14:00", close: "17:00" },
      ],
      tuesday: [
        { open: "08:00", close: "11:00" },
        { open: "14:00", close: "17:00" },
      ],
      wednesday: [
        { open: "08:00", close: "11:00" },
        { open: "14:00", close: "17:00" },
      ],
      thursday: [
        { open: "08:00", close: "11:00" },
        { open: "14:00", close: "17:00" },
      ],
      friday: [
        { open: "08:00", close: "11:00" },
        { open: "14:00", close: "17:00" },
      ],
      saturday: [
        { open: "08:00", close: "11:00" },
        { open: "14:00", close: "17:00" },
      ],
      sunday: [{ open: "14:00", close: "17:00" }],
    },
    entry_fee: 0,
  },
];

async function seedPlaces(prisma) {
  console.log("Seeding places...");
  await upsertMany(prisma, prisma.place, places, ["name", "address"]);
  console.log(`Seeded ${places.length} places`);
}

module.exports = { seedPlaces };
