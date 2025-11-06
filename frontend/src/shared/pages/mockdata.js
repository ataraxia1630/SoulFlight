export const mockExploreResults = {
  services: [
    {
      id: 1,
      name: "Sunset Beach Resort & Spa",
      description: "Luxury beachfront resort with world-class amenities",
      location: "Nha Trang, Vietnam",
      rating: 4.8,
      type: "Resort",
      provider: { name: "VN Hospitality Group" },
      price_range: "₫2.500.000 - ₫8.000.000",
      tags: [
        { name: "Beach", category: "location" },
        { name: "Luxury", category: "type" },
        { name: "Spa", category: "amenity" },
      ],
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    },
    {
      id: 2,
      name: "Mountain View Hotel",
      description: "Cozy mountain retreat with stunning views",
      location: "Da Lat, Vietnam",
      rating: 4.6,
      type: "Hotel",
      provider: { name: "Highland Hotels" },
      price_range: "₫1.200.000 - ₫3.500.000",
      tags: [
        { name: "Mountain", category: "location" },
        { name: "Nature", category: "type" },
        { name: "Romantic", category: "atmosphere" },
      ],
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    },
    {
      id: 3,
      name: "City Center Business Hotel",
      description: "Modern hotel in the heart of the city",
      location: "Ho Chi Minh City, Vietnam",
      rating: 4.5,
      type: "Hotel",
      provider: { name: "Metro Hotels" },
      price_range: "₫800.000 - ₫2.000.000",
      tags: [
        { name: "City Center", category: "location" },
        { name: "Business", category: "type" },
        { name: "WiFi", category: "amenity" },
      ],
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    },
  ],
  rooms: [
    {
      id: 1,
      name: "Deluxe Ocean View Suite",
      price_per_night: 3500000,
      pet_allowed: false,
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
      facilities: ["King Bed", "Ocean View", "Balcony", "Mini Bar", "WiFi"],
      service: {
        id: 1,
        name: "Sunset Beach Resort & Spa",
        tags: [
          { name: "Beach", category: "location" },
          { name: "Luxury", category: "type" },
        ],
      },
    },
    {
      id: 2,
      name: "Family Garden Room",
      price_per_night: 2200000,
      pet_allowed: true,
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
      facilities: ["2 Queen Beds", "Garden View", "Pet Friendly", "WiFi"],
      service: {
        id: 2,
        name: "Mountain View Hotel",
        tags: [
          { name: "Mountain", category: "location" },
          { name: "Family", category: "type" },
        ],
      },
    },
    {
      id: 3,
      name: "Standard Business Room",
      price_per_night: 1200000,
      pet_allowed: false,
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
      facilities: ["Queen Bed", "Work Desk", "WiFi", "Coffee Maker"],
      service: {
        id: 3,
        name: "City Center Business Hotel",
        tags: [
          { name: "City Center", category: "location" },
          { name: "Business", category: "type" },
        ],
      },
    },
  ],
  menus: [
    {
      id: 1,
      name: "Sunset Dining Experience",
      cover: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
      items: [
        { name: "Grilled Lobster", price: 850000, unit: "portion" },
        { name: "Wagyu Steak", price: 1200000, unit: "200g" },
        { name: "Fresh Oysters", price: 450000, unit: "6 pcs" },
      ],
      service: {
        id: 1,
        name: "Sunset Beach Resort & Spa",
        tags: [
          { name: "Fine Dining", category: "type" },
          { name: "Seafood", category: "cuisine" },
        ],
      },
    },
    {
      id: 2,
      name: "Mountain Coffee & Brunch",
      cover: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
      items: [
        { name: "Eggs Benedict", price: 180000, unit: "portion" },
        { name: "Avocado Toast", price: 150000, unit: "portion" },
        { name: "Specialty Coffee", price: 80000, unit: "cup" },
      ],
      service: {
        id: 2,
        name: "Mountain View Hotel",
        tags: [
          { name: "Cafe", category: "type" },
          { name: "Brunch", category: "meal" },
        ],
      },
    },
  ],
  tickets: [
    {
      id: 1,
      name: "VIP Theme Park Access",
      price: 550000,
      place: {
        name: "Vinpearl Land",
        image: "https://images.unsplash.com/photo-1594239419821-67f4c8c73100?w=800",
      },
      service: {
        id: 1,
        name: "Sunset Beach Resort & Spa",
        tags: [
          { name: "Entertainment", category: "type" },
          { name: "Family", category: "audience" },
        ],
      },
    },
    {
      id: 2,
      name: "Cable Car Round Trip",
      price: 280000,
      place: {
        name: "Ba Na Hills",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      },
      service: {
        id: 2,
        name: "Mountain View Hotel",
        tags: [
          { name: "Attraction", category: "type" },
          { name: "Scenic", category: "experience" },
        ],
      },
    },
  ],
  tours: [
    {
      id: 1,
      name: "Coastal Discovery Tour",
      total_price: 2500000,
      duration: "Full Day (8 hours)",
      places: ["Nha Trang Beach", "Po Nagar Cham Towers", "Long Son Pagoda"],
      service: {
        id: 1,
        name: "Sunset Beach Resort & Spa",
        tags: [
          { name: "Culture", category: "type" },
          { name: "Beach", category: "location" },
          { name: "Group", category: "size" },
        ],
      },
    },
    {
      id: 2,
      name: "Highland Adventure",
      total_price: 1800000,
      duration: "Half Day (4 hours)",
      places: ["Datanla Waterfall", "Truc Lam Monastery", "Tuyen Lam Lake"],
      service: {
        id: 2,
        name: "Mountain View Hotel",
        tags: [
          { name: "Nature", category: "type" },
          { name: "Adventure", category: "experience" },
          { name: "Private", category: "size" },
        ],
      },
    },
  ],
};
