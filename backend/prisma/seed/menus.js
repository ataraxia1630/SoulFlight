const { upsertMany } = require("./utils/upsertMany");

const menus = [
  // ========== Service ID 8: Phở Góc Trung Tâm ==========
  {
    name: "Thực Đơn Phở Truyền Thống",
    description: "Phở Việt nam ngon với nhiều loại thịt",
    cover_url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43",
    service_id: 8,
  },
  {
    name: "Đồ Ăn Kèm & Khai Vị",
    description: "Nem cuốn và khai vị Việt Nam",
    cover_url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb",
    service_id: 8,
  },

  // ========== Service ID 9: Nhà Hàng Phở Góc ==========
  {
    name: "Món Ăn Fusion",
    description: "Ẩm thực Việt Nam hiện đại với hương vị quốc tế",
    cover_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    service_id: 9,
  },
  {
    name: "Lựa Chọn Cao Cấp",
    description: "Nguyên liệu chất lượng cao và cách chế biến đặc biệt",
    cover_url: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",
    service_id: 9,
  },

  // ========== Service ID 10: Phở Góc Sân Thượng ==========
  {
    name: "Thực Đơn Ăn Uống Tinh Tế",
    description: "Món ăn Việt nam tinh xảo cho những dịp đặc biệt",
    cover_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    service_id: 10,
  },
  {
    name: "Rượu Vang & Cocktail",
    description: "Rượu vang được chọn lọc kỹ và cocktail chữ ký",
    cover_url: "https://images.unsplash.com/photo-1470337458703-46ad1756a187",
    service_id: 10,
  },

  // ========== Service ID 11: Quán Cà Phê Phở Góc ==========
  {
    name: "Lựa Chọn Cà Phê",
    description: "Cà phê Việt nam truyền thống và hiện đại",
    cover_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    service_id: 11,
  },
  {
    name: "Bánh & Tráng Miệng",
    description: "Bánh tươi nướng và những món ngọt",
    cover_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
    service_id: 11,
  },

  // ========== Service ID 12: Phở Góc Đồ Ăn Đường Phố ==========
  {
    name: "Các Món Ăn Đường Phố",
    description: "Những món ăn đường phố Việt Nam yêu thích",
    cover_url: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    service_id: 12,
  },
  {
    name: "Đồ Ăn Nhanh",
    description: "Các món ngon nhanh chóng",
    cover_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    service_id: 12,
  },
];

async function seedMenus(prisma) {
  console.log("Seeding menus...");
  await upsertMany(prisma, prisma.menu, menus, ["name", "service_id"]);
  console.log(`Seeded ${menus.length} menus`);
}

module.exports = { seedMenus };
