import PartnerRegistration from "@admin/pages/PartnerRegistration";
import { Route } from "react-router-dom";
import AdminHome from "@/features/admin/pages/Home";

const adminRoutes = (
  <>
    <Route path="admin" element={<AdminHome />} />
    {/* Add routes */}
    <Route path="admin/partner-registration" element={<PartnerRegistration />} />
  </>
);

export default adminRoutes;
