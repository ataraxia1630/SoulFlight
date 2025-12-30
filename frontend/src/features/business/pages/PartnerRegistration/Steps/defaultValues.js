export const defaultFormValues = {
  model: "",
  serviceName: "",
  description: "",
  location: { lat: 10.7769, lng: 106.7009 }, // Ho Chi Minh City default
  formattedAddress: "",
  tags: [],
  modelTag: "",

  // Stay model
  rooms: [],

  // Tour model
  tours: [],

  // F&B model
  menus: [],

  // Leisure model
  tickets: [],
};

// Room defaults
export const defaultRoom = {
  name: "",
  description: "",
  price: "",
  totalRooms: 1,
  bedCount: 1,
  guestAdult: 2,
  guestChild: 0,
  petAllowed: false,
  size: "",
  viewType: "",
  images: [],
};

// Tour defaults
export const defaultTour = {
  name: "",
  description: "",
  price: "",
  startTime: null,
  endTime: null,
  maxParticipants: 10,
  places: [],
  images: [],
};

// Menu defaults
export const defaultMenu = {
  name: "",
  description: "",
  coverImage: "",
  items: [],
};

// MenuItem defaults
export const defaultMenuItem = {
  name: "",
  description: "",
  price: "",
  unit: "PORTION",
  image: "",
};

// Ticket defaults
export const defaultTicket = {
  name: "",
  description: "",
  price: "",
  placeId: null,
};

// Context defaults
export const defaultContextValues = {
  services: [],
};
