const bcrypt = require("bcrypt");
const { upsertMany } = require("./utils/upsertMany");

const users = [
  // Admin
  {
    username: "admin",
    password: "admin123",
    name: "Admin User",
    email: "admin@travel.com",
    phone: "+84901234567",
    status: "ACTIVE",
    is_admin: true,
  },

  // Providers
  {
    username: "sunrise_hotel",
    password: "provider123",
    name: "Sunrise Hotel Group",
    email: "contact@sunrisehotel.vn",
    phone: "+84912345678",
    status: "ACTIVE",
  },
  {
    username: "mekong_tours",
    password: "provider123",
    name: "Mekong Discovery Tours",
    email: "info@mekongdiscovery.vn",
    phone: "+84923456789",
    status: "ACTIVE",
  },
  {
    username: "pho_corner",
    password: "provider123",
    name: "Pho Corner Restaurant",
    email: "hello@phocorner.vn",
    phone: "+84934567890",
    status: "ACTIVE",
  },

  // Travelers
  {
    username: "john_doe",
    password: "traveler123",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+84945678901",
    status: "ACTIVE",
  },
  {
    username: "jane_smith",
    password: "traveler123",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+84956789012",
    status: "ACTIVE",
  },
  {
    username: "mike_johnson",
    password: "traveler123",
    name: "Mike Johnson",
    email: "mike.j@email.com",
    phone: "+84967890123",
    status: "ACTIVE",
  },
];

async function seedUsers(prisma) {
  console.log("Seeding users...");

  await upsertMany(prisma, prisma.user, users, ["email"], async (item) => ({
    ...item,
    password: bcrypt.hashSync(item.password, 10),
  }));

  const providerUsers = await prisma.user.findMany({
    where: { email: { in: users.slice(1, 4).map((u) => u.email) } },
  });

  const travelerUsers = await prisma.user.findMany({
    where: { email: { in: users.slice(4).map((u) => u.email) } },
  });

  console.log(`Seeded ${users.length} users`);
  return { providerUsers, travelerUsers };
}

module.exports = { seedUsers };
