import { useState } from "react";
import LoginForm from "@/shared/components/auth/LoginForm";
import useSocialAuth from "@/shared/hooks/useSocialAuth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", severity: "success" });
  const navigate = useNavigate();

  const showAlert = (message, severity = "success") => {
    setAlert({ message, severity });
  };

  const handleLogin = (formData) => {
    console.log("Login data:", formData);

    // Ex
    showAlert("Login successful!", "success");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 2000);

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
