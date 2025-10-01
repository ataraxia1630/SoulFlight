import { useState } from 'react';
import useSocialAuth from '@/shared/hooks/useSocialAuth';
import { useNavigate } from 'react-router-dom';
import CompleteProfileTravelerForm from '@/shared/components/auth/CompleteProfileTravelerForm';
import AuthService from '../services/auth.service';

const CompleteProfileTravelerPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCompleteProfile = async (formData) => {
    setLoading(true);
    try {
      const email = localStorage.getItem('email');
      await AuthService.createTraveler({ ...formData, email });
      navigate(`/login`);
    } catch (error) {
      alert('Error creating traveler profile. Please try again.');
      console.error('Error creating traveler profile:', error);
    }
  };

  const { handleGoogleLogin, handleFacebookLogin, handleXLogin } =
    useSocialAuth();

  return (
    <CompleteProfileTravelerForm
      onSubmit={handleCompleteProfile}
      loading={loading}
      onGoogleLogin={handleGoogleLogin}
      onFacebookLogin={handleFacebookLogin}
      onXLogin={handleXLogin}
    />
  );
};

export default CompleteProfileTravelerPage;
