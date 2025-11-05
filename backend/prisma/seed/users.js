const bcrypt = require("bcrypt");
const { upsertMany } = require("./utils/upsertMany");

const users = [
  // Admin
  {
    id: 1,
    username: "admin",
    password: bcrypt.hashSync("admin123", 10),
    name: "Admin User",
    email: "admin@travel.com",
    phone: "+84901234567",
    status: "ACTIVE",
    is_admin: true,
  },

  // Providers
  {
    id: 2,
    username: "sunrise_hotel",
    password: bcrypt.hashSync("provider123", 10),
    name: "Sunrise Hotel Group",
    email: "contact@sunrisehotel.vn",
    phone: "+84912345678",
    status: "ACTIVE",
    is_admin: false,
  },
  {
    id: 3,
    username: "mekong_tours",
    password: bcrypt.hashSync("provider123", 10),
    name: "Mekong Discovery Tours",
    email: "info@mekongdiscovery.vn",
    phone: "+84923456789",
    status: "ACTIVE",
    is_admin: false,
  },
  {
    id: 4,
    username: "pho_corner",
    password: bcrypt.hashSync("provider123", 10),
    name: "Pho Corner Restaurant",
    email: "hello@phocorner.vn",
    phone: "+84934567890",
    status: "ACTIVE",
    is_admin: false,
  },

  // Travelers
  {
    id: 5,
    username: "john_doe",
    password: bcrypt.hashSync("traveler123", 10),
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+84945678901",
    status: "ACTIVE",
    is_admin: false,
  },
  {
    id: 6,
    username: "jane_smith",
    password: bcrypt.hashSync("traveler123", 10),
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+84956789012",
    status: "ACTIVE",
    is_admin: false,
  },
  {
    id: 7,
    username: "mike_johnson",
    password: bcrypt.hashSync("traveler123", 10),
    name: "Mike Johnson",
    email: "mike.j@email.com",
    phone: "+84967890123",
    status: "ACTIVE",
    is_admin: false,
  },
];

async function seedUsers(prisma) {
  console.log("Seeding users...");
  await upsertMany(prisma, prisma.user, users, ["id"]);
  console.log(`Seeded ${users.length} users`);
}

module.exports = { seedUsers };
