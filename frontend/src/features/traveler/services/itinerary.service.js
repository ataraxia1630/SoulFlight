import api from "../../../shared/utils/axiosInstance";

export const itineraryAPI = {
  generate: async (data) => {
    const response = await api.post("/api/itinerary/generate", data);
    return response.data.data;
  },

  getAll: async (params = {}) => {
    const response = await api.get("/api/itinerary", { params });
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/itinerary/${id}`);
    return response.data.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/api/itinerary/${id}`, data);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/itinerary/${id}`);
    return response.data.data;
  },

  share: async (id, data) => {
    const response = await api.post(`/api/itinerary/${id}/share`, data);
    return response.data.data;
  },
};

export const activityAPI = {
  add: async (dayId, data) => {
    const response = await api.post(`/api/itinerary/day/${dayId}/activity`, data);
    return response.data.data;
  },

  update: async (activityId, data) => {
    const response = await api.patch(`/api/itinerary/activity/${activityId}`, data);
    return response.data.data;
  },

  delete: async (activityId) => {
    const response = await api.delete(`/api/itinerary/activity/${activityId}`);
    return response.data.data;
  },

  getAlternatives: async (activityId) => {
    const response = await api.post(`/api/itinerary/activity/${activityId}/alternatives`);
    return response.data.data;
  },

  replace: async (activityId, data) => {
    const response = await api.put(`/api/itinerary/activity/${activityId}/replace`, data);
    return response.data.data;
  },

  getReviews: async (activityId) => {
    const response = await api.get(`/api/itinerary/activity/${activityId}/reviews`);
    return response.data.data;
  },
};
