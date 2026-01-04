import api from "@/shared/utils/axiosInstance";

const API_BASE_URL = "/api/statistic";

export const statisticAPI = {
  getStatistics: async (params = {}) => {
    try {
      const response = await api.get(API_BASE_URL, { params });
      console.log("Statistics response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};
