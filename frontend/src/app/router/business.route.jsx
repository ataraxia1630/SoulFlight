import PartnerRegistration from "@business/pages/PartnerRegistration";
import RegistrationWizard from "@business/pages/PartnerRegistration/RegistrationWizard";
import ReviewSubmitPage from "@business/pages/PartnerRegistration/ReviewSubmitPage";
import RoomUpdatePage from "@business/pages/Service/Components/RoomUpdatePage";
import ProviderServiceOverview from "@business/pages/ServiceOverview";
import { Route } from "react-router-dom";
import { FormDataProvider } from "@/features/business/context/FormDataContext";
import BusinessHome from "@/features/business/pages/Home";
import ProviderApplicationDetail from "../../features/business/pages/Applicants/ProviderApplicationDetail";
import ProviderApplicationsPage from "../../features/business/pages/Applicants/ProviderApplicationPage";
import ProviderDraftsPage from "../../features/business/pages/Applicants/ProviderDraftPage";
import Services from "../../features/business/pages/Service/Service";
import Voucher from "../../features/business/pages/Voucher/Voucher";
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
      <Route path="leisure" element={<RegistrationWizard defaultModel="Leisure" />} />
      <Route path="tour" element={<RegistrationWizard defaultModel="Tour" />} />
      <Route path="review-submit" element={<ReviewSubmitPage />} />
      <Route path="draft/:draftId" element={<RegistrationWizard />} />
      <Route path="draft" element={<ProviderDraftsPage />} />
      <Route path="applications/:applicationId" element={<ProviderApplicationDetail />} />
      <Route path="applications" element={<ProviderApplicationsPage />} />
      <Route path="applications/:applicationId/edit" element={<RegistrationWizard isEditMode />} />
    </Route>

    {/* add routes */}
    <Route path="business/service" element={<Services />} />
    <Route path="business/voucher" element={<Voucher />} />
    <Route path="business/service-overview" element={<ProviderServiceOverview />} />
    <Route path="business/services/stay/update/:id" element={<RoomUpdatePage />} />
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
