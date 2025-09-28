import React from "react";
import SignupForm from "@/shared/components/auth/SignupForm";

const SignupPage = ({ userType }) => {
  const handleSignup = (formData) => {
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
    <SignupForm
      userType={userType}
      onSubmit={handleSignup}
      onGoogleLogin={handleGoogleLogin}
      onFacebookLogin={handleFacebookLogin}
      onTwitterLogin={handleTwitterLogin}
    />
  );
};

export default SignupPage;
