import * as yup from "yup";

export const fullSchema = yup.object({
  // Step 1: Service Info
  serviceName: yup.string().required("Tên dịch vụ bắt buộc"),
  description: yup.string(),
  location: yup
    .object({
      lat: yup.number().required(),
      lng: yup.number().required(),
    })
    .required(),
  formattedAddress: yup.string(),

  //   // Step 2: Contact
  //   phone: yup.string().required('Số điện thoại bắt buộc'),
  //   email: yup.string().email('Email không hợp lệ'),

  //   // Step 3: Pricing
  //   price: yup.number().positive().required('Giá bắt buộc'),
  //   duration: yup.string().required(),
});
