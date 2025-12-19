const prisma = require("../middleware");

const { seedUsers } = require("./users");
const { seedProviders } = require("./providers");
const { seedTravelers } = require("./travelers");
const { seedServiceTypes } = require("./service_types");
const { seedServices } = require("./services");
const { seedStayTags } = require("./stay.tags");
const { seedFnbTags } = require("./fnb.tags");
const { seedTourTags } = require("./tour.tags");
const { seedServiceOnTags } = require("./service_tags");
const { seedFacilities } = require("./facilities");
const { seedRooms } = require("./rooms");
const { seedRoomFacilities } = require("./room_facilities");
const { seedImages } = require("./images");
const { seedMenus } = require("./menus");
const { seedMenuItems } = require("./menu_items");
const { seedPlaces } = require("./places");
const { seedTourGuides } = require("./tour_guides");
const { seedTours } = require("./tours");
const { seedTourPlaces } = require("./tour_places");
const { seedTickets } = require("./tickets");
const { seedVouchers } = require("./vouchers");

async function main() {
  console.log("Starting seed...");

  // 1. Users (no dependencies)
  const { providerUsers, travelerUsers } = await seedUsers(prisma);

  // 2. Providers & Travelers (depend on Users)
  await seedProviders(prisma, providerUsers);
  await seedTravelers(prisma, travelerUsers);

  // 3. Service Types & Tags (no dependencies)
  await seedServiceTypes(prisma);
  await seedStayTags(prisma);
  await seedFnbTags(prisma);
  await seedTourTags(prisma);

  // 4. Services (depend on Providers & ServiceTypes)
  await seedServices(prisma);

  // 5. Service-Tag associations (depend on Services & Tags)
  await seedServiceOnTags(prisma);

  // 6. Facilities (no dependencies)
  await seedFacilities(prisma);

  // 7. Rooms (depend on Services)
  await seedRooms(prisma);

  // 12. Places (no dependencies)
  await seedPlaces(prisma);

  // 8. Room-Facility associations (depend on Rooms & Facilities)
  await seedRoomFacilities(prisma);

  // 9. Images (depend on Rooms)
  await seedImages(prisma);

  // 10. Menus (depend on Services)
  await seedMenus(prisma);

  // 11. Menu Items (depend on Menus)
  await seedMenuItems(prisma);

  // 13. Tour Guides (no dependencies)
  await seedTourGuides(prisma);

  // 14. Tours (depend on Services & Tour Guides)
  await seedTours(prisma);

  // 15. Tour-Place associations (depend on Tours & Places)
  await seedTourPlaces(prisma);

  // 16. Tickets (depend on Services & Places)
  await seedTickets(prisma);

  // 17. Vouchers (depend on Services)
  await seedVouchers(prisma);

  console.log("All seeds completed!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
