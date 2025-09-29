import { useState } from "react";
import LoginForm from "@/shared/components/auth/LoginForm";
import useSocialAuth from "@/shared/hooks/useSocialAuth";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (formData) => {
    console.log("Login data:", formData);
  };

  const { handleGoogleLogin, handleFacebookLogin, handleXLogin } =
    useSocialAuth();

  return (
    <LoginForm
      onSubmit={handleLogin}
      loading={loading}
      onGoogleLogin={handleGoogleLogin}
      onFacebookLogin={handleFacebookLogin}
      onXLogin={handleXLogin}
    />
  );
};

export default LoginPage;
