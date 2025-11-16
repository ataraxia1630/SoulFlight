import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/api/service-tag`;

const ServiceTagService = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data.data;
  },

  create: async (formData) => {
    const data = {
      name: formData.name,
      category: formData.category,
    };

    const response = await axios.post(`${API_BASE_URL}`, data, {
      header: { "Content-Type": "application/json" },
    });

    return response.data.data;
  },

  update: async (id, formData) => {
    const data = {
      name: formData.name,
      category: formData.category,
    };

    const response = await axios.put(`${API_BASE_URL}/${id}`, data, {
      header: { "Content-Type": "application/json" },
    });
    return response.data.data;
  },

  delete: async (id) => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },
};

export default ServiceTagService;
