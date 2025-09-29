import { useState } from "react";
import VerifyOTPForm from "@/shared/components/auth/VerifyOTPForm";
import useSocialAuth from "@/shared/hooks/useSocialAuth";

const VerifyOTPPage = ({ userType }) => {
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async (formData) => {
    console.log("OTP Verification data:", formData);
    // logic here
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
