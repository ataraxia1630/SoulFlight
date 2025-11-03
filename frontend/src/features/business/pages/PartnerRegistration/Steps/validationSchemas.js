import * as yup from "yup";

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
});
