const { upsertMany } = require("./utils/upsertMany");

const menuItems = [
  // Thực Đơn Phở Truyền Thống
  {
    name: "Phở Bò",
    description: "Phở bò truyền thống với bánh mì và rau thơm",
    image_url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43",
    price: 65000,
    unit: "BOWL",
    status: "AVAILABLE",
    menu_id: 1,
  },
  {
    name: "Phở Gà",
    description: "Phở gà nhẹ với thịt mềm",
    image_url: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb",
    price: 60000,
    unit: "BOWL",
    status: "AVAILABLE",
    menu_id: 1,
  },
  {
    name: "Phở Tái",
    description: "Phở với thịt bò tái mỏng",
    image_url: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1",
    price: 70000,
    unit: "BOWL",
    status: "AVAILABLE",
    menu_id: 1,
  },

  // Đồ Ăn Kèm
  {
    name: "Nem Cuốn",
    description: "Nem rán giòn với thịt lợn và rau",
    image_url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb",
    price: 45000,
    unit: "PORTION",
    status: "AVAILABLE",
    menu_id: 2,
  },
  {
    name: "Gỏi Cuốn",
    description: "Nem tươi với tôm và rau thơm",
    image_url: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087",
    price: 40000,
    unit: "PORTION",
    status: "AVAILABLE",
    menu_id: 2,
  },

  // Món Ăn Fusion
  {
    name: "Bát Phở Fusion",
    description: "Phở hiện đại với nguyên liệu quốc tế",
    image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624",
    price: 120000,
    unit: "BOWL",
    status: "AVAILABLE",
    menu_id: 3,
  },
  {
    name: "Thịt Bò Tái Chanh",
    description: "Thịt bò tái với gia vị Việt và cơm nóng",
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947",
    price: 150000,
    unit: "DISH",
    status: "AVAILABLE",
    menu_id: 3,
  },
  {
    name: "Bánh Mì Burger",
    description: "Bánh mì Việt Nam hòa quyện với burger tinh tế",
    image_url: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90",
    price: 135000,
    unit: "PIECE",
    status: "AVAILABLE",
    menu_id: 3,
  },

  // Lựa Chọn Cao Cấp
  {
    name: "Phở Wagyu",
    description: "Phở cao cấp với thịt wagyu",
    image_url: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841",
    price: 280000,
    unit: "BOWL",
    status: "AVAILABLE",
    menu_id: 4,
  },
  {
    name: "Nem Tôm Hùm",
    description: "Tôm hùm tươi trong nem rán",
    image_url: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7",
    price: 250000,
    unit: "PORTION",
    status: "AVAILABLE",
    menu_id: 4,
  },

  // Thực Đơn Ăn Uống Tinh Tế
  {
    name: "Bộ Tasting 7 Món",
    description: "Lựa chọn những món Việt tuyệt vời nhất của đầu bếp",
    image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    price: 850000,
    unit: "SET",
    status: "AVAILABLE",
    menu_id: 5,
  },
  {
    name: "Mâm Hải Sản Cao Cấp",
    description: "Hải sản tươi chuẩn bị theo cách Việt",
    image_url: "https://images.unsplash.com/photo-1559737558-2f5a932e5f61",
    price: 680000,
    unit: "DISH",
    status: "AVAILABLE",
    menu_id: 5,
  },

  // Rượu Vang & Cocktail
  {
    name: "Cocktail Hoàng Hôn Sài Gòn",
    description: "Cocktail đặc biệt với trái cây địa phương",
    image_url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b",
    price: 180000,
    unit: "GLASS",
    status: "AVAILABLE",
    menu_id: 6,
  },
  {
    name: "Rượu Vang Đỏ Pháp",
    description: "Lựa chọn rượu vang đỏ Pháp tinh lọc",
    image_url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3",
    price: 450000,
    unit: "BOTTLE",
    status: "AVAILABLE",
    menu_id: 6,
  },

  // Lựa Chọn Cà Phê
  {
    name: "Cà Phê Sữa Đá",
    description: "Cà phê Việt nam lạnh với sữa đặc",
    image_url: "https://images.unsplash.com/photo-1611162458324-aae1eb4129a2",
    price: 35000,
    unit: "GLASS",
    status: "AVAILABLE",
    menu_id: 7,
  },
  {
    name: "Cà Phê Trứng",
    description: "Cà phê trứng truyền thống Hà Nội",
    image_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699",
    price: 45000,
    unit: "CUP",
    status: "AVAILABLE",
    menu_id: 7,
  },

  // Bánh & Tráng Miệng
  {
    name: "Bánh Flan",
    description: "Bánh trứng kiểu Việt",
    image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777",
    price: 25000,
    unit: "PIECE",
    status: "AVAILABLE",
    menu_id: 8,
  },
  {
    name: "Bánh Croissant",
    description: "Bánh croissant bơ mềm",
    image_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a",
    price: 30000,
    unit: "PIECE",
    status: "AVAILABLE",
    menu_id: 8,
  },

  // Các Món Ăn Đường Phố
  {
    name: "Bánh Mì Thịt",
    description: "Bánh mì Việt với thịt lợn và pâté",
    image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
    price: 30000,
    unit: "PIECE",
    status: "AVAILABLE",
    menu_id: 9,
  },
  {
    name: "Bún Chả",
    description: "Thịt lợn nướng với bánh hỏi",
    image_url: "https://images.unsplash.com/photo-1559314809-0d155014e29e",
    price: 55000,
    unit: "BOWL",
    status: "AVAILABLE",
    menu_id: 9,
  },
];

async function seedMenuItems(prisma) {
  console.log("Seeding menu items...");
  await upsertMany(prisma, prisma.menuItem, menuItems, ["name", "menu_id"]);
  console.log(`Seeded ${menuItems.length} menu items`);
}

module.exports = { seedMenuItems };
