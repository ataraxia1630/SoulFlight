import { Route } from "react-router-dom";
import TravelerHome from "@/features/traveler/pages/Home";
import ExplorePage from "../../shared/pages/ExplorePage";
import { createAuthRoutes } from "./auth.route";
import ProtectedRoute from "./ProtectedRoute";

const USER_TYPE = "traveler";

const mainRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["TRAVELER"]} />}>
    <Route path="traveler" element={<TravelerHome />} />
    <Route path="explore" element={<ExplorePage />} />
    {/* add routes */}
  </Route>
);

const authRoutes = createAuthRoutes({
  userType: USER_TYPE,
  CompleteProfilePage: "CompleteProfileTravelerPage",
});

const travelerRoutes = {
  main: mainRoutes,
  auth: authRoutes,
};

export default travelerRoutes;
