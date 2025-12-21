import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/api/ticket`;

const TicketService = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  getByService: async (serviceId) => {
    const response = await axios.get(`${API_BASE_URL}/service/${serviceId}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  },
};

export default TicketService;
