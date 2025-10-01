import { useState } from 'react';
import VerifyOTPForm from '@/shared/components/auth/VerifyOTPForm';
import useSocialAuth from '@/shared/hooks/useSocialAuth';
import { useNavigate } from 'react-router-dom';
import AuthService from '@/shared/services/auth.service';

const VerifyOTPPage = ({ userType }) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleVerifyOTP = async (formData) => {
    console.log('OTP Verification data:', formData);
    setLoading(true);
    try {
      await AuthService.verifyOtp(formData.email, formData.otp);

      navigate(`/${userType}/create-account`, {
        state: { email: formData.email },
      });
    } catch (error) {
      showAlert(
        error.response?.data?.message ||
          'OTP verification failed. Please try again.',
        'error'
      );
      console.error('Error verifying OTP:', error);
    }
    setLoading(false);
  };

  const showAlert = (message, severity = 'success') => {
    setAlert({ message, severity });
  };

  const { handleGoogleLogin, handleFacebookLogin, handleXLogin } =
    useSocialAuth();

  return (
    <VerifyOTPForm
      userType={userType}
      onSubmit={handleVerifyOTP}
      loading={loading}
      onGoogleLogin={handleGoogleLogin}
      onFacebookLogin={handleFacebookLogin}
      onXLogin={handleXLogin}
      alert={alert}
    />
  );
};

export default VerifyOTPPage;
