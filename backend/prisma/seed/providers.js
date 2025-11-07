const { upsertMany } = require("./utils/upsertMany");

async function seedProviders(prisma, providerUsers) {
  console.log("Seeding providers...");

  const providers = [
    {
      id: providerUsers[0].id,
      description: "Luxury hotel chain providing world-class accommodation services across Vietnam",
      logo_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      website_link: "https://sunrisehotel.vn",
      address: "123 Nguyen Hue, District 1, Ho Chi Minh City",
      id_card: "079123456789",
      province: "Ho Chi Minh City",
      country: "Vietnam",
      establish_year: 2010,
    },
    {
      id: providerUsers[1].id,
      description: "Authentic Mekong Delta tours with local experiences and cultural immersion",
      logo_url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
      website_link: "https://mekongdiscovery.vn",
      address: "456 Tran Hung Dao, Chau Doc, An Giang",
      id_card: "089234567890",
      province: "An Giang",
      country: "Vietnam",
      establish_year: 2015,
    },
    {
      id: providerUsers[2].id,
      description:
        "Traditional Vietnamese cuisine with modern twist, specializing in authentic pho",
      logo_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      website_link: "https://phocorner.vn",
      address: "789 Le Loi, District 3, Ho Chi Minh City",
      id_card: "079345678901",
      province: "Ho Chi Minh City",
      country: "Vietnam",
      establish_year: 2018,
    },
  ];

  await upsertMany(prisma, prisma.provider, providers, ["id"]);
  console.log(`Seeded ${providers.length} providers`);
}

module.exports = { seedProviders };
