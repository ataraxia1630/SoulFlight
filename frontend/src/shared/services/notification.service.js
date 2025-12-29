import api from "@/shared/utils/axiosInstance";

const BASE = "/api/notification";

const NotificationService = {
  getAll: async () => {
    const response = await api.get(BASE);
    return response.data;
  },

  countUnread: async () => {
    const response = await api.get(`${BASE}/unread-count`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${BASE}/${id}`);
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`${BASE}/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put(`${BASE}/read-all`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${BASE}/${id}`);
    return response.data;
  },

  deleteAll: async () => {
    const response = await api.delete(BASE);
    return response.data;
  },
};

export default NotificationService;
