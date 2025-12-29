import api from "@/shared/utils/axiosInstance";

const API_BASE_URL = "/api/tour";

const TourService = {
  getAll: async () => {
    const response = await api.get(`${API_BASE_URL}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    console.log("TourService.getById response:", response.data);
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

  checkAvailability: async (tourId, quantity = 1) => {
    const response = await api.get(`${API_BASE_URL}/${tourId}/availability`, {
      params: { quantity },
    });
    return response.data;
  },

  bookTour: async (data) => {
    try {
      const response = await api.post("api/booking/direct/tour", data);
      console.log("TourService.bookTour response:", response.data);
      return response.data;
    } catch (error) {
      console.error("TourService.bookTour error:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },
};

export default TourService;
