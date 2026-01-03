import api from "@/shared/utils/axiosInstance";

const API_BASE_URL = "/api/booking";

export const bookingAPI = {
  createFromCart: async (vouchers) => {
    try {
      const response = await api.post(API_BASE_URL, { vouchers });
      console.log("Created booking from cart:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating booking from cart:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  getMyBookings: async (params) => {
    try {
      const response = await api.get(`${API_BASE_URL}/my`, { params });
      console.log("Fetched my bookings:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching my bookings:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  getBookingDetail: async (bookingId) => {
    try {
      const response = await api.get(`${API_BASE_URL}/my/${bookingId}`);
      console.log("Fetched booking detail:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching booking detail:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  applyVoucherToBooking: async (bookingId, code) => {
    try {
      const response = await api.patch(`${API_BASE_URL}/my/${bookingId}`, {
        voucherCode: code,
      });
      console.log("Applied voucher to booking:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error applying voucher to booking:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  saveGuestInfo: async (bookingId, guestInfo) => {
    try {
      const response = await api.patch(`${API_BASE_URL}/my/${bookingId}`, {
        notes: guestInfo,
      });
      console.log("Saved guest info for booking:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error saving guest info for booking:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  cancelBooking: async (bookingId, reason) => {
    return await api.post(`${API_BASE_URL}/my/${bookingId}/cancel`, {
      reason,
    });
  },

  getProviderBookings: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/provider`);
      console.log("Fetched provider bookings:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching provider bookings:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  getProviderBookingDetail: async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/provider/${id}`);
      console.log("Fetched provider booking detail:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching provider booking detail:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  updateBookingStatus: async (id, status, note) => {
    try {
      const response = await api.patch(`${API_BASE_URL}/provider/${id}/status`, {
        status,
        note,
      });
      console.log("Updated booking status:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  // === ADMIN ===
  getAdminBookings: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/admin`);
      console.log("Fetched admin bookings:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching admin bookings:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  getAdminBookingDetail: async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/admin/${id}`);
      console.log("Fetched admin booking detail:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching admin booking detail:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  adminForceUpdateStatus: async (id, status, note) => {
    try {
      const response = await api.patch(`${API_BASE_URL}/admin/${id}/status`, {
        status,
        note,
      });
      console.log("Admin updated booking status:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error admin updating booking status:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },
};
