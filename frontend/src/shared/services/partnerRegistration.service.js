import api from "@/shared/utils/axiosInstance";

const API_BASE_URL = "/api/partner-registration";

const PartnerRegistrationAPI = {
  // Submit application
  submitApplicant: async (services) => {
    try {
      const response = await api.post(`${API_BASE_URL}/applicants`, {
        services,
      });
      console.log("submitApplicant response:", response);
      return response.data;
    } catch (error) {
      console.error("submitApplicant error:", error);
      throw error;
    }
  },

  // Save draft
  saveDraft: async (services, draft_id = null) => {
    try {
      const response = await api.post(`${API_BASE_URL}/drafts`, {
        services,
        draft_id,
      });
      console.log("saveDraft response:", response);
      return response.data;
    } catch (error) {
      console.error("saveDraft error:", error);
      throw error;
    }
  },

  // Get all drafts
  getDrafts: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/drafts`);
      console.log("getDrafts response:", response);
      return response.data;
    } catch (error) {
      console.error("getDrafts error:", error);
      throw error;
    }
  },

  // Delete draft
  deleteDraft: async (draft_id) => {
    const response = await api.delete(`${API_BASE_URL}/drafts/${draft_id}`);
    return response.data;
  },

  // Get pending/info_required applicants
  getApplicants: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/applicants`);
      console.log("getApplicants response:", response.data);
      return response.data;
    } catch (error) {
      console.error("getApplicants error:", error);
      throw error;
    }
  },

  // Get reviewed applicants (approved/rejected)
  getReviewedApplicants: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/applicants/reviewed`);
      console.log("getReviewedApplicants response:", response);
      return response.data;
    } catch (error) {
      console.error("getReviewedApplicants error:", error);
      throw error;
    }
  },

  // Update applicant (when INFO_REQUIRED)
  updateApplicant: async (applicant_id, services) => {
    const response = await api.put(`/partner-registration/applicants/${applicant_id}`, {
      services,
    });
    return response.data;
  },

  // Get all applicants with filters
  getAllApplicants: async (params = {}) => {
    try {
      const response = await api.get(`${API_BASE_URL}/applicants/all`, {
        params,
      });
      console.log("getAllApplicants response:", response.data);
      return response.data;
    } catch (error) {
      console.error("getAllApplicants error:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  // Get single applicant detail
  getApplicationById: async (applicant_id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/applicants/${applicant_id}`);
      console.log("getApplicantById response:", response.data);
      return response.data;
    } catch (error) {
      console.error("getApplicantById error:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },

  // Review applicant (approve/reject/require_info)
  reviewApplicant: async (applicant_id, status, admin_feedback) => {
    try {
      const response = await api.post(`${API_BASE_URL}/applicants/${applicant_id}/review`, {
        status,
        admin_feedback,
      });
      console.log("reviewApplicant response:", response.data);
      return response.data;
    } catch (error) {
      console.error("reviewApplicant error:", error);
      throw new Error(error.response?.data?.message || error);
    }
  },
};

export default PartnerRegistrationAPI;
