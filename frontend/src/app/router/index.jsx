import { createBrowserRouter } from "react-router-dom";
import App from "../App";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";

// Auth Pages
import LoginPage from "@/shared/components/LoginPage";
import SignupBusinessPage from "@/features/business/pages/auth/SignupPage";
import SignupTravelerPage from "@/features/traveler/pages/auth/SignupPage";

// Role Pages
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
          { path: "admin", element: <AdminHome /> },
          { path: "business", element: <BusinessHome /> },
          { path: "traveler", element: <TravelerHome /> },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "signup/business", element: <SignupBusinessPage /> },
          { path: "signup/traveler", element: <SignupTravelerPage /> },
        ],
      },
    ],
  },
]);

export default router;