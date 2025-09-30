import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL + '/api/auth';

const SignupService = {
  sendOtp: async (email) => {
    console.log('API_URL = ', API_URL);

    const response = await axios
      .post(`${API_URL}/send-otp`, { email })
      .then((res) => {
        localStorage.setItem('email', email);
        return res;
      })
      .catch((error) => {
        console.error('Error sending OTP:', error);
        throw error;
      });
    console.log('OTP sent successfully:', response.data);
    return response.data;
  },

  resendOtp: async (email) => {
    const response = await axios
      .post(`${API_URL}/resend-otp`, { email })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.error('Error resending OTP:', error);
        throw error;
      });
    console.log('OTP resent successfully:', response.data);
    return response.data;
  },

  verifyOtp: async (email, otp) => {
    const response = await axios
      .post(`${API_URL}/verify-otp`, { email, otp })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.error('Error verifying OTP:', error);
        throw error;
      });
    console.log('OTP verified successfully:', response);
    return response;
  },

  signup: async (data) => {
    const response = await axios
      .post(`${API_URL}/signup`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.error('Error during signup:', error);
        throw error;
      });
    console.log('Signup successful:', response);
    return response;
  },
};

console.log('API_URL = ', API_URL);

export default SignupService;
