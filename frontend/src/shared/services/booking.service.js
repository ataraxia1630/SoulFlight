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
    return await api.get(`${API_BASE_URL}/my`, { params });
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
};
