import api from "@/shared/utils/axiosInstance";

const API_BASE_URL = "/api/menu";

const MenuService = {
  getAll: async () => {
    const response = await api.get(`${API_BASE_URL}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    console.log(response.data);
    return response.data;
  },

  getByService: async (serviceId) => {
    const response = await api.get(`${API_BASE_URL}/service/${serviceId}`);
    return response.data;
  },

  getByProvider: async (providerId) => {
    const response = await api.get(`${API_BASE_URL}/provider/${providerId}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  bookMenu: async (data) => {
    try {
      const response = await api.post("api/booking/direct/menu", data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error booking menu:", error);
      throw error;
    }
  },
};

export default MenuService;
