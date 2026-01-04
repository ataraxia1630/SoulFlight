import Facilities from "@admin/pages/Facilities";
import PartnerRegistration from "@admin/pages/PartnerRegistration";
import Place from "@admin/pages/Place";
import PlaceDetail from "@admin/pages/Place/Components/PlaceDetail";
import PlaceForm from "@admin/pages/Place/Components/PlaceForm";
import Report from "@admin/pages/Report";
import ServiceOverview from "@admin/pages/ServiceOverview";
import Services from "@admin/pages/Services";
import ServiceTags from "@admin/pages/ServiceTags";
import ServiceTypes from "@admin/pages/ServiceTypes";
import Users from "@admin/pages/Users";
import { Route } from "react-router-dom";
import AdminHome from "@/features/admin/pages/Home";
import AdminApplicationDetail from "../../features/admin/pages/PartnerRegistration/AdminApplicationDetail";
import Voucher from "../../features/admin/pages/Voucher/Voucher";
import Booking from "../../shared/pages/Booking/Booking";
import Statistic from "../../shared/pages/Statistic/Statistic";
import ProtectedRoute from "./ProtectedRoute";

const adminRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
    <Route path="admin/dashboard" element={<AdminHome />} />
    <Route path="admin/partner-registration" element={<PartnerRegistration />} />
    <Route path="admin/applications/:applicationId" element={<AdminApplicationDetail />} />
    {/* add routes */}
    <Route path="admin/facilities" element={<Facilities />} />
    <Route path="admin/service_type" element={<ServiceTypes />} />
    <Route path="admin/tag" element={<ServiceTags />} />
    <Route path="admin/user" element={<Users />} />
    <Route path="admin/service" element={<Services />} />
    <Route path="admin/report" element={<Report />} />
    <Route path="admin/place" element={<Place />} />
    <Route path="admin/place/create" element={<PlaceForm />} />
    <Route path="admin/place/edit/:id" element={<PlaceForm />} />
    <Route path="admin/place/:id" element={<PlaceDetail />} />
    <Route path="admin/voucher" element={<Voucher />} />
    <Route path="admin/service_overview" element={<ServiceOverview />} />
    <Route path="admin/booking" element={<Booking userRole="ADMIN" />} />
    <Route path="admin/statistic" element={<Statistic userRole="ADMIN" />} />
  </Route>
);

export default adminRoutes;
