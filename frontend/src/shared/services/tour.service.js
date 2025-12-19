import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/api/tour`;

const TourService = {
  getByService: async (serviceId) => {
    const response = await axios.get(`${API_BASE_URL}/service/${serviceId}`);
    return response.data;
  },
};

export default TourService;
