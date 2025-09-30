import { useState } from 'react';
import VerifyOTPForm from '@/shared/components/auth/VerifyOTPForm';
import useSocialAuth from '@/shared/hooks/useSocialAuth';
import { useNavigate } from 'react-router-dom';
import SignupService from '@/shared/services/signup.service';


const VerifyOTPPage = ({ userType }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyOTP = async (formData) => {
    console.log('OTP Verification data:', formData);
    setLoading(true);
    try {
      const response = await SignupService.verifyOtp(
        formData.email,
        formData.otp
      );
      console.log('OTP verification response:', response);

      localStorage.setItem('verify_token', response.verify_token);
      navigate(`/${userType}/create-account`, {
        state: { email: formData.email },
      });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert(
        error.response?.data?.message ||
          'Failed to verify OTP. Please try again.'
      );
    }
    setLoading(false);
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
    />
  );
};

export default VerifyOTPPage;
