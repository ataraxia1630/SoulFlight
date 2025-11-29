import Facilities from "@admin/pages/Facilities";
import PartnerRegistration from "@admin/pages/PartnerRegistration";
import Provider from "@admin/pages/Provider";
import ServiceTags from "@admin/pages/ServiceTags";
import ServiceTypes from "@admin/pages/ServiceTypes";
import { Route } from "react-router-dom";
import AdminHome from "@/features/admin/pages/Home";
import Traveler from "@/features/admin/pages/Traveler";
import ProtectedRoute from "./ProtectedRoute";

const adminRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
    <Route path="admin/dashboard" element={<AdminHome />} />
    <Route path="admin/partner-registration" element={<PartnerRegistration />} />
    {/* add routes */}
    <Route path="admin/facilities" element={<Facilities />} />
    <Route path="admin/service_type" element={<ServiceTypes />} />
    <Route path="admin/tag" element={<ServiceTags />} />
    <Route path="admin/traveler" element={<Traveler />} />
    <Route path="admin/business" element={<Provider />} />
  </Route>
);

export default adminRoutes;
