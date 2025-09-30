import { useState } from "react";
import useSocialAuth from "@/shared/hooks/useSocialAuth";
import { useNavigate } from "react-router-dom";
import CompleteProfileTravelerForm from "@/shared/components/auth/CompleteProfileTravelerForm";

const CompleteProfileTravelerPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCompleteProfile = (formData) => {
    console.log("Complete profile data:", formData);
    // logic here
    navigate("/");
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
