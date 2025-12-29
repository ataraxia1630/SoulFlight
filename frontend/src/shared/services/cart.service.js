import api from "@/shared/utils/axiosInstance";

const API_BASE_URL = "/api/cart";

export const CartService = {
  getCart: async () => {
    const response = await api.get(API_BASE_URL);
    return response.data;
  },

  addToCart: async (item) => {
    const response = await api.post(API_BASE_URL, item);
    return response.data;
  },

  updateCartItem: async (itemId, data) => {
    const response = await api.patch(`${API_BASE_URL}/${itemId}`, data);
    return response.data;
  },

  removeFromCart: async (itemId) => {
    const response = await api.delete(`${API_BASE_URL}/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete(API_BASE_URL);
    return response.data;
  },
};
