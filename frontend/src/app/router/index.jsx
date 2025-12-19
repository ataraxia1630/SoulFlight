import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import ManagementLayout from "@/layouts/ManagementLayout";
import TravelerLayout from "@/layouts/TravelerLayout";
import ExplorePage from "@/shared/pages/ExplorePage";
import HomePage from "@/shared/pages/HomePage";
import LoginPage from "@/shared/pages/LoginPage";
import ServiceDetailPage from "@/shared/pages/ServiceDetailPage";
import App from "../App";
import adminRoutes from "./admin.route";
import businessRoutes from "./business.route";
import travelerRoutes from "./traveler.route";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route element={<ManagementLayout />}>
        {adminRoutes}
        {businessRoutes.main}
      </Route>

      <Route element={<TravelerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        {travelerRoutes.main}
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        {travelerRoutes.auth}
        {businessRoutes.auth}
      </Route>
    </Route>,
  ),
);

export default router;
