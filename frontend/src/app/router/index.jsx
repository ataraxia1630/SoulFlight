import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import AdminHome from "@/features/admin/pages/Home";
import BusinessHome from "@/features/business/pages/Home";
import TravelerHome from "@/features/traveler/pages/Home";
import AuthLayout from "@/layouts/AuthLayout";
// Layouts
import MainLayout from "@/layouts/MainLayout";
import CompleteProfileBusinessPage from "@/shared/pages/CompleteProfileBusinessPage";
import CompleteProfileTravelerPage from "@/shared/pages/CompleteProfileTravelerPage";
import CreateAccountPage from "@/shared/pages/CreateAccountPage";
// Role Pages
import HomePage from "@/shared/pages/HomePage";
// Auth Pages
import LoginPage from "@/shared/pages/LoginPage";
import SignupPage from "@/shared/pages/SignupPage";
import VerifyOTPPage from "@/shared/pages/VerifyOTPPage";
import App from "../App";

// Auth flow routes configuration
const createAuthRoutes = (userType) => {
  const CompleteProfilePage =
    userType === "traveler" ? CompleteProfileTravelerPage : CompleteProfileBusinessPage;

  return (
    <>
      <Route path={`${userType}/signup`} element={<SignupPage userType={userType} />} />
      <Route path={`${userType}/verify-otp`} element={<VerifyOTPPage userType={userType} />} />
      <Route
        path={`${userType}/create-account`}
        element={<CreateAccountPage userType={userType} />}
      />
      <Route path={`${userType}/complete-profile`} element={<CompleteProfilePage />} />
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="admin" element={<AdminHome />} />
        <Route path="business" element={<BusinessHome />} />
        <Route path="traveler" element={<TravelerHome />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        {createAuthRoutes("traveler")}
        {createAuthRoutes("business")}
      </Route>
    </Route>,
  ),
);

export default router;
