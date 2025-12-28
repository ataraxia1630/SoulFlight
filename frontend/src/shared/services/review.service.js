import api from "@/shared/utils/axiosInstance";

const BASE = "/api/review";

const ReviewService = {
  getByService: async (serviceId) => {
    const response = await api.get(`${BASE}/service/${serviceId}`);
    return response.data;
  },

  getByDetail: async (filters) => {
    const response = await api.get(`${BASE}/detail`, { params: filters });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(BASE, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`${BASE}/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${BASE}/${id}`);
    return response.data;
  },
};

export default ReviewService;
