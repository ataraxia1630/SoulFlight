import { createBrowserRouter } from "react-router-dom";
import App from "../App";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";

import HomePage from "@/shared/pages/HomePage";
import LoginPage from "@/shared/pages/LoginPage";
import SignupPage from "@/shared/pages/SignupPage";

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
          { path: "signup/business", element: <SignupPage userType="business" /> },
          { path: "signup/traveler", element: <SignupPage userType="traveler" /> },
        ],
      },
    ],
  },
]);

export default router;