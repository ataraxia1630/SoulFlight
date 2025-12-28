import {
  ConfirmationNumber,
  Hotel,
  RateReview,
  Restaurant,
  TourOutlined,
} from "@mui/icons-material";
import { Box, Card, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import MenusList from "./tabs/MenuList";
import ReviewsList from "./tabs/ReviewList";
import RoomsList from "./tabs/RoomList";
import TicketsList from "./tabs/TicketList";
import ToursList from "./tabs/TourList";

const ServiceTabs = ({ rooms, menus, tours, tickets, reviews, serviceId, onRefresh }) => {
  const [tabValue, setTabValue] = useState(0);

  const hasRooms = rooms.length > 0;
  const hasMenus = menus.length > 0;
  const hasTours = tours.length > 0;
  const hasTickets = tickets.length > 0;

  const tabs = [];
  if (hasRooms) tabs.push("rooms");
  if (hasMenus) tabs.push("menus");
  if (hasTours) tabs.push("tours");
  if (hasTickets) tabs.push("tickets");
  tabs.push("reviews");

  const handleTabChange = (_event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Card>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
      >
        {hasRooms && (
          <Tab icon={<Hotel />} label={`Phòng (${rooms.length})`} iconPosition="start" />
        )}
        {hasMenus && (
          <Tab icon={<Restaurant />} label={`Menu (${menus.length})`} iconPosition="start" />
        )}
        {hasTours && (
          <Tab icon={<TourOutlined />} label={`Tour (${tours.length})`} iconPosition="start" />
        )}
        {hasTickets && (
          <Tab
            icon={<ConfirmationNumber />}
            label={`Vé (${tickets.length})`}
            iconPosition="start"
          />
        )}
        <Tab icon={<RateReview />} label={`Đánh giá (${reviews.length})`} iconPosition="start" />
      </Tabs>

      <Box sx={{ p: 2.5 }}>
        {tabs[tabValue] === "rooms" && <RoomsList rooms={rooms} />}
        {tabs[tabValue] === "menus" && <MenusList menus={menus} />}
        {tabs[tabValue] === "tours" && <ToursList tours={tours} />}
        {tabs[tabValue] === "tickets" && <TicketsList tickets={tickets} />}
        {tabs[tabValue] === "reviews" && (
          <ReviewsList
            serviceId={serviceId}
            rooms={rooms}
            menus={menus}
            tours={tours}
            tickets={tickets}
            onRefresh={onRefresh}
          />
        )}
      </Box>
    </Card>
  );
};

export default ServiceTabs;
