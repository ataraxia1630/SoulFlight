import React from "react";
import LoginForm from "@/shared/components/auth/LoginForm";

const LoginPage = () => {
  const handleLogin = (formData) => {
    console.log("Login data:", formData);
    // Xử lý logic login ở đây
  };

  const handleGoogleLogin = () => {
    console.log("Google login");
    // Xử lý Google login
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login");
    // Xử lý Facebook login
  };

  const handleTwitterLogin = () => {
    console.log("Twitter login");
    // Xử lý Twitter login
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      onGoogleLogin={handleGoogleLogin}
      onFacebookLogin={handleFacebookLogin}
      onTwitterLogin={handleTwitterLogin}
    />
  );
};

export default LoginPage;