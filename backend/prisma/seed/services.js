const { upsertMany } = require("./utils/upsertMany");

const services = [
  // Accommodation services (provider_id: 2)
  {
    id: 1,
    name: "Sunrise Grand Hotel",
    description: "Luxury 5-star hotel in the heart of Saigon with rooftop pool and spa",
    location: "123 Nguyen Hue, District 1, HCMC",
    rating: 4.8,
    type_id: 1,
    provider_id: 2,
  },
  {
    id: 2,
    name: "Sunrise Beach Resort",
    description: "Beachfront paradise with private beach access and water sports",
    location: "Bai Truong Beach, Phu Quoc",
    rating: 4.9,
    type_id: 1,
    provider_id: 2,
  },
  {
    id: 3,
    name: "Sunrise Boutique Hotel",
    description: "Charming boutique hotel with traditional Vietnamese design",
    location: "45 Phan Boi Chau, Hoi An",
    rating: 4.7,
    type_id: 1,
    provider_id: 2,
  },
  {
    id: 4,
    name: "Sunrise Mountain Lodge",
    description: "Peaceful mountain retreat with valley views",
    location: "Sapa, Lao Cai",
    rating: 4.6,
    type_id: 1,
    provider_id: 2,
  },
  {
    id: 5,
    name: "Sunrise City Apartments",
    description: "Modern serviced apartments for extended stays",
    location: "District 2, HCMC",
    rating: 4.5,
    type_id: 1,
    provider_id: 2,
  },

  // F&B services (provider_id: 4)
  {
    id: 6,
    name: "Pho Corner Central",
    description: "Authentic Vietnamese pho with 50+ years of family recipe",
    location: "789 Le Loi, District 3, HCMC",
    rating: 4.7,
    type_id: 2,
    provider_id: 4,
  },
  {
    id: 7,
    name: "Pho Corner Bistro",
    description: "Modern Vietnamese cuisine with traditional flavors",
    location: "12 Dong Khoi, District 1, HCMC",
    rating: 4.6,
    type_id: 2,
    provider_id: 4,
  },
  {
    id: 8,
    name: "Pho Corner Rooftop",
    description: "Fine dining Vietnamese with stunning city views",
    location: "56 Nguyen Hue, District 1, HCMC",
    rating: 4.8,
    type_id: 2,
    provider_id: 4,
  },
  {
    id: 9,
    name: "Pho Corner Coffee",
    description: "Specialty coffee shop with Vietnamese coffee culture",
    location: "23 Pasteur, District 1, HCMC",
    rating: 4.5,
    type_id: 2,
    provider_id: 4,
  },
  {
    id: 10,
    name: "Pho Corner Street Food",
    description: "Authentic street food experience in cozy setting",
    location: "89 Bui Vien, District 1, HCMC",
    rating: 4.4,
    type_id: 2,
    provider_id: 4,
  },

  // Tours & Activities (provider_id: 3)
  {
    id: 11,
    name: "Mekong Delta Discovery",
    description: "Full-day tour exploring Cai Rang floating market and local villages",
    location: "Cần Thơ",
    rating: 4.9,
    type_id: 3,
    provider_id: 3,
  },
  {
    id: 12,
    name: "Sunset River Cruise",
    description: "Romantic evening cruise on Mekong River with dinner and live music",
    location: "Bến Tre",
    rating: 4.8,
    type_id: 3,
    provider_id: 3,
  },
  {
    id: 13,
    name: "Cycling Through Villages",
    description: "Explore rural Mekong life by bicycle with local guide",
    location: "Vĩnh Long",
    rating: 4.7,
    type_id: 3,
    provider_id: 3,
  },

  // Attractions (provider_id: 3)
  {
    id: 14,
    name: "Sam Mountain Experience",
    description: "Cable car ride and temple visits on sacred Sam Mountain",
    location: "Châu Đốc, An Giang",
    rating: 4.6,
    type_id: 4,
    provider_id: 3,
  },
  {
    id: 15,
    name: "Tra Su Cajuput Forest",
    description: "Bird sanctuary and mangrove forest exploration in Tra Su",
    location: "Tịnh Biên, An Giang",
    rating: 4.8,
    type_id: 4,
    provider_id: 3,
  },
];

async function seedServices(prisma) {
  console.log("Seeding services...");
  await upsertMany(prisma, prisma.service, services, ["id"]);
  console.log(`Seeded ${services.length} services`);
}

module.exports = { seedServices };
