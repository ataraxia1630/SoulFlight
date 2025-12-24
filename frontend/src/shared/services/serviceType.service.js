import api from "@/shared/utils/axiosInstance";

const API_BASE_URL = "/api/service-type";

const ServiceTypeService = {
  getAll: async () => {
    const response = await api.get(`${API_BASE_URL}`);
    return response.data.data;
  },

  update: async (id, formData) => {
    const data = {
      name: formData.name,
      description: formData.description,
    };

    const response = await api.put(`${API_BASE_URL}/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data.data;
  },
};

export default ServiceTypeService;
