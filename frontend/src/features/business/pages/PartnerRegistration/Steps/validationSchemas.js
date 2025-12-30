import * as yup from "yup";

// Room validation
const roomSchema = yup.object({
  name: yup.string().required("Tên phòng là bắt buộc"),
  description: yup.string().nullable(),
  price: yup
    .number()
    .transform((value, originalValue) => {
      // Nếu empty string hoặc null/undefined → return undefined
      if (originalValue === "" || originalValue == null) return undefined;
      return value;
    })
    .positive("Giá phải lớn hơn 0")
    .required("Giá phòng là bắt buộc"),
  totalRooms: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue == null) return 1;
      return value;
    })
    .min(1, "Ít nhất 1 phòng")
    .default(1),
  bedCount: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue == null) return undefined;
      return value;
    })
    .min(1, "Ít nhất 1 giường")
    .required("Số giường là bắt buộc"),
  guestAdult: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue == null) return undefined;
      return value;
    })
    .min(1, "Ít nhất 1 người lớn")
    .required("Số người lớn là bắt buộc"),
  guestChild: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue == null) return 0;
      return value;
    })
    .min(0)
    .default(0),
  petAllowed: yup.boolean().default(false),
  viewType: yup.string().nullable().optional(),
  images: yup
    .array()
    .of(yup.string())
    .min(1, "Cần ít nhất 1 ảnh phòng")
    .required("Hình ảnh là bắt buộc"),
});

// Tour Place validation
const tourPlaceSchema = yup.object({
  place_id: yup.number().required("Place is required").nullable(),
  description: yup.string(),
  start_time: yup.string(),
  end_time: yup.string(),
});

// Tour validation
const tourSchema = yup.object({
  name: yup.string().required("Tour name is required"),
  description: yup.string(),
  price: yup.number().positive("Price must be > 0").required("Price is required"),
  startTime: yup.date().required("Start time is required").nullable(),
  endTime: yup
    .date()
    .required("End time is required")
    .nullable()
    .test("is-after-start", "End time must be after start time", function (value) {
      const { startTime } = this.parent;
      if (!startTime || !value) return true;
      return new Date(value) > new Date(startTime);
    }),
  maxParticipants: yup.number().min(1, "At least 1 participant").required(),
  places: yup.array().of(tourPlaceSchema),
  images: yup.array().of(yup.string()),
});

// Menu Item validation
const menuItemSchema = yup.object({
  name: yup.string().required("Item name is required"),
  description: yup.string(),
  price: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? undefined : value))
    .positive("Price must be > 0")
    .required("Price is required"),
  unit: yup.string().required("Unit is required"),
  image: yup.string().nullable(),
});

// Menu validation
const menuSchema = yup.object({
  name: yup.string().required("Menu name is required"),
  description: yup.string(),
  coverImage: yup.string().nullable(),
  items: yup.array().of(menuItemSchema).min(1, "Add at least 1 item to this menu"),
});

// Ticket validation
const ticketSchema = yup.object({
  name: yup.string().required("Ticket name is required"),
  description: yup.string(),
  price: yup.number().positive("Price must be > 0").required("Price is required"),
  placeId: yup.number().required("Place selection is required").nullable(),
});

// Full schema
export const fullSchema = yup.object({
  model: yup.string().required("Service model is required"),
  serviceName: yup.string().required("Service name is required"),
  description: yup.string(),
  location: yup
    .object({
      lat: yup.number().required(),
      lng: yup.number().required(),
    })
    .required("Location is required"),
  formattedAddress: yup.string(),
  modelTag: yup.string(),
  tags: yup.array(),

  // Conditional validations based on model
  rooms: yup.array().when("model", {
    is: "stay",
    then: (schema) => schema.of(roomSchema).min(1, "At least 1 room required"),
    otherwise: (schema) => schema,
  }),

  tours: yup.array().when("model", {
    is: "tour",
    then: (schema) => schema.of(tourSchema).min(1, "At least 1 tour required"),
    otherwise: (schema) => schema,
  }),

  menus: yup.array().when("model", {
    is: "fnb",
    then: (schema) => schema.of(menuSchema).min(1, "At least 1 menu is required"),
    otherwise: (schema) => schema,
  }),

  tickets: yup.array().when("model", {
    is: "leisure",
    then: (schema) => schema.of(ticketSchema).min(1, "At least 1 ticket type required"),
    otherwise: (schema) => schema,
  }),
});
