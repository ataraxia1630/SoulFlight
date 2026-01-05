import { Route } from "react-router-dom";
import TravelerHome from "@/features/traveler/pages/Home";
import WalletPage from "@/shared/pages/Wallet/WalletPage";
import BookingHistory from "../../features/traveler/pages/Booking/BookingHistory";
import CartPage from "../../features/traveler/pages/Cart/CartPage";
import CheckoutPage from "../../features/traveler/pages/Checkout/CheckoutPage";
import PaymentResultPage from "../../features/traveler/pages/Checkout/PaymentResultPage";
import Journal from "../../features/traveler/pages/Journal";
import JournalDetailPage from "../../features/traveler/pages/Journal/JournalDetailPage";
import JournalEditorPage from "../../features/traveler/pages/Journal/JournalEditorPage";
import ExplorePlace from "../../features/traveler/pages/Place";
import PlaceDetailsPage from "../../features/traveler/pages/Place/PlaceDetailPage";
import ItinerariesListPage from "../../features/traveler/pages/Planner/ItinerariesListPage";
import ItineraryPage from "../../features/traveler/pages/Planner/ItineraryPage";
import MenuDetail from "../../features/traveler/pages/ServiceDetail/MenuDetail";
import RoomDetail from "../../features/traveler/pages/ServiceDetail/RoomDetail";
import TicketDetail from "../../features/traveler/pages/ServiceDetail/TicketDetail";
import TourDetail from "../../features/traveler/pages/ServiceDetail/TourDetail";
import Wishlist from "../../features/traveler/pages/Wishlist";
import { createAuthRoutes } from "./auth.route";
import ProtectedRoute from "./ProtectedRoute";

const USER_TYPE = "traveler";

const mainRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["TRAVELER"]} />}>
    <Route path="traveler" element={<TravelerHome />} />
    <Route path="itineraries" element={<ItinerariesListPage />} />
    <Route path="itinerary/:id" element={<ItineraryPage />} />
    <Route path="travel-planner" element={<ItineraryPage />} />
    <Route path="love-service" element={<Wishlist />} />
    <Route path="/rooms/:roomId" element={<RoomDetail />} />
    <Route path="/tours/:tourId" element={<TourDetail />} />
    <Route path="/tickets/:ticketId" element={<TicketDetail />} />
    <Route path="/menus/:menuId" element={<MenuDetail />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/booking/history" element={<BookingHistory />} />
    <Route path="/wallet" element={<WalletPage />} />
    <Route path="/payment/result" element={<PaymentResultPage />} />
    <Route path="place" element={<ExplorePlace />} />
    <Route path="place/:id" element={<PlaceDetailsPage />} />
    <Route path="/journal" element={<Journal />} />
    <Route path="/journal/:id" element={<JournalDetailPage />} />
    <Route path="/journal/create" element={<JournalEditorPage />} />
    <Route path="/journal/edit/:id" element={<JournalEditorPage />} />
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
