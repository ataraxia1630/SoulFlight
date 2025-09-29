import { createBrowserRouter } from "react-router-dom";
import App from "../App";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";

// Auth Pages
import LoginPage from "@/shared/pages/LoginPage";
import SignupPage from "@/shared/pages/SignupPage";
import VerifyOTPPage from "@/shared/pages/VerifyOTPPage";
import CreateAccoutPage from "@/shared/pages/CreateAccountPage";
import CompleteProfileTravelerPage from "../../shared/pages/CompleteProfileTravelerPage";
import CompleteProfileBusinessPage from "../../shared/pages/CompleteProfileBusinessPage";

// Role Pages
import HomePage from "@/shared/pages/HomePage";
import AdminHome from "@/features/admin/pages/Home";
import BusinessHome from "@/features/business/pages/Home";
import TravelerHome from "@/features/traveler/pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "admin", element: <AdminHome /> },
          { path: "business", element: <BusinessHome /> },
          { path: "traveler", element: <TravelerHome /> },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <LoginPage /> },

          {
            path: "traveler",
            children: [
              { path: "signup", element: <SignupPage userType="traveler" /> },
              {
                path: "verify-otp",
                element: <VerifyOTPPage userType="traveler" />,
              },
              {
                path: "create-account",
                element: <CreateAccoutPage userType="traveler" />,
              },
              {
                path: "complete-profile",
                element: <CompleteProfileTravelerPage />,
              },
            ],
          },

          {
            path: "business",
            children: [
              { path: "signup", element: <SignupPage userType="business" /> },
              {
                path: "verify-otp",
                element: <VerifyOTPPage userType="business" />,
              },
              {
                path: "create-account",
                element: <CreateAccoutPage userType="business" />,
              },
              {
                path: "complete-profile",
                element: <CompleteProfileBusinessPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
