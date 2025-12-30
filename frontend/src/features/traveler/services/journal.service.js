import api from "@/shared/utils/axiosInstance";

const BASE = "/api/journal";

const JournalService = {
  getMyJournals: async () => {
    const response = await api.get(BASE);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${BASE}/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post(BASE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`${BASE}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${BASE}/${id}`);
    return response.data;
  },
};

export default JournalService;
