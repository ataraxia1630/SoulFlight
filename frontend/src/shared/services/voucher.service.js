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

  getVouchers: async (params) => {
    try {
      const response = await api.get(`${API_BASE_URL}/provider/my`, {
        params,
      });
      console.log("Fetched vouchers:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  createVoucher: async (voucherData) => {
    try {
      const response = await api.post(`${API_BASE_URL}/provider`, voucherData);
      console.log("Created voucher:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating voucher:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  updateVoucher: async (id, voucherData) => {
    try {
      console.log("Updating voucher with data:", voucherData);
      const response = await api.patch(`${API_BASE_URL}/provider/${id}`, voucherData);
      console.log("Updated voucher:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating voucher:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  deleteVoucher: async (id) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/provider/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting voucher:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  getVoucherStats: async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/provider/${id}/stats`);
      return response.data;
    } catch (error) {
      console.error("Error fetching voucher stats:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  getVouchersAdmin: async (params) => {
    try {
      const response = await api.get(`${API_BASE_URL}/admin/all`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching vouchers (admin):", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  createVoucherAdmin: async (voucherData) => {
    try {
      const response = await api.post(`${API_BASE_URL}/admin`, voucherData);
      return response.data;
    } catch (error) {
      console.error("Error creating voucher (admin):", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  updateVoucherAdmin: async (id, voucherData) => {
    try {
      const response = await api.patch(`${API_BASE_URL}/admin/${id}`, voucherData);
      return response.data;
    } catch (error) {
      console.error("Error updating voucher (admin):", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  deleteVoucherAdmin: async (id) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/admin/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting voucher (admin):", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  getVoucherStatsAdmin: async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/admin/${id}/stats`);
      return response.data;
    } catch (error) {
      console.error("Error fetching voucher stats (admin):", error);
      throw new Error(error.response?.data?.message || error);
    }
  },
};
