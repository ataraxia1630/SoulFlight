import api from "@/shared/utils/axiosInstance";

const API_URL = "/api/service";

const ServiceService = {
  getAll: async () => {
    const response = await api.get(API_URL);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },
};

export default ServiceService;
