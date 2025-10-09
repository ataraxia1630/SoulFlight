import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateAccountForm from "@/shared/components/auth/CreateAccountForm";
import useSocialAuth from "@/shared/hooks/useSocialAuth";
import AuthService from "../services/auth.service";

const CreateAccoutPage = ({ userType }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateAccount = async (formData) => {
    setLoading(true);
    try {
      const verify_token = localStorage.getItem("verify_token");
      if (!verify_token) {
        throw new Error("Verification token not found. Please verify OTP first.");
      }
      const email = localStorage.getItem("email");
      const role = userType === "traveler" ? "TRAVELER" : "PROVIDER";
      console.log("Create account data:", {
        ...formData,
        verify_token,
        role,
        email,
      });
      await AuthService.createUser({ ...formData, verify_token, role, email });
      navigate(`/${userType}/complete-profile`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const { handleGoogleLogin, handleFacebookLogin, handleXLogin } = useSocialAuth();

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
