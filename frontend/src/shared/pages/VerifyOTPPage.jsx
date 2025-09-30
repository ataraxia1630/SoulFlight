import { useState } from "react";
import VerifyOTPForm from "@/shared/components/auth/VerifyOTPForm";
import useSocialAuth from "@/shared/hooks/useSocialAuth";
import { useNavigate } from "react-router-dom";

const VerifyOTPPage = ({ userType }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyOTP = async (formData) => {
    console.log("OTP Verification data:", formData);
    // logic here
    navigate(`/${userType}/create-account`);
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
