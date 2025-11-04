import { Route } from "react-router-dom";
import TravelerHome from "@/features/traveler/pages/Home";
import ExplorePage from "../../shared/pages/ExplorePage";
import { createAuthRoutes } from "./auth.route";

const USER_TYPE = "traveler";

const mainRoutes = (
  <>
    <Route path="traveler" element={<TravelerHome />} />
    {/* Add routes */}
    <Route path="explore" element={<ExplorePage />} />
  </>
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
