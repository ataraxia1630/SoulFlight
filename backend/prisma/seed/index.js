const prisma = require("../middleware");
const { seedStayTags } = require("./stay.tags");
const { seedFnbTags } = require("./fnb.tags");

async function main() {
  console.log("Starting seed...");

  await seedStayTags(prisma);
  await seedFnbTags(prisma);

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
