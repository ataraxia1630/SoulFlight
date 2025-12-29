import api from "@/shared/utils/axiosInstance";

const API_BASE_URL = "/api/room";

const RoomService = {
  getAll: async () => {
    const response = await api.get(`${API_BASE_URL}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${API_BASE_URL}/${id}`);
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

  checkAvailability: async (roomId, checkIn, checkOut, quantity = 1) => {
    const response = await api.get(`${API_BASE_URL}/${roomId}/availability`, {
      params: { checkIn, checkOut, quantity },
    });
    return response.data;
  },

  bookRoom: async (data) => {
    const response = await api.post("api/booking/direct/room", data);
    return response.data;
  },
};

export default RoomService;
