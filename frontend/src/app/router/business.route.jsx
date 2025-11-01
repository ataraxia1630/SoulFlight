import PartnerRegistration from "@business/pages/PartnerRegistration";
import RegistrationWizard from "@business/pages/PartnerRegistration/RegistrationWizard";
import { Route } from "react-router-dom";
import BusinessHome from "@/features/business/pages/Home";
import { createAuthRoutes } from "./auth.route";

const USER_TYPE = "business";

const mainRoutes = (
  <>
    <Route path="business" element={<BusinessHome />} />
    {/* Add routes */}
    <Route path="business/partner-registration" element={<PartnerRegistration />} />
    <Route
      path="business/partner-registration/stay"
      element={<RegistrationWizard defaultModel="Stay" />}
    />
    <Route
      path="business/partner-registration/fnb"
      element={<RegistrationWizard defaultModel="FnB" />}
    />
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
