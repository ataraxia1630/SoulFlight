import { Box } from "@mui/material";
import BookingContact from "../../components/BookingContact";
import RoomCard from "../../components/RoomCard";

export default function Booking() {
  return (
    <Box>
      <RoomCard />
      <BookingContact />
    </Box>
  );
}
