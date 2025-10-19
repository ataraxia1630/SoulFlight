import ServiceRegistrationPage from "@business/pages/service_registration";
import { Route } from "react-router-dom";
import BusinessHome from "@/features/business/pages/Home";
import { createAuthRoutes } from "./auth.route";

const USER_TYPE = "business";

const mainRoutes = (
  <>
    <Route path="business" element={<BusinessHome />} />
    {/* Add routes */}
    <Route path="business/service-registration" element={<ServiceRegistrationPage />} />
  </>
);

const authRoutes = createAuthRoutes({
  userType: USER_TYPE,
  CompleteProfilePage: "CompleteProfileBusinessPage",
});

const businessRoutes = {
  main: mainRoutes,
  auth: authRoutes,
};

export default businessRoutes;
