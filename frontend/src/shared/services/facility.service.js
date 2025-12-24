import api from "@/shared/utils/axiosInstance";

const API_BASE_URL = "/api/facility";

const FacilityService = {
  getAll: async () => {
    const response = await api.get(`${API_BASE_URL}`);
    return response.data.data;
  },

  create: async (formData) => {
    const data = new FormData();
    data.append("name", formData.name);

    if (formData.file) {
      data.append("icon_url", formData.file);
    } else if (formData.icon_url) {
      data.append("icon_url", formData.icon_url);
    }

    const response = await api.post(API_BASE_URL, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  },

  update: async (id, formData) => {
    const data = new FormData();
    data.append("name", formData.name);

    if (formData.file) {
      data.append("icon_url", formData.file);
    } else if (formData.icon_url) {
      data.append("icon_url", formData.icon_url);
    }

    const response = await api.put(`${API_BASE_URL}/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  },

  delete: async (id) => {
    await api.delete(`${API_BASE_URL}/${id}`);
  },
};

export default FacilityService;
