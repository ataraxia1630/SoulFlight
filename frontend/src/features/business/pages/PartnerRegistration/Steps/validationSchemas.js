import * as yup from "yup";

const roomSchema = yup.object({
  name: yup.string().required("Tên phòng bắt buộc"),
  description: yup.string(),
  price: yup.number().positive("Giá phải > 0").required("Giá bắt buộc"),
  currency: yup.string().required(),
  bedCount: yup.number().min(1).required(),
  guestAdult: yup.number().min(1).required(),
  guestChild: yup.number().min(0),
  petAllowed: yup.boolean(),
  images: yup.array().min(1, "Cần ít nhất 1 ảnh"),
});

export const fullSchema = yup.object({
  serviceName: yup.string().required("Tên dịch vụ bắt buộc"),
  description: yup.string(),
  location: yup
    .object({
      lat: yup.number().required(),
      lng: yup.number().required(),
    })
    .required(),
  formattedAddress: yup.string(),

  tags: yup.array(),
  rooms: yup.array().of(roomSchema).min(1, "Cần ít nhất 1 phòng"),
});
