import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import HomePage from "@/shared/pages/HomePage";
import LoginPage from "@/shared/pages/LoginPage";
import travelerRoutes from "./traveler.route";
import businessRoutes from "./business.route";
import adminRoutes from "./admin.route";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        {adminRoutes}
        {businessRoutes.main}
        {travelerRoutes.main}
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        {travelerRoutes.auth}
        {businessRoutes.auth}
      </Route>
    </Route>
  )
);

export default router;
