import api from "@/shared/utils/axiosInstance";

const API_BASE_URL = "/api/ticket";

const TicketService = {
  getAll: async () => {
    const response = await api.get(`${API_BASE_URL}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    console.log("TicketService.getById response:", response.data);
    return response.data;
  },

  getByService: async (serviceId) => {
    const response = await api.get(`${API_BASE_URL}/service/${serviceId}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  checkAvailability: async (ticketId, visitDate, quantity = 1) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${ticketId}/availability`, {
        params: { visitDate, quantity },
      });
      console.log("TicketService.checkAvailability response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in TicketService.checkAvailability:", error);
      throw error;
    }
  },

  bookTicket: async (data) => {
    const response = await api.post("api/booking/direct/ticket", data);
    return response.data;
  },
};

export default TicketService;
