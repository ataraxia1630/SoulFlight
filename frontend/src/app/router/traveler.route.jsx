import { Route } from "react-router-dom";
import TravelerHome from "@/features/traveler/pages/Home";
import Booking from "../../features/traveler/pages/Booking/Booking";
import ItinerariesListPage from "../../features/traveler/pages/Planner/ItinerariesListPage";
import ItineraryPage from "../../features/traveler/pages/Planner/ItineraryPage";
import ServiceCart from "../../features/traveler/pages/ServiceCart";
import { createAuthRoutes } from "./auth.route";
import ProtectedRoute from "./ProtectedRoute";

const USER_TYPE = "traveler";

const mainRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["TRAVELER"]} />}>
    <Route path="traveler" element={<TravelerHome />} />
    {/* add routes */}
    <Route path="cart" element={<ServiceCart />} />
    <Route path="booking" element={<Booking />} />
    <Route path="itineraries" element={<ItinerariesListPage />} />
    <Route path="itinerary/:id" element={<ItineraryPage />} />
    <Route path="travel-planner" element={<ItineraryPage />} />
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
