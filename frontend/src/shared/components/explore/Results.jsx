import { Search } from "@mui/icons-material";
import { Box, Fade, Paper, Typography } from "@mui/material";
import MenuCard from "./cards/MenuCard";
import RoomCard from "./cards/RoomCard";
import ServiceCard from "./cards/ServiceCard";
import TicketCard from "./cards/TicketCard";
import TourCard from "./cards/TourCard";
import ResultSection from "./ResultSection";

const Results = ({ filtered, currentTab }) => {
  const hasResults = Object.values(filtered).some((arr) => arr && arr.length > 0);

  if (!hasResults) {
    return (
      <Paper elevation={0} sx={{ p: 8, textAlign: "center", borderRadius: 2 }}>
        <Search sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 600,
            color: "text.secondary",
            mb: 1,
          }}
        >
          No results found
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>Try adjusting your search criteria</Typography>
      </Paper>
    );
  }

  return (
    <Fade in timeout={600}>
      <Box>
        {filtered.services && filtered.services.length > 0 && (
          <ResultSection title="Services" count={filtered.services.length} currentTab={currentTab}>
            {filtered.services.map((item) => (
              <ServiceCard key={item.id} data={item} />
            ))}
          </ResultSection>
        )}

        {filtered.rooms && filtered.rooms.length > 0 && (
          <ResultSection title="Rooms" count={filtered.rooms.length} currentTab={currentTab}>
            {filtered.rooms.map((item) => (
              <RoomCard key={item.id} data={item} />
            ))}
          </ResultSection>
        )}

        {filtered.menus && filtered.menus.length > 0 && (
          <ResultSection title="Menus" count={filtered.menus.length} currentTab={currentTab}>
            {filtered.menus.map((item) => (
              <MenuCard key={item.id} data={item} />
            ))}
          </ResultSection>
        )}

        {filtered.tickets && filtered.tickets.length > 0 && (
          <ResultSection title="Tickets" count={filtered.tickets.length} currentTab={currentTab}>
            {filtered.tickets.map((item) => (
              <TicketCard key={item.id} data={item} />
            ))}
          </ResultSection>
        )}

        {filtered.tours && filtered.tours.length > 0 && (
          <ResultSection title="Tours" count={filtered.tours.length} currentTab={currentTab}>
            {filtered.tours.map((item) => (
              <TourCard key={item.id} data={item} />
            ))}
          </ResultSection>
        )}
      </Box>
    </Fade>
  );
};

export default Results;
