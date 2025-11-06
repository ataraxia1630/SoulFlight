import PartnerRegistration from "@admin/pages/PartnerRegistration";
import { Route } from "react-router-dom";
import AdminHome from "@/features/admin/pages/Home";
import ProtectedRoute from "./ProtectedRoute";

const adminRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
    <Route path="admin" element={<AdminHome />} />
    <Route path="admin/partner-registration" element={<PartnerRegistration />} />
    {/* add routes */}
  </Route>
);

export default adminRoutes;
