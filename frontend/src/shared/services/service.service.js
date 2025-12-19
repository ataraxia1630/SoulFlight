import axios from "axios";

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/service`;

const ServiceService = {
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },
};

export default ServiceService;
