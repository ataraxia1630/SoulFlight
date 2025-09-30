import { useState } from 'react';
import SignupForm from '@/shared/components/auth/SignupForm';
import useSocialAuth from '@/shared/hooks/useSocialAuth';
import { useNavigate } from 'react-router-dom';
import SignupService from '@/shared/services/signup.service';

const SignupPage = ({ userType }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (formData) => {
    console.log('Signup data:', formData);
    setLoading(true);

    try {
      await SignupService.sendOtp(formData.email);
      navigate(`/${userType}/verify-otp`, { state: { email: formData.email } });
    } catch (error) {
      alert(
        error.response?.data?.message || 'Failed to send OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const { handleGoogleLogin, handleFacebookLogin, handleXLogin } =
    useSocialAuth();

  return (
    <SignupForm
      userType={userType}
      onSubmit={handleSignup}
      loading={loading}
      onGoogleLogin={handleGoogleLogin}
      onFacebookLogin={handleFacebookLogin}
      onXLogin={handleXLogin}
    />
  );
};

export default SignupPage;
