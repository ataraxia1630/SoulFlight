import { Route } from "react-router-dom";
import AdminHome from "@/features/admin/pages/Home";

const adminRoutes = (
  <>
    <Route path="admin" element={<AdminHome />} />
    {/* Add routes */}
  </>
);

export default adminRoutes;
