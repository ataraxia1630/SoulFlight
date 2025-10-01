import { useState } from 'react';
import LoginForm from '@/shared/components/auth/LoginForm';
import useSocialAuth from '@/shared/hooks/useSocialAuth';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', severity: 'success' });
  const navigate = useNavigate();

  const showAlert = (message, severity = 'success') => {
    setAlert({ message, severity });
  };

  const handleLogin = async (formData) => {
    console.log('Login data:', formData);
    setLoading(true);
    try {
      await AuthService.login(
        formData.email,
        formData.password,
        formData.rememberMe
      );
      showAlert('Login successful!', 'success');
      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 2000);
    } catch (error) {
      showAlert(
        error.response?.data?.message || 'Invalid email or password!',
        'error'
      );
      console.error('Error during login:', error);
    } finally {
      setLoading(false);
    }

    // Nếu login thất bại:
    // showAlert("Invalid email or password!", "error");
  };

  const { handleGoogleLogin, handleFacebookLogin, handleXLogin } =
    useSocialAuth();

  return (
    <LoginForm
      onSubmit={handleLogin}
      alert={alert}
      loading={loading}
      onGoogleLogin={handleGoogleLogin}
      onFacebookLogin={handleFacebookLogin}
      onXLogin={handleXLogin}
    />
  );
};

export default LoginPage;
