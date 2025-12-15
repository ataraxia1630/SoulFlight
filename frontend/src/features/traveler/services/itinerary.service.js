import api from "../../../shared/utils/axiosInstance";

export const itineraryAPI = {
  generate: async (data) => {
    const response = await api.post("/api/itinerary/generate", data);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await api.get("/api/itinerary", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/itinerary/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/api/itinerary/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/itinerary/${id}`);
    return response.data;
  },

  share: async (id, data) => {
    const response = await api.post(`/api/itinerary/${id}/share`, data);
    return response.data;
  },
};

export const activityAPI = {
  add: async (dayId, data) => {
    const response = await api.post(`/api/itinerary/day/${dayId}/activity`, data);
    return response.data;
  },

  update: async (activityId, data) => {
    const response = await api.patch(`/api/itinerary/activity/${activityId}`, data);
    return response.data;
  },

  delete: async (activityId) => {
    const response = await api.delete(`/api/itinerary/activity/${activityId}`);
    return response.data;
  },

  getAlternatives: async (activityId) => {
    const response = await api.post(`/api/itinerary/activity/${activityId}/alternatives`);
    return response.data;
  },

  replace: async (activityId, data) => {
    const response = await api.put(`/api/itinerary/activity/${activityId}/replace`, data);
    return response.data;
  },

  getReviews: async (activityId) => {
    const response = await api.get(`/api/itinerary/activity/${activityId}/reviews`);
    return response.data;
  },
};
