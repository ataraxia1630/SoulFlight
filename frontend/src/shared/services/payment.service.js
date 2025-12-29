import api from "@/shared/utils/axiosInstance";

const API_BASE_URL = "/api/payment";

export const paymentAPI = {
  createPayment: async (bookingIds, method) => {
    try {
      const response = await api.post(API_BASE_URL, { bookingIds, method });
      console.log("Created payment:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating payment:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  getPayment: async (paymentId) => {
    return await api.get(`${API_BASE_URL}/${paymentId}`);
  },

  getMyPayments: async (params) => {
    return await api.get(API_BASE_URL, { params });
  },
};
