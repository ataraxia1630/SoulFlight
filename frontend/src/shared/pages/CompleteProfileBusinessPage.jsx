import { useState } from "react";
import useSocialAuth from "@/shared/hooks/useSocialAuth";
import { useNavigate } from "react-router-dom";
import CompleteProfileBusinessForm from "@/shared/components/auth/CompleteProfileBusinessForm";

const CompleteProfileBusinessPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCompleteProfile = (formData) => {
    console.log("Complete profile data:", formData);
    // logic here
  };

  const { handleGoogleLogin, handleFacebookLogin, handleXLogin } =
    useSocialAuth();

  return (
    <CompleteProfileBusinessForm
      onSubmit={handleCompleteProfile}
      loading={loading}
      onGoogleLogin={handleGoogleLogin}
      onFacebookLogin={handleFacebookLogin}
      onXLogin={handleXLogin}
    />
  );
};

export default CompleteProfileBusinessPage;
