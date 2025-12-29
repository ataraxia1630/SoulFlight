import { Route } from "react-router-dom";
import TravelerHome from "@/features/traveler/pages/Home";
import Booking from "../../features/traveler/pages/Booking/Booking";
// import CartPage from '../../features/traveler/pages/Cart/CartPage';
import CheckoutPage from "../../features/traveler/pages/Checkout/CheckoutPage";
import ItinerariesListPage from "../../features/traveler/pages/Planner/ItinerariesListPage";
import ItineraryPage from "../../features/traveler/pages/Planner/ItineraryPage";
import MenuDetail from "../../features/traveler/pages/ServiceDetail/MenuDetail";
import RoomDetail from "../../features/traveler/pages/ServiceDetail/RoomDetail";
import TicketDetail from "../../features/traveler/pages/ServiceDetail/TicketDetail";
import TourDetail from "../../features/traveler/pages/ServiceDetail/TourDetail";
// import ServiceCart from '../../features/traveler/pages/ServiceCart';
import Wishlist from "../../features/traveler/pages/Wishlist";
import { createAuthRoutes } from "./auth.route";
import ProtectedRoute from "./ProtectedRoute";

// import BookingManagement from '../../features/traveler/pages/Booking/BookingManagement';
// import PaymentResultPage from '../../features/traveler/pages/Checkout/PaymentResultPage';

const USER_TYPE = "traveler";

const mainRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["TRAVELER"]} />}>
    <Route path="traveler" element={<TravelerHome />} />
    {/* add routes */}
    {/* <Route path="cart" element={<ServiceCart />} /> */}
    <Route path="booking" element={<Booking />} />
    <Route path="itineraries" element={<ItinerariesListPage />} />
    <Route path="itinerary/:id" element={<ItineraryPage />} />
    <Route path="travel-planner" element={<ItineraryPage />} />
    <Route path="love-service" element={<Wishlist />} />
    <Route path="/rooms/:roomId" element={<RoomDetail />} />
    <Route path="/tours/:tourId" element={<TourDetail />} />
    <Route path="/tickets/:ticketId" element={<TicketDetail />} />
    <Route path="/menus/:menuId" element={<MenuDetail />} />
    {/* <Route path="/cart" element={<CartPage />} /> */}
    <Route path="/checkout" element={<CheckoutPage />} />
    {/* <Route path="/payment/result" element={<PaymentResultPage />} /> */}
    {/* <Route path="/bookings/my" element={<BookingManagement />} /> */}
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
