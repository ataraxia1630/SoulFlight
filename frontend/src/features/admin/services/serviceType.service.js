import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/api/service-type`;

const ServiceTypeService = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data.data;
  },

  update: async (id, formData) => {
    const data = {
      name: formData.name,
      description: formData.description,
    };

    const response = await axios.put(`${API_BASE_URL}/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data.data;
  },
};

export default ServiceTypeService;
