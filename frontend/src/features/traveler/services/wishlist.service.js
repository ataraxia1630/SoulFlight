import api from "@/shared/utils/axiosInstance";

const BASE = "/api/wishlist";

const WishlistService = {
  getWishlist: async () => {
    const response = await api.get(BASE);
    return response.data;
  },

  toggle: async (service_id) => {
    const response = await api.post(`${BASE}/toggle`, { service_id });
    return response.data;
  },
};

export default WishlistService;
