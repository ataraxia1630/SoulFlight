import api from "@/shared/utils/axiosInstance";

const API_BASE_URL = "/api/voucher";

export const voucherAPI = {
  getAvailableVouchers: async (serviceId) => {
    const response = await api.get(API_BASE_URL, { params: { serviceId } });
    return response.data;
  },

  checkVoucher: async (code, serviceId, totalAmount) => {
    try {
      const response = await api.post(`${API_BASE_URL}/check`, {
        code,
        serviceId,
        totalAmount,
      });
      console.log("Voucher check response:", response.data);
      return response.data.data.voucher;
    } catch (error) {
      console.error("Error checking voucher:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },
};
