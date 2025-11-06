import axios from "axios";
import { useAuthStore } from "@/app/store";
import api from "../utils/axiosInstance";

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/auth`;

const AuthService = {
  sendOtp: async (email) => {
    console.log("API_URL = ", API_URL);

    const response = await axios
      .post(`${API_URL}/send-otp`, { email })
      .then((res) => {
        localStorage.setItem("email", email);
        return res;
      })
      .catch((error) => {
        console.error("Error sending OTP:", error);
        throw error;
      });
    console.log("OTP sent successfully:", response.data);
    return response.data;
  },

  resendOtp: async (email) => {
    const response = await axios
      .post(`${API_URL}/resend-otp`, { email })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.error("Error resending OTP:", error);
        throw error;
      });
    console.log("OTP resent successfully:", response.data);
    return response.data;
  },

  verifyOtp: async (email, otp) => {
    await axios
      .post(`${API_URL}/verify-otp`, { email, otp })
      .then((res) => {
        const { verify_token } = res.data.data;
        console.log("Storing verify_token in localStorage:", verify_token);
        localStorage.setItem("verify_token", verify_token);
        return res.data;
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error);
        throw error;
      });
  },

  createUser: async (data) => {
    const response = await axios
      .post(`${API_URL}/create-user`, data)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        throw error;
      });
    return response;
  },

  createTraveler: async (data) => {
    const response = await axios
      .post(`${API_URL}/create-traveler`, data)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.error("Error creating traveler:", error);
        throw error;
      });
    return response;
  },

  createProvider: async (data) => {
    const response = await axios
      .post(`${API_URL}/create-provider`, data)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.error("Error creating provider:", error);
        throw error;
      });
    return response;
  },

  login: async (username, password, rememberMe) => {
    await axios
      .post(`${API_URL}/login`, { username, password, rememberMe })
      .then((res) => {
        const { access_token, refresh_token, user } = res.data.data;
        useAuthStore.getState().login({
          access_token,
          refresh_token,
          user,
        });
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        throw error;
      });
  },

  logout: async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      useAuthStore.getState().logout();
      localStorage.clear();
      window.location.href = "/login";
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await axios.post(`${API_URL}/refresh-token`, {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token } = response.data.data;

      useAuthStore.getState().updateTokens(access_token, refresh_token);

      return response.data;
    } catch (error) {
      console.error("Refresh token failed:", error);
      throw error;
    }
  },
};

console.log("API_URL = ", API_URL);

export default AuthService;
