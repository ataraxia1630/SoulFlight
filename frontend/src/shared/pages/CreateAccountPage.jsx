import { useState } from "react";
import useSocialAuth from "@/shared/hooks/useSocialAuth";
import { useNavigate } from "react-router-dom";
import CreateAccountForm from "@/shared/components/auth/CreateAccountForm";

const CreateAccoutPage = ({ userType }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateAccount = (formData) => {
    console.log("Create account data:", formData);
    // logic here
  };

  const { handleGoogleLogin, handleFacebookLogin, handleXLogin } =
    useSocialAuth();

  return (
    <CreateAccountForm
      userType={userType}
      onSubmit={handleCreateAccount}
      loading={loading}
      onGoogleLogin={handleGoogleLogin}
      onFacebookLogin={handleFacebookLogin}
      onXLogin={handleXLogin}
    />
  );
};

export default CreateAccoutPage;
