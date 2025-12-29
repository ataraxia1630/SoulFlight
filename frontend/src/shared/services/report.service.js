import api from "@/shared/utils/axiosInstance";

const BASE = "/api/report";

const ReportService = {
  create: async (data) => {
    const response = await api.post(BASE, data);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get(BASE);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${BASE}/${id}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`${BASE}/${id}/status`, { status });
    return response.data;
  },
};

export default ReportService;
