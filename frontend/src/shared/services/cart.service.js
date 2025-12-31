import api from "@/shared/utils/axiosInstance";

const API_BASE_URL = "/api/cart";

export const CartService = {
  getCart: async () => {
    const response = await api.get(API_BASE_URL);
    return response.data;
  },

  addToCart: async (item) => {
    try {
      const response = await api.post(API_BASE_URL, item);
      console.log("Add to cart response:", response);
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  updateCartItem: async (itemId, data) => {
    try {
      const response = await api.patch(`${API_BASE_URL}/${itemId}`, data);
      console.log("Update cart item response:", response);
      return response.data;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  removeFromCart: async (itemId) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/${itemId}`);
      console.log("Remove from cart response:", response);
      return response.data;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  clearCart: async () => {
    try {
      const response = await api.delete(API_BASE_URL);
      console.log("Clear cart response:", response);
      return response.data;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },
};
