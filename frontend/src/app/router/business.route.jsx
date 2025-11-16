import PartnerRegistration from "@business/pages/PartnerRegistration";
import RegistrationWizard from "@business/pages/PartnerRegistration/RegistrationWizard";
import ReviewSubmitPage from "@business/pages/PartnerRegistration/ReviewSubmitPage";
import { Route } from "react-router-dom";
import { FormDataProvider } from "@/features/business/context/FormDataContext";
import BusinessHome from "@/features/business/pages/Home";
import PartnerRegistrationLayout from "../../layouts/PartnerRegistrationLayout";
import { createAuthRoutes } from "./auth.route";
import ProtectedRoute from "./ProtectedRoute";

const USER_TYPE = "business";

const mainRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["PROVIDER"]} />}>
    <Route path="business/dashboard" element={<BusinessHome />} />

    <Route
      path="business/partner-registration"
      element={
        <FormDataProvider>
          <PartnerRegistrationLayout />
        </FormDataProvider>
      }
    >
      <Route index element={<PartnerRegistration />} />
      <Route path="stay" element={<RegistrationWizard defaultModel="Stay" />} />
      <Route path="fnb" element={<RegistrationWizard defaultModel="FnB" />} />
      <Route path="review-submit" element={<ReviewSubmitPage />} />
    </Route>

    {/* add routes */}
  </Route>
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
